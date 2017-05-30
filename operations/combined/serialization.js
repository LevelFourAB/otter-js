'use strict';

const CompoundOperation = require('../compound-operation');
const CombinedDelta = require('./delta');
const ops = require('./ops');

/**
 * Turn operations into an array with JSON friendly values.
 */
exports.toJSON = function(types, op) {
	const result = [];
	CompoundOperation.asArray(op)
		.forEach(subOp => {
			if(subOp instanceof ops.Update) {
				result.push([
					'update',
					subOp.id,
					subOp.type,

					types[subOp.type].toJSON(subOp.operation)
				]);
			} else {
				throw new Error('Unsupported operation: ' + subOp);
			}
		});

	return result;
};

/**
 * Turn a JSON value into operations that can be used when composing and
 * transforming.
 */
exports.fromJSON = function(types, json) {
	const delta = new CombinedDelta();

	json.forEach(data => {
		switch(data[0])
		{
			case 'update':
				delta.update(data[1], data[2], types[data[2]].fromJSON(data[3]));
				break;
			default:
				throw new Error('Unsupported type of operation: ' + data[0]);
		}
	});

	return delta.done();
};
