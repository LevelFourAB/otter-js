'use strict';

class Set {
	constructor(key, oldValue, newValue) {
		this.key = key;
		this.oldValue = oldValue;
		this.newValue = newValue;
	}

	apply(handler) {
		if(this.newValue === null) {
			handler.remove(this.key, this.oldValue);
		} else {
			handler.set(this.key, this.oldValue, this.newValue);
		}
	}

	invert() {
		return new Set(this.key, this.newValue, this.oldValue);
	}

	toString() {
		return "Set{key=" + this.key + ", oldValue=" + this.oldValue + ", newValue=" + this.newValue + "}";
	}
}

exports.Set = Set;
