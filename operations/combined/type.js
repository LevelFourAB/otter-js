'use strict';

const OTType = require('../type');

const map = require('../map');
const string = require('../string');
const list = require('../list');

const compose = require('./compose');
const transform = require('./transform');
const serialization = require('./serialization');
const normalize = require('./normalize');
const find = require('./find');

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
			throw new Error('Invalid type. Types must have a compose and transform function');
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

	normalize(op) {
		return normalize(this.types, op);
	}

	simplify(op) {
		op.operations.forEach(subOp => {
			let type = this.types[subOp.type];
			subOp.operation = type.simplify(subOp.operation);
		});
		return op;
	}

	toJSON(op) {
		return serialization.toJSON(this.types, op);
	}

	fromJSON(json) {
		return serialization.fromJSON(this.types, json);
	}

	find(op, id) {
		return find(op, id);
	}
}

module.exports = CombinedType;
