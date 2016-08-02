'use strict';

const OTType = require('../type');

const map = require('../map');
const string = require('../string');
const list = require('../list');

const compose = require('./compose');
const transform = require('./transform');

class CombinedType extends OTType {
	constructor() {
		super();

		this.types = {
			map: map.newType(),
			list: list.newType(),
			string: string.newType()
		};
	}

	addType(id, type) {
		if(type.newType) {
			type = type.newType();
		}

		if(! type.transform || ! type.compose) {
			throw 'Invalid type. Types must have a compose and transform function';
		}

		this.types[id] = type;
		return this;
	}

	compose(left, right) {
		return compose(this.types, left, right);
	}

	transform(left, right) {
		return transform(this.types, left, right);
	}
}

module.exports = CombinedType;
