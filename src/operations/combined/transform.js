'use strict';

const OperationIterator = require('../iterator');
const CompoundOperation = require('../compound-operation');
const ops = require('./ops');

function idComparator(a, b) {
	return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
}

/**
 * Main transformation for the combined type. This will sort operations
 * according to their id and handle them in order. Most of the actual work is
 * done by the transformation done by the subtypes.
 */
module.exports = function(types, left, right) {
	const it1 = new OperationIterator(left, idComparator);
	const it2 = new OperationIterator(right, idComparator);

	const deltaLeft = [];
	const deltaRight = [];

	while(it1.hasNext) {
		const op1 = it1.next();

		let handled = false;

		while(it2.hasNext) {
			const op2 = it2.next();

			const compared = idComparator(op1, op2);
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
				if(op1 instanceof ops.Update && op2 instanceof ops.Update) {

					if(op1.type != op2.type) {
						throw 'Can not compose, operations with id `' + op1.id +
							'` have different types: ' + op1.type + ' vs ' +
							op2.type;
					}

					const type = types[op1.type];
					if(! type) {
						throw 'Can not compose, unknown type: ' + op1.type;
					}

					const transformed = type.transform(op1.operation, op2.operation);
					deltaLeft.add(new ops.Update(op1.id, op1.type, transformed.left));
					deltaLeft.add(new ops.Update(op2.id, op2.type, transformed.right));
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

	deltaLeft.sort(idComparator);
	deltaRight.sort(idComparator);
	return {
		left: new CompoundOperation(deltaLeft),
		right: new CompoundOperation(deltaRight)
	};
};
