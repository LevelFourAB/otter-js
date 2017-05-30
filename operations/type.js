'use strict';

const Composer = require('./composer');

class OTType {
	newComposer() {
		return new Composer(this);
	}

	invert(op) {
		return this.normalize(op.invert());
	}
}

module.exports = OTType;
