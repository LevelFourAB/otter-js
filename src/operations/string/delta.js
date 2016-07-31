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
class StringDelta {
	constructor() {
		this._ops = [];

		this._state = EMPTY;
		this._value = '';
	}

	_flush() {
		switch(this._state) {
			case RETAIN:
				if(this._retainCount > 0) {
					this._ops.push(new ops.Retain(this._retainCount));
				}
				break;
			case INSERT:
				if(this._value.length > 0) {
					const op = new ops.Insert(this._value);

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
				}
				break;
			case DELETE:
				if(this._value.length > 0) {
					this._ops.push(new ops.Delete(this._value));
				}
				break;
		}

		this._retainCount = 0;
		this._value = '';
	}

	retain(length) {
		if(length <= 0) return;

		if(this._state != RETAIN) {
			this._flush();
			this._state = RETAIN;
		}

		this._retainCount += length;
		return this;
	}

	insert(value) {
		if(this._state != INSERT) {
			this._flush();
			this._state = INSERT;
		}

		this._value += value;
		return this;
	}

	delete(value) {
		if(this._state != DELETE) {
			this._flush();
			this._state = DELETE;
		}

		this._value += value;
		return this;
	}

	done() {
		this._flush();
		return new CompoundOperation(this._ops);
	}
}

module.exports = StringDelta;
