'use strict';

const OTType = require('../type');
const compose = require('./compose');
const transform = require('./transform');
const serialization = require('./serialization');

class MapType extends OTType {
	constructor() {
		super();
	}

	compose(left, right) {
		return compose(left, right);
	}

	transform(left, right) {
		return transform(left, right);
	}

	toJSON(op) {
		return serialization.toJSON(op);
	}

	fromJSON(json) {
		return serialization.fromJSON(json);
	}
}

module.exports = MapType;
