'use strict';

const OperationIterator = require('../iterator');
const StringDelta = require('./delta');
const ops = require('./ops');

const annotations = require('./annotations');
const AnnotationChange = annotations.AnnotationChange;

/**
 * Compose two operations by stepping through operations to figure out how
 * the combined result should look like.
 */
module.exports = function(left, right) {
	left = new OperationIterator(left);
	right = new OperationIterator(right);

	let annotationChanges = null;

	const delta = new annotations.AnnotationNormalizingDelta(
		new StringDelta(),
		() => {
			const change = annotationChanges;
			annotationChanges = null;
			return change;
		});

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
			delta.insert(op2.value);

			left.back();
		} else if(op2 instanceof ops.Delete) {
			// Right operation is a delete, add it to the delta and replace ourselves

			const value2 = op2.value;
			const length2 = value2.length;

			if(length1 < length2) {
				delta.delete(value2.substring(0, length1));
				right.replace(new ops.Delete(value2.substring(length1)));
			} else if(length1 > length2) {
				// Only replace if we deleted less than we retain
				delta.delete(value2);
				left.replace(new ops.Retain(length1 - length2));
			} else {
				delta.delete(value2);
			}
		} else if(op2 instanceof ops.AnnotationUpdate) {
			annotationChanges = AnnotationChange.merge(annotationChanges, op2.change);
			left.back();
		}
	}

	function handleInsert(op1, op2) {
		const value1 = op1.value;
		const length1 = op1.value.length;

		if(op2 instanceof ops.Retain) {
			const length2 = op2.length;

			if(length1 < length2) {
				/*
				 * Left can fit into the right retain, insert all of it and
				 * replace right with leftover retain count.
				 */

				delta.insert(value1);
				right.replace(new ops.Retain(length2 - length1));
			} else if(length1 > length2) {
				/*
				 * Left is longer than right. Insert substring of left and
				 * replace with rest of value.
				 */
				delta.insert(value1.substring(0, length2));

				left.replace(new ops.Insert(value1.substring(length2)));
			} else {
				// Both left and right have the same length
				delta.insert(value1);
			}

		} else if(op2 instanceof ops.Insert) {
			/*
			 * Two inserts, right is inserted first and the we handle left
			 * again.
			 */
			delta.insert(op2.value);
			left.back();
		} else if(op2 instanceof ops.Delete) {
			const value2 = op2.value;
			const length2 = value2.length;

			if(length1 > length2) {
				/*
				 * Left insert is longer than right delete, replace left with
				 * remaining text from left.
				 */
				left.replace(new ops.Insert(value1.substring(length2)));
			} else if(length1 < length2) {
				/*
				 * Left insert is shorther than right delete, replace right with
				 * remaining text from right.
				 */
				right.replace(new ops.Delete(value2.substring(length1)));
			} else {
				// Exact same length, do nothing as they cancel each other
			}
		} else if(op2 instanceof ops.AnnotationUpdate) {
			annotationChanges = AnnotationChange.merge(annotationChanges, op2.change);
			left.back();
		}
	}

	function handleDelete(op1, op2) {
		const value1 = op1.value;

		if(op2 instanceof ops.Retain) {
			/*
			 * Right operation is a retain, delete left and back up one to
			 * handle right retain again.
			 */
			delta.delete(value1);

			right.back();
		} else if(op2 instanceof ops.Insert) {
			/*
			 * Right opreation is an insert, push left delete and right insert
			 * onto the delta.
			 */
			delta.delete(value1);
			delta.insert(op2.value);
		} else if(op2 instanceof ops.Delete) {
			/*
			 * Right operation is also a delete. Push left delete and handle
			 * right delete again.
			 */
			delta.delete(value1);
			right.back();
		} else if(op2 instanceof ops.AnnotationUpdate) {
			annotationChanges = AnnotationChange.merge(annotationChanges, op2.change);
			left.back();
		}
	}

	function handleAnnotationUpdate(op1, op2) {
		const change1 = op1.change;

		if(op2 instanceof ops.AnnotationUpdate) {
			/*
			 * Right operation is also an annotation update. Merge the two
			 * sets of changes.
			 */
			const merged = AnnotationChange.merge(change1, op2.change);
			annotationChanges = AnnotationChange.merge(annotationChanges, merged);
		} else {
			/*
			 * Right operation is something else, queue the annotation changes
			 * and handle right again.
			 */
			annotationChanges = AnnotationChange.merge(annotationChanges, change1);
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
		} else if(op1 instanceof ops.AnnotationUpdate) {
			handleAnnotationUpdate(op1, op2);
		}
	}

	while(left.hasNext) {
		const op1 = left.next();
		if(op1 instanceof ops.AnnotationUpdate || op1 instanceof ops.Delete) {
			/*
			 * Annotation updates are zero-sized so they can always be composed.
			 */
			op1.apply(delta);
		} else {
			throw new Error('Composition failure: Operation size mismatch');
		}
	}

	while(right.hasNext) {
		const op2 = right.next();
		op2.apply(delta);
	}

	return delta.done();
};
