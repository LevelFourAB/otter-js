'use strict';

const idComparator = require('./idComparator');

function binarySearch(ops, target, comparator) {
	let minIndex = 0;
	let maxIndex = ops.length - 1;

	while(minIndex <= maxIndex) {
		let index = (minIndex + maxIndex) / 2 | 0;
		let op = ops[index];

		let compared = comparator(op, target);
		if(compared < 0) {
			minIndex = index + 1;
		} else if(compared > 0) {
			maxIndex = index - 1;
		} else {
			return index;
		}
	}

	return -1;
}

module.exports = function findCombinedOpUpdate(op, id) {
	let ops = op.operations;

	const index = binarySearch(ops, { id }, idComparator);
	if(index < 0) {
		return null;
	}

    return ops[index];
};
