'use strict';

const OTType = require('../type');
const compose = require('./compose');
const transform = require('./transform');
const serialization = require('./serialization');
const normalize = require('./normalize');

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

	normalize(op) {
		return normalize(op);
	}

	simplify(op) {
		op.operations.forEach(subOp => {
			if(subOp.oldValue) delete subOp.oldValue;
		});
		return op;
	}

	toJSON(op) {
		return serialization.toJSON(op);
	}

	fromJSON(json) {
		return serialization.fromJSON(json);
	}
}

module.exports = MapType;
