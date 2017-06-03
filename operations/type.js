'use strict';

const Composer = require('./composer');

class OTType {
	newComposer() {
		return new Composer(this);
	}

	normalize(op) {
		return op;
	}

	invert(op) {
		return this.normalize(op.invert());
	}

	simplify(op) {
		return op;
	}
}

module.exports = OTType;
