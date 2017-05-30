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
		return new Delete(this.value);
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
		return new Insert(this.value);
	}

	toString() {
		return 'Delete{' + this.value + '}';
	}
}

class AnnotationUpdate {
	constructor(change) {
		this.change = change;
	}

	apply(handler) {
		handler.updateAnnotations(this.change);
	}

	invert() {
		return new AnnotationUpdate(this.change.invert());
	}

	toString() {
		return 'AnnotationUpdate{' + this.change + '}';
	}
}

exports.Retain = Retain;
exports.Insert = Insert;
exports.Delete = Delete;
exports.AnnotationUpdate = AnnotationUpdate;
