'use strict';

const CompoundOperation = require('../compound-operation');
const ops = require('./ops');

/**
 * Turn operations into an array with JSON friendly values. This does not
 * do anything special with the actual values and just assumes they are
 * already JSON friendly.
 */
exports.toJSON = function(op) {
	const result = [];
	CompoundOperation.asArray(op)
		.forEach(subOp => {
			if(subOp instanceof ops.Set) {
				result.push([
					'set',

					{
						key: subOp.key,
						oldValue: subOp.oldValue,
						newValue: subOp.newValue
					}
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
exports.fromJSON = function(json) {
	const result = [];

	json.forEach(data => {
		switch(data[0])
		{
			case 'set':
			{
				const op = data[1];
				result.push(new ops.Set(op.key, op.oldValue || null, op.newValue || null));
				break;
			}
			default:
				throw new Error('Unsupported type of operation: ' + data[0]);
		}
	});

	return new CompoundOperation(result);
};
