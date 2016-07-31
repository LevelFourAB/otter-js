'use strict';

const OperationIterator = require('../iterator');
const CompoundOperation = require('../compound-operation');
const ops = require('./ops');

function keyComparator(a, b) {
	return a.key < b.key ? -1 : (a.key > b.key ? 1 : 0);
}

/**
 * Compose two operations on a map.
 */
module.exports = function(left, right) {
	const it1 = new OperationIterator(left, keyComparator);
	const it2 = new OperationIterator(right, keyComparator);

	const result = [];

	while(it1.hasNext) {
		const op1 = it1.next();

		let handled = false;

		while(it2.hasNext) {
			const op2 = it2.next();

			const compared = keyComparator(op1, op2);
			if(compared > 0) {
				/*
				 * Left key is larger than right, so push the right key onto
				 * the result as we can't combine it with anything.
				 */

				result.push(op2);
				continue;
			} else if(compared < 0) {
				/*
				 * Left key is smaller than right, release it back for handling
				 * and try the next left operation.
				 */
				it2.back();
			} else {
				if(op1 instanceof ops.Set && op2 instanceof ops.Set) {
					it1.replace(new ops.Set(op1.key, op1.oldValue, op2.newValue));
				}

				handled = true;
			}
			break;
		}

		if(! handled) {
			result.push(op1);
		}
	}

	while(it2.hasNext) {
		result.push(it2.next());
	}

	result.sort(keyComparator);
	return new CompoundOperation(result);
};
