'use strict';

const EventEmitter = require('events');

const SYNCHRONIZED = 0;
const AWAITING_CONFIRM = 1;
const AWAITING_CONFIRM_WITH_BUFFER = 2;

class Editor {
	constructor(id, type, sync) {
		this.id = id;
		this.type = type;
		this.sync = sync;

		this.lastId = 0;

		this.state = SYNCHRONIZED;
		this.events = new EventEmitter();
	}

	connect() {
		return this.sync.connect(this.receive.bind(this))
			.then(initial => {
				this.parentHistoryId = initial.historyId;
				this.current = initial.operation;

				this.sync.addEventListener('change', this.receive.bind(this));

				return initial.operation;
			});
	}

	close() {
		this.sync.close();
	}

	addEventListener(event, listener) {
		this.events.on(event, listener);
	}

	on(event, listener) {
		return this.addEventListener(event, listener);
	}

	receive(op) {
		switch(this.state) {
			case SYNCHRONIZED:
				this.parentHistoryId = op.historyId;
				this.composeAndTriggerListeners(op.operation);
				break;
			case AWAITING_CONFIRM:
				if(this.lastSent.token === op.token) {
					/*
					 * This is the operation we previously sent, we have already
					 * applied this locally so we can safely switch to a
					 * synchronized sate.
					 */
					this.parentHistoryId = op.historyId;
					this.state = SYNCHRONIZED;
				} else {
					/*
					 * Someone else has edited the document before our own
					 * operation was applied. Transform the incoming operation
					 * over our sent operation.
					 */
					const transformed = this.type.transform(
						op.operation,
						this.lastSent.operation
					);

					/*
					 * We stay in our current state but replace lastSent with
					 * the transformed operation so any other edits can be
					 * safely applied.
					 */
					this.lastSent = {
						historyId: op.historyId,
						token: this.lastSent.token,
						operation: transformed.right
					};

					this.parentHistoryId = op.historyId;
					this.composeAndTriggerListeners(transformed.left);
				}
				break;
			case AWAITING_CONFIRM_WITH_BUFFER:
				if(this.lastSent.token === op.token) {
					/*
					 * This is the operation we previously sent, so request
					 * that we send our buffer and switch to awaiting confirm.
					 */
					this.parentHistoryId = op.historyId;
					this.state = AWAITING_CONFIRM;

					this.lastSent = {
						historyId: op.historyId,
						token: this.buffer.token,
						operation: this.buffer.operation
					};
					this.sync.send(this.lastSent);
				} else {
					/*
					 * Someone else has edited the document, rewrite both the
					 * incoming and our buffered operation.
					 */

					let transformed = this.type.transform(
						op.operation,
						this.lastSent.operation
					);

					/*
					 * As for awaiting confirm, we replace lastSent with a
					 * transformed operation
					 */
					this.lastSent = {
						historyId: op.historyId,
						token: this.lastSent.token,
						operation: transformed.right
					};

					/*
					 * Transform the already transformed remote operation over
					 * our buffer.
					 */
					transformed = this.type.transform(
						this.buffer.operation,
						transformed.left
					);

					this.buffer = {
						historyId: op.historyId,
						token: this.buffer.token,
						operation: transformed.left
					};

					this.parentHistoryId = op.historyId;
					this.composeAndTriggerListeners(transformed.right);
				}
				break;
			default:
				throw 'Unknown state: ' + this.state;
		}
	}

	/**
	 * Indicate that a local edit has been made and apply it to this editor,
	 * synchroizing it with other editors.
	 */
	apply(op) {
		if(typeof this.parentHistoryId === 'undefined') {
			throw 'Editor has not been connected';
		}

		// Compose together with the current operation
		this.current = this.type.compose(this.current, op);

		let tagged;
		switch(this.state) {
			case SYNCHRONIZED:
				/*
				 * Create a tagged version with a unique token and start
				 * tracking when it is applied.
				 */
				tagged = {
					historyId: this.parentHistoryId,
					token: this.id + '-' + (this.lastId++),
					operation: op
				};

				this.state = AWAITING_CONFIRM;
				this.lastSent = tagged;
				this.sync.send(tagged);
				break;
			case AWAITING_CONFIRM:
				/*
				 * We are already waiting for another operation to be applied,
				 * buffer this one.
				 */
				tagged = {
					historyId: this.parentHistoryId,
					token: this.id + '-' + (this.lastId++),
					operation: op
				};

				this.state = AWAITING_CONFIRM_WITH_BUFFER;
				this.buffer = tagged;
				break;
			case AWAITING_CONFIRM_WITH_BUFFER:
				/*
				 * We have something buffered, compose the buffer together
				 * with this edit.
				 */
				this.buffer.operation = this.type.compose(this.buffer.operation, op);
				break;
			default:
				throw 'Unknown state: ' + this.state;
		}

		this.events.emit('change', {
			operation: op,
			local: true
		});
	}

	composeAndTriggerListeners(op) {
		this.current = this.type.compose(this.current, op);
		this.events.emit('change', {
			operation: op,
			local: false
		});
	}
}

Editor.SYNCHRONIZED = SYNCHRONIZED;
Editor.AWAITING_CONFIRM = AWAITING_CONFIRM;
Editor.AWAITING_CONFIRM_WITH_BUFFER = AWAITING_CONFIRM_WITH_BUFFER;

module.exports = Editor;
