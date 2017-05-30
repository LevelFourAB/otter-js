'use strict';

/**
 * A history of operations that stores operation in a simple array.
 */
class InMemoryHistory {
	constructor(type, defaultValue) {
		this.type = type;
		this.ops = [];
		this.ops.push(defaultValue);
	}

	latest() {
		return new Promise((resolve, reject) => {
			resolve(this.ops.length);
		});
	}

	until(historyId) {
		return new Promise((resolve, reject) => {
			resolve(this.ops.slice(0, historyId));
		});
	}

	from(historyId) {
		return new Promise((resolve, reject) => {
			resolve(this.ops.slice(historyId - 1));
		});
	}

	store(op) {
		return new Promise((resolve, reject) => {
			this.ops.push(op);
			resolve(this.ops.length);
		});
	}
}

module.exports = InMemoryHistory;
