'use strict';

const SharedObject = require('./shared-object');
const list = require('../operations/list');
const dataValues = require('./data-values');

const isInteger = Number.isInteger || function(value) {
	return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

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

			insert(values) {
				values.forEach(v => {
					self.items.push(dataValues.fromData(editor, v));
				});
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

	indexOf(object) {
		for(let i=0; i<this.items.length; i++) {
			if(this.items[i] === object) return i;
		}

		return -1;
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
		if(! isInteger(index)) {
			throw new Error('Index must be an integer, was: ' + index);
		}

		if(index > this.items.length) {
			throw new Error('Can not insert at ' + index + ', only ' + this.items.length + ' items in list');
		}
		if(index < 0) {
			throw new Error('Can not insert at ' + index + ', index must not be negative');
		}

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

		if(! isInteger(index)) {
			throw new Error('Index must be an integer, was: ' + index);
		}

		if(index > this.items.length) {
			throw new Error('Can not insert at ' + index + ', only ' + this.items.length + ' items in list');
		}
		if(index < 0) {
			throw new Error('Can not insert at ' + index + ', index must not be negative');
		}

		const delta = list.delta()
			.retain(index);

		items.forEach(item => delta.insert(dataValues.toData(item)));

		delta.retain(length - index);
		this.editor.send(delta.done());
	}

	remove(index) {
		const length = this.items.length;

		if(! isInteger(index)) {
			throw new Error('Index must be an integer, was: ' + index);
		}

		if(index >= length) {
			throw new Error('Can not remove at ' + index + ', only ' + this.items.length + ' items in list');
		}
		if(index < 0) {
			throw new Error('Can not remove at ' + index + ', index must not be negative');
		}

		this.editor.send(list.delta()
			.retain(index)
			.delete(dataValues.toData(this.items[index]))
			.retain(length - index - 1)
			.done()
		);
	}

	removeRange(fromIndex, toIndex) {
		if(! isInteger(fromIndex)) {
			throw new Error('fromIndex must be an integer, was: ' + fromIndex);
		}

		if(fromIndex < 0 || fromIndex > this.items.length) {
			throw new Error('fromIndex must be between 0 and ' + (this.items.length-1) + ', but was ' + fromIndex);
		}

		if(! isInteger(toIndex)) {
			throw new Error('toIndex must be an integer, was: ' + toIndex);
		}

		if(toIndex < 0 || toIndex >= this.items.length) {
			throw new Error('toIndex must be between 0 and ' + this.items.length + ', but was ' + toIndex);
		}

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

	removeObject(obj) {
		const idx = this.indexOf(obj);
		if(idx < 0) return;

		this.remove(idx);
	}

	set(index, value) {
		if(! isInteger(index)) {
			throw new Error('Index must be an integer, was: ' + index);
		}

		const length = this.items.length;
		if(index > length) {
			throw new Error('Can not set at ' + index + ', only ' + length + ' items in list');
		}
		if(index < 0) {
			throw new Error('Can not set at ' + index + ', index must not be negative');
		}

		this.editor.send(list.delta()
			.retain(index)
			.insert(dataValues.toData(value))
			.delete(dataValues.toData(this.items[index]))
			.retain(length - index - 1)
			.done()
		);
	}

	asArray() {
		return this.items.slice(0);
	}
}

module.exports = SharedList;
