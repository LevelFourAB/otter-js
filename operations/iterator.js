'use strict';

const CompoundOperation = require('./compound-operation');

/**
 * Iterator over operations. Can be created over any operation and uses
 * CompoundOperation to find individual operations.
 *
 * The iterator also supports changing the iteration by replacing operations
 * or going back to handle an operation again.
 */
class OperationIterator {
	constructor(op) {
		let ops = CompoundOperation.asArray(op);

		this.index = 0;
		this._ops = ops;
	}

	/**
	 * Get if more operations are available in this iterator.
	 */
	get hasNext() {
		return this.index < this._ops.length;
	}

	/**
	 * Advance and return the next operation.
	 */
	next() {
		if(this.index >= this._ops.length) {
			throw new Error('No more operations available');
		}

		let result = this._ops[this.index];
		this.index++;
		return result;
	}

	/**
	 * Go back one step in the iteration, to handle the current operation again.
	 */
	back() {
		if(this.index === 0) {
			throw new Error('Can not go back, iteration not started');
		}

		this.index--;
	}

	/**
	 * Replace the operation with a new one.
	 */
	replace(op) {
		if(this.index === 0) {
			throw new Error('Can not replace, iteration not started');
		}

		this.index--;
		this._ops[this.index] = op;
	}
}

module.exports = OperationIterator;
