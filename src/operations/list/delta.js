'use strict';

const ops = require('./ops');
const CompoundOperation = require('../compound-operation');

const EMPTY = 0;
const RETAIN = 1;
const INSERT = 2;
const DELETE = 3;

/**
 * Helper to create operations that indicate changes to a string.
 */
class ListDelta {
	constructor() {
		this._ops = [];

		this._retainCount = 0;
		this._state = EMPTY;
		this._items = [];
	}

	_flush() {
		switch(this._state) {
			case RETAIN:
				if(this._retainCount > 0) {
					this._ops.push(new ops.Retain(this._retainCount));
					this._retainCount = 0;
				}
				break;
			case INSERT:
				if(this._items.length > 0) {
					const op = new ops.Insert(this._items);

					/*
					 * If the previous operation is a delete operation we
					 * enforce that this insert comes before it.
					 */
					const previous = this._ops[this._ops.length - 1];
					if(previous instanceof ops.Delete) {
						this._ops[this._ops.length - 1] = op;
						this._ops.push(previous);
					} else {
						this._ops.push(op);
					}

					this._items.length = 0;
				}
				break;
			case DELETE:
				if(this._items.length > 0) {
					this._ops.push(new ops.Delete(this._items));
					this._items.length = 0;
				}
				break;
		}
	}

	_switchState(state) {
		if(this._state != state) {
			this._flush();
			this._state = state;
		}
	}

	retain(length) {
		if(length <= 0) return;

		this._switchState(RETAIN);

		this._retainCount += length;
		return this;
	}

	insert(item) {
		this._switchState(INSERT);

		this._items.push(item);
		return this;
	}

	insertMultiple(items) {
		this._switchState(INSERT);

		items.forEach(item => this._items.push(item));
		return this;
	}

	delete(item) {
		this._switchState(DELETE);

		this._items.push(item);
		return this;
	}

	deleteMultiple(items) {
		this._switchState(DELETE);

		items.forEach(item => this._items.push(item));
		return this;
	}

	adopt(op) {
		if(op instanceof ops.Retain) {
			this.retain(op.length);
		} else if(op instanceof ops.Insert) {
			this.insertMultiple(op.items);
		} else if(op instanceof ops.Delete) {
			this.deleteMultiple(op.items);
		} else {
			throw new Error('Unsupported operation: ' + op);
		}

		return this;
	}

	done() {
		this._flush();
		return new CompoundOperation(this._ops);
	}
}

module.exports = ListDelta;
