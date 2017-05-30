'use strict';

/**
 * Operation that consists of several operations in sequence.
 */
class CompoundOperation {
	constructor(ops) {
		this._ops = ops;
	}

	get operations() {
		return this._ops;
	}

	set operations(ops) {
		throw new Error('Can not set operations');
	}

	apply(handler) {
		this._ops.forEach(op => op.apply(handler));
	}

	invert() {
		return new CompoundOperation(this._ops.map(op => op.invert()));
	}

	/**
	 * Get the given operation as an array, even if it is not a compound
	 * operation to start with.
	 */
	static asArray(op) {
		if(op instanceof CompoundOperation) {
			return op.operations.slice(0);
		} else if(op && op.apply) {
			return [ op ];
		} else {
			throw new Error('No valid operation specified: ' + op);
		}
	}

	toString() {
		return 'CompoundOperation[' + this._ops + ']';
	}
}

module.exports = CompoundOperation;
