'use strict';

const OperationIterator = require('../iterator');
const ListDelta = require('./delta');
const ops = require('./ops');

/**
 * Compose two operations by stepping through operations to figure out how
 * the combined result should look like.
 */
module.exports = function(left, right) {
	left = new OperationIterator(left);
	right = new OperationIterator(right);

	const delta = new ListDelta();

	function handleRetain(op1, op2) {
		const length1 = op1.length;

		if(op2 instanceof ops.Retain) {
			const length2 = op2.length;

			if(length1 < length2) {
				// Left operation is shorter, retain left count and rewrite right
				delta.retain(length1);

				right.replace(new ops.Retain(length2 - length1));
			} else if(length1 > length2) {
				// Right operation is shorter, retain right and rewrite left
				delta.retain(length2);

				left.replace(new ops.Retain(length1 - length2));
			} else {
				// Matching lengths, no need to do anything special
				delta.retain(length1);
			}
		} else if(op2 instanceof ops.Insert) {
			// Right operation is a insert, insert and handle this retain again
			delta.adopt(op2);

			left.back();
		} else if(op2 instanceof ops.Delete) {
			// Right operation is a delete, add it to the delta and replace ourselves

			const items2 = op2.value;
			const length2 = items2.length;

			delta.adopt(op2);

			if(length2 < length1) {
				// Only replace if we deleted less than we retain
				left.replace(new ops.Retain(length1 - length2));
			}
		}
	}

	function handleInsert(op1, op2) {
		const items1 = op1.items;
		const length1 = items1.length;

		if(op2 instanceof ops.Retain) {
			const length2 = op2.length;

			if(length1 < length2) {
				/*
				 * Left can fit into the right retain, insert all of it and
				 * replace right with leftover retain count.
				 */

				delta.adopt(op1);
				right.replace(new ops.Retain(length2 - length1));
			} else if(length1 > length2) {
				/*
				 * Left is longer than right. Insert substring of left and
				 * replace with rest of value.
				 */
				delta.insertMultiple(items1.slice(0, length2));

				left.replace(new ops.Insert(items1.slice(length2)));
			} else {
				// Both left and right have the same length
				delta.adopt(op1);
			}

		} else if(op2 instanceof ops.Insert) {
			/*
			 * Two inserts, right is inserted first and the we handle left
			 * again.
			 */
			delta.adopt(op2);
			left.back();
		} else if(op2 instanceof ops.Delete) {
			const items2 = op2.items;
			const length2 = items2.length;

			if(length1 > length2) {
				/*
				 * Left insert is longer than right delete, replace left with
				 * remaining text from left.
				 */
				left.replace(new ops.Insert(items1.slice(length2)));
			} else if(length1 < length2) {
				/*
				 * Left insert is shorther than right delete, replace right with
				 * remaining text from right.
				 */
				right.replace(new ops.Delete(items2.slice(length1)));
			} else {
				// Exact same length, do nothing as they cancel each other
			}
		}
	}

	function handleDelete(op1, op2) {
		if(op2 instanceof ops.Retain) {
			/*
			 * Right operation is a retain, delete left and back up one to
			 * handle right retain again.
			 */
			delta.adopt(op2);

			right.back();
		} else if(op2 instanceof ops.Insert) {
			/*
			 * Right opreation is an insert, push left delete and right insert
			 * onto the delta.
			 */
			delta.adopt(op1);
			delta.adopt(op2);
		} else if(op2 instanceof ops.Delete) {
			/*
			 * Right operation is also a delete. Push left delete and handle
			 * right delete again.
			 */
			delta.adopt(op1);
			right.back();
		}
	}

	while(left.hasNext && right.hasNext) {
		const op1 = left.next();
		const op2 = right.next();

		if(op1 instanceof ops.Retain) {
			handleRetain(op1, op2);
		} else if(op1 instanceof ops.Insert) {
			handleInsert(op1, op2);
		} else if(op1 instanceof ops.Delete) {
			handleDelete(op1, op2);
		}
	}

	if(left.hasNext) {
		throw 'Composition failure: Operation size mismatch';
	}

	while(right.hasNext) {
		const op2 = right.next();
		delta.adopt(op2);
	}

	return delta.done();
};
