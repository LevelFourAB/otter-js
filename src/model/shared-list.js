'use strict';

const SharedObject = require('./shared-object');
const list = require('../operations/list');
const dataValues = require('./data-values');

class SharedList extends SharedObject {

	constructor(editor) {
		super(editor);

		this.items = [];
		let self = this;
		editor.current.apply({
			retain(count) {
				throw new Error('Invalid current value, must only contain inserts');
			},

			delete(value) {
				throw new Error('Invalid current value, must only contain inserts');
			},

			insert(value) {
				self.items.push(value);
			}
		});

		editor.apply = this._apply.bind(this);
	}

	/**
	 * Apply an operation to this list. This will mutate the value
	 *
	 * @protected
	 */
	_apply(data) {
		let self = this;
		let index = 0;
		data.operation.apply({
			retain(count) {
				index += count;
			},

			insert(values) {
				const newValues = values.map(v => dataValues.fromData(self.editor, v));
				Array.prototype.splice.apply(self.items, [ index, 0 ].concat(newValues));

				const fromIndex = index;
				index += values.length;

				self.editor.queueEvent('valuesInserted', {
					index: fromIndex,
					values: newValues
				});
			},

			delete(values) {
				const oldValues = self.items.splice(index, values.length);

				self.editor.queueEvent('valuesRemoved', {
					index: index,
					values: oldValues
				});
			}
		});
	}

	get length() {
		return this.items.length;
	}

	get(index) {
		return this.items[index];
	}

	clear() {
		const delta = list.delta();

		this.items.forEach(item => delta.delete(dataValues.toData(item)));

		this.editor.send(delta.done());
	}

	add(item) {
		this.editor.send(list.delta()
			.retain(this.items.length)
			.insert(dataValues.toData(item))
			.done()
		);
	}

	addAll(items) {
		const delta = list.delta()
			.retain(this.items.length);

		items.forEach(item => delta.insert(dataValues.toData(item)));

		this.editor.send(delta.done());
	}

	insert(index, item) {
		const length = this.items.length;
		this.editor.send(list.delta()
			.retain(index)
			.insert(dataValues.toData(item))
			.retain(length - index)
			.done()
		);
	}

	insertAll(index, items) {
		const length = this.items.length;
		const delta = list.delta()
			.retain(index);

		items.forEach(item => delta.insert(dataValues.toData(item)));

		delta.retain(length - index);
		this.editor.send(delta.done());
	}

	remove(index) {
		const length = this.items.length;
		this.editor.send(list.delta()
			.retain(index)
			.delete(dataValues.toData(this.items[index]))
			.retain(length - index - 1)
			.done()
		);
	}

	removeRange(fromIndex, toIndex) {
		const length = this.items.length;
		const delta = list.delta()
			.retain(fromIndex);

		for(let i=fromIndex; i<toIndex; i++) {
			delta.delete(dataValues.toData(this.items[i]));
		}

		const diff = toIndex - fromIndex;
		delta.retain(length - fromIndex - diff);

		this.editor.send(delta.done());
	}

	set(index, value) {
		const length = this.items.length;
		this.editor.send(list.delta()
			.retain(index)
			.insert(dataValues.toData(value))
			.delete(dataValues.toData(this.items[index]))
			.retain(length - index - 1)
			.done()
		);
	}
}

module.exports = SharedList;
