'use strict';

const OperationIterator = require('../iterator');
const StringDelta = require('./delta');
const ops = require('./ops');

/**
 * Main transformation for strings.
 */
module.exports = function(left, right) {
	left = new OperationIterator(left);
	right = new OperationIterator(right);

	const deltaLeft = new StringDelta();
	const deltaRight = new StringDelta();

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
			const value2 = op2.value;
			const length2 = value2.length;

			deltaLeft.retain(length2);
			deltaRight.insert(value2);

			left.back();
		} else if(op2 instanceof ops.Delete) {
			const value2 = op2.value;
			const length2 = value2.length;

			if(length1 > length2) {
				/*
				 * Left is longer than right, let right delete and replace
				 * left with retain of remaining.
				 */
				deltaRight.delete(value2);

				left.replace(new ops.Retain(length1 - length2));
			} else if(length1 < length2) {
				/*
				 * Left is shorter than right, let right delete and replace
				 * right with remaining.
				 */
				deltaRight.delete(value2.substring(0, length1));

				right.replace(new ops.Delete(value2.substring(length1)));
			} else {
				// Same length, simply delete
				deltaRight.delete(value2);
			}
		}
	}

	function handleInsert(op1, op2) {
		const value1 = op1.value;
		const length1 = op1.value.length;

		deltaLeft.insert(value1);
		deltaRight.retain(length1);

		right.back();
	}

	function handleDelete(op1, op2) {
		const value1 = op1.value;
		const length1 = value1.length;

		if(op2 instanceof ops.Retain) {
			const length2 = op2.length;
			if(length1 > length2) {
				/*
				 * Left is longer than right, delete up to length of right
				 * and replace left with delete for remaining.
				 */
				deltaLeft.delete(value1.substring(0, length2));

				left.replace(new ops.Delete(value1.substring(length2)));
			} else if(length1 < length2) {
				/*
				 * Left is shorter than right, delete all and replace right
				 * with retain of reamining.
				 */
				deltaLeft.delete(value1);

				right.replace(new ops.Retain(length2 - length1));
			} else {
				// Same length, just delete
				deltaLeft.delete(value1);
			}
		} else if(op2 instanceof ops.Insert) {
			/*
			 * Right is an insertion, just insert into right with a matching
			 * retain into left detla and ask left to be handled again.
			 */
			const value2 = op2.value;
			const length2 = value2.length;

			deltaLeft.retain(length2);
			deltaRight.insert(value2);

			left.back();
		} else if(op2 instanceof ops.Delete) {
			const value2 = op2.value;
			const length2 = value2.length;

			if(length1 > length2) {
				/*
				 * Left is longer than right, replace left with a delete of
				 * remaining text.
				 */
				left.replace(new ops.Delete(value1.substring(length2)));
			} else if(length1 < length2) {
				/*
				 * Left is shorter than right, replace right with a delete of
				 * remaining text.
				 */
				right.replace(new ops.Delete(value2.substring(length1)));
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
				const value1 = op1.value;
				deltaLeft.insert(value1);
				deltaRight.retain(value1.length);
			} else {
				throw 'Transformation failure, mismatch in operation. Current left operation: ' + op1.toString();
			}
		}
	}

	while(right.hasNext) {
		const op2 = right.next();
		if(op2 instanceof ops.Insert) {
			const value2 = op2.value;

			deltaRight.insert(value2);
			deltaLeft.retain(value2.length);
		} else {
			throw 'Transformation failure, mismatch in operation. Current right operation: ' + op2.toString();
		}
	}

	return {
		left: deltaLeft.done(),
		right: deltaRight.done()
	};
};
