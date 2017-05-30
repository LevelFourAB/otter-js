'use strict';

const CompoundOperation = require('../compound-operation');
const CombinedDelta = require('./delta');
const ops = require('./ops');

module.exports = function(types, op) {
	const delta = new CombinedDelta();

	CompoundOperation.asArray(op)
		.forEach(subOp => {
			if(subOp instanceof ops.Update) {
				const type = types[subOp.type];
				delta.update(subOp.id, subOp.type, type.normalize(subOp.operation));
			} else {
				throw new Error('Unsupported operation: ' + subOp);
			}
		});

	return delta.done();
};
