'use strict';

const SharedObject = require('./shared-object');
const map = require('../operations/map');

class SharedMap extends SharedObject {

	constructor(editor) {
		super(editor);

		this.values = {};

		this._handler = {
			remove: (id, oldValue) => {
				const old = this.values[id];
				delete this.values[id];

				this.events.emit('valueRemoved', {
					local: false,
					remote: true,

					key: id,
					oldValue: old
				});
			},

			set: (id, oldValue, newValue) => {

				const type = newValue[0];
				let value;
				switch(type) {
					case 'ref':
						// Reference to another object
						value = this.editor.getObject(newValue[1], newValue[2]);
						break;
					case 'value':
						value = newValue[1];
						break;
				}

				const old = this.values[id];
				this.values[id] = value;

				this.events.emit('valueChange', {
					local: false,
					remote: true,

					key: id,
					oldValue: old,
					value: value
				});
			}
		};

		this.apply(editor.current);
	}

	apply(op) {
		op.apply(this._handler);
	}

	containsKey(key) {
		return typeof this.values[key] !== 'undefined';
	}

	get(key) {
		return this.values[key] || null;
	}

	_toValue(value) {
		if(typeof value === 'undefined') return null;

		if(value instanceof SharedObject) {
			return [ 'ref', value.objectId, value.objectType ];
		} else {
			return [ 'value', value ];
		}
	}

	remove(key) {
		const old = this.values[key];
		if(typeof old !== 'undefined') {
			this.events.emit('valueRemoved', {
				local: true,
				remote: false,

				key: key,
				oldValue: old
			});

			this.editor.send(map.delta()
				.set(key, this._toValue(old), null)
			);
		}
	}

	set(key, value) {
		if(value === null || typeof value === 'undefined') {
			throw 'Value must not be null or undefined';
		}

		const old = this.values[key];
		this.values[key] = value;

		this.events.emit('valueChange', {
			local: true,
			remote: false,

			key: key,
			oldValue: old,
			value: value
		});

		this.editor.send(map.delta()
			.set(key, this._toValue(old), this._toValue(value))
			.done()
		);
	}
}

module.exports = SharedMap;
