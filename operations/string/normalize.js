'use strict';

const CompoundOperation = require('../compound-operation');
const ops = require('./ops');
const StringDelta = require('./delta');

module.exports = function(op) {
    const delta = new StringDelta();

	CompoundOperation.asArray(op)
		.forEach(subOp => {
			if(subOp instanceof ops.Retain) {
                delta.retain(subOp.length);
			} else if(subOp instanceof ops.Insert) {
                delta.insert(subOp.value);
			} else if(subOp instanceof ops.Delete) {
                delta.delete(subOp.value);
			} else if(subOp instanceof ops.AnnotationUpdate) {
                delta.updateAnnotations(subOp.change);
			} else {
				throw new Error('Unsupported operation: ' + subOp);
			}
		});

	return delta.done();
};
