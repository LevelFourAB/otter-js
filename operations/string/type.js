'use strict';

const OTType = require('../type');
const compose = require('./compose');
const transform = require('./transform');
const serialization = require('./serialization');
const normalize = require('./normalize');

class StringType extends OTType {
	constructor() {
		super();
	}

	compose(left, right) {
		return compose(left, right);
	}

	transform(left, right) {
		return transform(left, right);
	}

	normalize(op) {
		return normalize(op);
	}

	toJSON(op) {
		return serialization.toJSON(op);
	}

	fromJSON(json) {
		return serialization.fromJSON(json);
	}
}

module.exports = StringType;
