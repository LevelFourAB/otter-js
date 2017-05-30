'use strict';

const MapType = require('./map/type');
const MapDelta = require('./map/delta');

exports.MapType = MapType;
exports.newType = function(options) {
    return new MapType(options);
};

exports.MapDelta = MapDelta;
exports.delta = function() {
	return new MapDelta();
};
