'use strict';

const ListType = require('./list/type');
const ListDelta = require('./list/delta');

exports.ListType = ListType;
exports.newType = function(options) {
    return new ListType(options);
};

exports.ListDelta = ListDelta;
exports.delta = function() {
	return new ListDelta();
};
