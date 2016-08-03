'use strict';

const OperationIterator = require('../iterator');
const CompoundOperation = require('../compound-operation');
const ops = require('./ops');

function idComparator(a, b) {
	return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
}

/**
 * Compose two operations on a map.
 */
module.exports = function(types, left, right) {
	const it1 = new OperationIterator(left, idComparator);
	const it2 = new OperationIterator(right, idComparator);

	const result = [];

	while(it1.hasNext) {
		const op1 = it1.next();

		let handled = false;

		while(it2.hasNext) {
			const op2 = it2.next();

			const compared = idComparator(op1, op2);
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

					const composed = type.compose(op1.operation, op2.operation);
					it1.replace(new ops.Update(op1.id, op1.type, composed));
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

	result.sort(idComparator);
	return new CompoundOperation(result);
};
