'use strict';

const OTType = require('../type');
const compose = require('./compose');
const transform = require('./transform');

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
}

module.exports = StringType;
