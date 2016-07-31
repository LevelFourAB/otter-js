'use strict';

const diff = require('fast-diff');

const SharedObject = require('./shared-object');
const string = require('../operations/string');

class SharedString extends SharedObject {

	constructor(editor) {
		super(editor);

		this.value = '';
		let self = this;
		editor.current.apply({
			retain(count) {
				throw new Error('Invalid current value, must only contain inserts');
			},

			delete(value) {
				throw new Error('Invalid current value, must only contain inserts');
			},

			insert(value) {
				self.value += value;
			}
		});
	}

	/**
	 * Apply an operation to this string. This will mutate the value and
	 * trigger listeners while doing so.
	 *
	 * @protected
	 */
	apply(op, remote=true) {
		let self = this;
		let index = 0;
		op.apply({
			retain(count) {
				index += count;
			},

			insert(value) {
				self.value = self.value.substr(0, index) + value + self.value.substr(index);

				const from = index;
				index += value.length;

				self.events.emit('insert', {
					local: ! remote,
					remote: remote,

					index: from,
					value: value
				});
			},

			delete(value) {
				self.value = self.value.substr(0, index) + self.value.substr(index + value.length);

				self.events.emit('delete', {
					local: ! remote,
					remote: remote,

					index: index,
					fromIndex: index,
					toIndex: index + value.length,

					value: value
				});
			}
		});
	}

	_applyAndSend(op) {
		this.apply(op, false);
		this.editor.send(op);
	}

	/**
	 * Get the current value of this string. If this method is called during
	 * a change event it will return the value of the string as if the
	 * change has been applied.
	 *
	 * @return
	 *   the current value
	 */
	get() {
		return this.value;
	}

	/**
	 * Set the value of this string. This will automatically diff the new
	 * value against the previous value just send the changes.
	 */
	set(value) {
		const delta = string.delta();
		let index = 0;
		diff(this.value, value).forEach(d => {
			switch(d[0]) {
				case diff.EQUAL:
					delta.retain(d[1].length);
					break;
				case diff.INSERT:
					delta.insert(d[1]);

					break;
				case diff.DELETE:
					delta.delete(d[1]);
					break;
			}
		});

		this._applyAndSend(delta.done());
	}

	/**
	 * Append something to this string.
	 */
	append(value) {
		const length = this.value.length;
		this.value += value;

		this._applyAndSend(string.delta()
			.retain(length)
			.insert(value)
			.done()
		);
	}

	/**
	 * Insert text at the specified index in this string.
	 *
	 * @param {number} index
	 *   the zero-based index to insert text at
	 * @param {string} value
	 *   the value to insert
	 */
	insert(index, value) {
		const length = this.value.length;

		if(index <= 0) {
			throw new Error('index must be more than or equal to 0');
		}

		if(index > length) {
			throw new Error('index must not be more than the length of the current value');
		}

		this._applyAndSend(string.delta()
			.retain(index)
			.insert(value)
			.retain(length - index)
			.done()
		);
	}

	/**
	 * Remove text between the two indexes.
	 *
	 * @param {number} fromIndex
	 *   the index to start removing at (inclusive)
	 * @param {number} toIndex
	 *   the index to stop removing at (exclusive)
	 */
	remove(fromIndex, toIndex) {
		if(fromIndex <= 0) {
			throw new Error('fromIndex must be more than or equal to 0');
		}

		const length = this.value.length();
		if(toIndex > length) {
			throw new Error('toIndex must not be more than the length of the current value');
		}

		if(toIndex <= fromIndex) {
			throw new Error('toIndex must be more than fromIndex');
		}

		const deleted = this.value.substring(fromIndex, toIndex);
		this._applyAndSend(string.delta()
			.retain(fromIndex)
			.delete(deleted)
			.retain(length - toIndex)
			.done()
		);
	}
}

module.exports = SharedString;
