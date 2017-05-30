'use strict';

const EventEmitter = require('events');

/*
 * Synchronization between editor instances. Usually by syncing with a
 * central server of some sort.
 *
 * Instances of this uses events to notify editors about changes. The main
 * event is `change` with a single @{link TaggedOperation} as its argument.
 *
 * Once connected a sync *must* emit all changes that occur after the returned
 * initial operation. The sync *must* emit these changes in order.
 *
 * @abstract
 */
class OperationSync {
	constructor(type) {
		if(! type) throw new Error('OperationSync needs access to the OTType');

		this.type = type;
		this.events = new EventEmitter();
	}

	/**
	 * Add an event listener to this sync.
	 */
	on(event, listener) {
		return this.addEventListener(event, listener);
	}

	/**
	 * Add an event listener to this sync.
	 */
	addEventListener(event, listener) {
		this.events.on(event, listener);
	}

	/**
	 * Connect and fetch the latest version of the document/model.
	 *
	 * @returns {TaggedOperation}
	 *   the latest version of the document/model being edited
	 */
	connect() {
		throw new Error('Not implemented');
	}

	/**
	 * Send an edit to other editors.

	 * @param {TaggedOperation} op
	 */
	send(op) {
		throw new Error('Not implemented');
	}

	/**
	 * Close this sync.
	 */
	close() {
	}

	static local(control) {
		return new LocalSync(control);
	}
}

const doLater = typeof setImmediate === 'undefined' ? setTimeout : setImmediate;

/**
 * A sync that works locally, useful for testing.
 */
class LocalSync extends OperationSync {

	constructor(control) {
		super(control.type);

		this.control = control;
		this.queue = [];
		this.promises = [];
	}

	connect() {
		return this.control.latest();
	}

	send(op) {
		this.queue.push(op);

		this.flush();
	}

	suspend() {
		this.suspended = true;
	}

	resume() {
		this.suspended = false;

		this.flush();
	}

	flush() {
		if(this.suspended) return;

		doLater(() => {
			let promise = Promise.resolve(true);
			this.queue.forEach(op => {
				promise = promise.then(() =>
					this.control.store(op.historyId, op.token, op.operation)
						.then((transformed) => {
							this.events.emit('change', transformed);
						})
				);
			});

			this.queue.length = 0;

			promise
				.then(() => {
					// Extra check to ensure that nothing new has been queued
					if(this.queue.length !== 0) return;

					doLater(() => {
						this.promises.forEach(promise => {
							promise.resolve();
						});

						this.promises.length = 0;
					});
				})
				.catch(e => {
					// eslint-disable-next-line no-console
					console.log('Error occured during flush', e.stack || e);
				});
		});
	}

	waitForEmpty() {
		return new Promise((resolve, reject) => {
			if(this.queue.length === 0) {
				resolve();
			} else {
				this.promises.push({
					resolve: resolve,
					reject: reject
				});
			}
		});
	}
}

module.exports = OperationSync;
