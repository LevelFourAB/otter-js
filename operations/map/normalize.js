'use strict';

const keyComparator = require('./keyComparator');

module.exports = function(op) {
	op.operations.sort(keyComparator);
	return op;
};
