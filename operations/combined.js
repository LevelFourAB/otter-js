'use strict';

const CombinedType = require('./combined/type');
const CombinedDelta = require('./combined/delta');

exports.CombinedType = CombinedType;
exports.newType = function(options) {
    return new CombinedType(options);
};

exports.CombinedDelta = CombinedDelta;
exports.delta = function() {
	return new CombinedDelta();
};
