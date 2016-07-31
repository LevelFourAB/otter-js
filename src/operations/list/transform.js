'use strict';

const OperationIterator = require('../iterator');
const ListDelta = require('./delta');
const ops = require('./ops');

/**
 * Main transformation for lists. Very similar to how strings are handled.
 */
module.exports = function(left, right) {
	left = new OperationIterator(left);
	right = new OperationIterator(right);

	const deltaLeft = new ListDelta();
	const deltaRight = new ListDelta();

	function handleRetain(op1, op2) {
		const length1 = op1.length;

		if(op2 instanceof ops.Retain) {
			const length2 = op2.length;

			if(length1 > length2) {
				/*
				 * Left is longer than right, retain length of right and
				 * replace left with remaining.
				 */

				deltaLeft.retain(length2);
				deltaRight.retain(length2);

				left.replace(new ops.Retain(length1 - length2));
			} else if(length1 < length2) {
				/*
				 * Left is shorter than right, retain length of left and
				 * replace right with remaining.
				 */

				deltaLeft.retain(length1);
				deltaRight.retain(length1);

				right.replace(new ops.Retain(length2 - length1));
			} else {
				// Same length, retain both
				deltaLeft.retain(length1);
				deltaRight.retain(length2);
			}
		} else if(op2 instanceof ops.Insert) {
			/*
			 * Right is an insertion, just insert into right with a matching
			 * retain into left detla and ask left to be handled again.
			 */
			const items2 = op2.items;
			const length2 = items2.length;

			deltaLeft.retain(length2);
			deltaRight.adopt(op2);

			left.back();
		} else if(op2 instanceof ops.Delete) {
			const items2 = op2.items;
			const length2 = items2.length;

			if(length1 > length2) {
				/*
				 * Left is longer than right, let right delete and replace
				 * left with retain of remaining.
				 */
				deltaRight.adopt(op2);

				left.replace(new ops.Retain(length1 - length2));
			} else if(length1 < length2) {
				/*
				 * Left is shorter than right, let right delete and replace
				 * right with remaining.
				 */
				deltaRight.deleteMultiple(items2.slice(0, length1));

				right.replace(new ops.Delete(items2.slice(length1)));
			} else {
				// Same length, simply delete
				deltaRight.adopt(op2);
			}
		}
	}

	function handleInsert(op1, op2) {
		const items1 = op1.items;
		const length1 = items1.length;

		deltaLeft.adopt(op1);
		deltaRight.retain(length1);

		right.back();
	}

	function handleDelete(op1, op2) {
		const items1 = op1.items;
		const length1 = items1.length;

		if(op2 instanceof ops.Retain) {
			const length2 = op2.length;
			if(length1 > length2) {
				/*
				 * Left is longer than right, delete up to length of right
				 * and replace left with delete for remaining.
				 */
				deltaLeft.deleteMultiple(items1.slice(0, length2));

				left.replace(new ops.Delete(items1.slice(length2)));
			} else if(length1 < length2) {
				/*
				 * Left is shorter than right, delete all and replace right
				 * with retain of reamining.
				 */
				deltaLeft.adopt(op1);

				right.replace(new ops.Retain(length2 - length1));
			} else {
				// Same length, just delete
				deltaLeft.adopt(op1);
			}
		} else if(op2 instanceof ops.Insert) {
			/*
			 * Right is an insertion, just insert into right with a matching
			 * retain into left detla and ask left to be handled again.
			 */
			const items2 = op2.items;
			const length2 = items2.length;

			deltaLeft.retain(length2);
			deltaRight.adopt(op2);

			left.back();
		} else if(op2 instanceof ops.Delete) {
			const items2 = op2.items;
			const length2 = items2.length;

			if(length1 > length2) {
				/*
				 * Left is longer than right, replace left with a delete of
				 * remaining text.
				 */
				left.replace(new ops.Delete(items1.slice(length2)));
			} else if(length1 < length2) {
				/*
				 * Left is shorter than right, replace right with a delete of
				 * remaining text.
				 */
				right.replace(new ops.Delete(items2.slice(length1)));
			} else {
				// Do nothing
			}
		}
	}

	while(left.hasNext) {
		const op1 = left.next();

		if(right.hasNext) {
			const op2 = right.next();

			if(op1 instanceof ops.Retain) {
				handleRetain(op1, op2);
			} else if(op1 instanceof ops.Insert) {
				handleInsert(op1, op2);
			} else if(op1 instanceof ops.Delete) {
				handleDelete(op1, op2);
			}
		} else {
			/*
			 * Operations are still available, but no matching operations
			 * in right.
			 */
			if(op1 instanceof ops.Insert) {
				const items1 = op1.items;
				deltaLeft.adopt(op1);
				deltaRight.retain(items1.length);
			} else {
				throw 'Transformation failure, mismatch in operation. Current left operation: ' + op1.toString();
			}
		}
	}

	while(right.hasNext) {
		const op2 = right.next();
		if(op2 instanceof ops.Insert) {
			const items2 = op2.items;

			deltaRight.adopt(op2);
			deltaLeft.retain(items2.length);
		} else {
			throw 'Transformation failure, mismatch in operation. Current right operation: ' + op2.toString();
		}
	}

	return {
		left: deltaLeft.done(),
		right: deltaRight.done()
	};
};
