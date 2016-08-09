'use strict';

const CompoundOperation = require('../compound-operation');
const ops = require('./ops');
const StringDelta = require('./delta');
const AnnotationChange = require('./annotations').AnnotationChange;

/**
 * Turn operations into a string.
 */
exports.toJSON = function(op) {
	const result = [];
	CompoundOperation.asArray(op)
		.forEach(subOp => {
			if(subOp instanceof ops.Retain) {
				result.push([ 'retain', subOp.length ]);
			} else if(subOp instanceof ops.Insert) {
				result.push([ 'insert', subOp.value ]);
			} else if(subOp instanceof ops.Delete) {
				result.push([ 'delete', subOp.value ]);
			} else if(subOp instanceof ops.AnnotationUpdate) {
				result.push([ 'annotations', subOp.change._changes]);
			} else {
				throw new Error('Unsupported operation: ' + subOp);
			}
		});

	return result;
};

/**
 * Turn a JSON string into operations we can work with.
 */
exports.fromJSON = function(input) {
	if(! Array.isArray(input)) {
		throw new Error('Given input is not an array, got: ' + input);
	}

	const delta = new StringDelta();
	input.forEach(op => {
		switch(op[0]) {
			case 'retain':
				delta.retain(op[1]);
				break;
			case 'insert':
				delta.insert(op[1]);
				break;
			case 'delete':
				delta.delete(op[1]);
				break;
			case 'annotations':
				delta.updateAnnotations(new AnnotationChange(op[1]));
				break;
			default:
				throw new Error('Unknown operation: ' + op);
		}
	});

	return delta.done();
};
