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

	const deltaLeft = [];
	const deltaRight = [];

	while(it1.hasNext) {
		const op1 = it1.next();

		let handled = false;

		while(it2.hasNext) {
			const op2 = it2.next();

			const compared = keyComparator(op1, op2);
			if(compared > 0) {
				/*
				 * Left key is larger than right, no transformation against
				 * left key to be done. Push right onto delta right.
				 */

				deltaRight.push(op2);
				continue;
			} else if(compared < 0) {
				/*
				 * Left key is less than right, back up right by one and
				 * let left key be added to delta left.
				 */
				it2.back();
			} else {
				if(op1 instanceof ops.Set && op2 instanceof ops.Set) {
					deltaRight.push(new ops.Set(op1.key, op1.newValue, op2.newValue));
				}

				handled = true;
			}

			break;
		}

		if(! handled) {
			deltaLeft.push(op1);
		}
	}

	while(it2.hasNext) {
		deltaRight.push(it2.next());
	}

	deltaLeft.sort(keyComparator);
	deltaRight.sort(keyComparator);
	return {
		left: new CompoundOperation(deltaLeft),
		right: new CompoundOperation(deltaRight)
	};
};
