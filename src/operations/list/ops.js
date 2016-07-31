'use strict';

/**
 * Retain operation. Indicates that a number of list items should be kept.
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
 * Insert operation. Insert items at the given position.
 */
class Insert {
	constructor(items) {
		this.items = items.slice(0);
	}

	apply(handler) {
		handler.insert(this.items);
	}

	invert() {
		return Delete(this.items);
	}

	toString() {
		return 'Insert{' + this.items.join(', ') + '}';
	}
}

/**
 * Delete operation. Delete some text at the current position.
 */
class Delete {
	constructor(items) {
		this.items = items.slice(0);
	}

	apply(handler) {
		handler.delete(this.items);
	}

	invert() {
		return Insert(this.items);
	}

	toString() {
		return 'Delete{' + this.items.join(', ') + '}';
	}
}

exports.Retain = Retain;
exports.Insert = Insert;
exports.Delete = Delete;
