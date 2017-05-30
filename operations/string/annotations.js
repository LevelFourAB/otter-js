'use strict';

const ops = require('./ops');

/**
 * Decsribes several changes to annotations.
 */
class AnnotationChange {
	constructor(changes) {
		this._changes = changes;

		this.length = this.keys().length;
	}

	keys() {
		return Object.keys(this._changes);
	}

	forEach(callback) {
		this.keys().forEach(key => {
			const change = this._changes[key];
			callback.call(null, key, change.oldValue, change.newValue);
		});
	}

	get empty() {
		return this.length === 0;
	}

	containsKey(key) {
		return !! this._changes[key];
	}

	get(key) {
		const change = this._changes[key];
		return change ? change.newValue : null;
	}

	getChange(key) {
		return this._changes[key];
	}

	isRemoval(key) {
		const change = this._changes[key];
		return change ? change.newValue === null : false;
	}

	invert() {
		const result = {};
		this.forEach((key, oldValue, newValue) => {
			result[key] = {
				oldValue: newValue,
				newValue: oldValue
			};
		});

		return new AnnotationChange(result);
	}

	mergeWith(other) {
		const result = {};
		this.forEach((key, oldValue, newValue) => {
			result[key] = {
				oldValue: oldValue,
				newValue: newValue
			};
		});

		other.forEach((key, oldValue, newValue) => {
			const current = result[key];
			const change = {
				oldValue: oldValue,
				newValue: newValue
			};

			if(current) {
				if(current.newValue == oldValue) {
					/*
					 * Merge changes if the last change has the same new value
					 * this change says is its old value.
					 */
					change.oldValue = current.oldValue;
				} else if(! newValue && current.newValue) {
					/*
					 * The changes indicates a removal but does not seem to
					 * be a continuation of the previous one. Let the current
					 * value win.
					 */
					return;
				}
			}

			if(change.oldValue != change.newValue) {
				result[key] = change;
			} else {
				delete result[key];
			}
		});

		return new AnnotationChange(result);
	}

	static merge(first, second) {
		if(! first) return second;
		if(! second) return first;

		return first.mergeWith(second);
	}

	toString() {
		const items = [];
		this.forEach((key, oldValue, newValue) => {
			items.push(key + '=' + oldValue + ' -> ' + newValue);
		});
		return '[' + items.join(', ') + ']';
	}
}

class AnnotationNormalizingDelta {
	constructor(delta, source) {
		this.delta = delta;
		this.source = source;
		this.tracker = {};
	}

	retain(count) {
		this.flush();
		this.delta.retain(count);
	}

	insert(s) {
		this.flush();
		this.delta.insert(s);
	}

	delete(s) {
		this.delta.delete(s);
	}

	done() {
		this.flush();
		return this.delta.done();
	}

	updateAnnotations(changes) {
		this.flush();
		this.delta.updateAnnotations(changes);
	}

	flush() {
		const change = this.source();
		if(! change || change.empty) return;

		const updater = this.delta.updateAnnotations();
		change.forEach((key, oldValue, newValue) => {
			const previous = this.tracker[key];

			if(newValue === null) {
				// This annotation key is being removed
				delete this.tracker[key];
				if(previous) {
					if(previous.newValue == oldValue) {
						updater.remove(key, previous.newValue);
					}
				} else {
					updater.remove(key, oldValue);
				}
			} else {
				// Annotation is being changed
				if(previous) {
					updater.set(key, previous.newValue, newValue);
				} else {
					updater.set(key, oldValue, newValue);
				}

				this.tracker[key] = {
					oldValue: oldValue,
					newValue: newValue
				};
			}
		});
		updater.done();
	}
}

exports.AnnotationChange = AnnotationChange;
exports.AnnotationNormalizingDelta = AnnotationNormalizingDelta;
