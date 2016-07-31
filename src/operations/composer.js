'use strict';

/**
 * Composer that can compose several operations at once.
 */
class Composer {
	constructor(type) {
		this.type = type;
	}

	add(op) {
		if(this.result) {
			this.result = this.type.compose(this.result, op);
		} else {
			this.result = op;
		}

		return this;
	}

	done() {
		return this.result;
	}
}

module.exports = Composer;
