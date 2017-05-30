'use strict';

const StringType = require('./string/type');
const StringDelta = require('./string/delta');

exports.StringType = StringType;
exports.newType = function(options) {
    return new StringType(options);
};

exports.StringDelta = StringDelta;
exports.delta = function() {
	return new StringDelta();
};
