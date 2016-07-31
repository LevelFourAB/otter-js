'use strict';

/**
 * Retain operation. Indicates that a number of characters should be retained
 * from the current value.
 */
class Retain {
	constructor(length) {
		this.length = length;
	}

	apply(handler) {
		handler.retain(this.length);
	}

	invert() {
		return this;
	}

	toString() {
		return 'Retain{' + this.length + '}';
	}
}

/**
 * Insert operation. Insert some text at the current position.
 */
class Insert {
	constructor(value) {
		this.value = value;
	}

	apply(handler) {
		handler.insert(this.value);
	}

	invert() {
		return Delete(this.value);
	}

	toString() {
		return 'Insert{' + this.value + '}';
	}
}

/**
 * Delete operation. Delete some text at the current position.
 */
class Delete {
	constructor(value) {
		this.value = value;
	}

	apply(handler) {
		handler.delete(this.value);
	}

	invert() {
		return Insert(this.value);
	}

	toString() {
		return 'Delete{' + this.value + '}';
	}
}

exports.Retain = Retain;
exports.Insert = Insert;
exports.Delete = Delete;
