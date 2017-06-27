'use strict';

const SharedObject = require('./shared-object');
const map = require('../operations/map');
const dataValues = require('./data-values');

class SharedMap extends SharedObject {

	constructor(editor) {
		super(editor);

		this.values = new Map();

		this._apply({
			operation: editor.current
		});
		editor.apply = this._apply.bind(this);
	}

	_apply(data) {
		data.operation.apply({
			remove: (id, oldValue) => {
				const old = this.values.get(id);
				this.values.delete(id);

				this.editor.queueEvent('valueRemoved', {
					key: id,
					oldValue: old
				});
			},

			set: (id, oldValue, newValue) => {
				const value = dataValues.fromData(this.editor, newValue);
				const old = this.values.get(id);
				this.values.set(id, value);

				this.editor.queueEvent('valueChanged', {
					key: id,
					oldValue: old,
					newValue: value
				});
			}
		});
	}

	containsKey(key) {
		return typeof this.values[key] !== 'undefined';
	}

	get(key, factory) {
		let value = this.values.get(key);
		if(value) return value;

		if(factory) {
			const model = this.editor.model;
			model.performEdit(() => {
				this.values.set(key, value = factory(model));

				this.editor.send(map.delta()
					.set(key, dataValues.toData(null), dataValues.toData(value))
					.done()
				);
			});
		}

		return typeof value !== 'undefined' ? value : null;
	}

	remove(key) {
		const old = this.values.get(key);
		if(typeof old !== 'undefined') {
			this.editor.send(map.delta()
				.set(key, dataValues.toData(null))
			);
		}
	}

	set(key, value) {
		if(value === null || typeof value === 'undefined') {
			throw new Error('Value must not be null or undefined');
		}

		const old = this.values.get(key);
		this.editor.send(map.delta()
			.set(key, dataValues.toData(old), dataValues.toData(value))
			.done()
		);
	}
}

module.exports = SharedMap;
