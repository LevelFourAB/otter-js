'use strict';

const Composer = require('./composer');

class OTType {
	newComposer() {
		return new Composer(this);
	}
}

module.exports = OTType;
