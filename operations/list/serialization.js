'use strict';

const CompoundOperation = require('../compound-operation');
const ListDelta = require('./delta');
const ops = require('./ops');

/**
 * Turn operations into an array with JSON friendly values.
 */
exports.toJSON = function(op) {
	const result = [];
	CompoundOperation.asArray(op)
		.forEach(subOp => {
			if(subOp instanceof ops.Retain) {
				result.push([
					'retain',
					subOp.length
				]);
			} else if(subOp instanceof ops.Insert) {
				result.push([
					'insert',
					subOp.items
				]);
			} else if(subOp instanceof ops.Delete) {
				result.push([
					'delete',
					subOp.items
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
	const delta = new ListDelta();

	json.forEach(data => {
		switch(data[0])
		{
			case 'retain':
				const length = data[1];
				delta.retain(length);
				break;
			case 'insert':
				delta.insertMultiple(data[1]);
				break;
			case 'delete':
				delta.deleteMultiple(data[1]);
				break;
			default:
				throw new Error('Unsupported type of operation: ' + data[0]);
		}
	});

	return delta.done();
};
