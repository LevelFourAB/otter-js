'use strict';

const SharedMap = require('./shared-map');
const CompoundOperation = require('../operations/compound-operation');
const combined = require('../operations/combined');

class Model {
	constructor(editor) {
		this.editor = editor;
		this.type = editor.type;

		this.factories = {};

		this.values = {};
		this.objects = {};

		editor.addEventListener('change', change => {
			if(change.local) return;

			change.operation.apply(this._changeHandler);
		});

		this._changeHandler = {
			update: (id, type, change) => {
				if(typeof this.values[id] !== 'undefined') {
					const current = this.values[id];
					const composed = this.type.types[type].compose(current, change);

					this.values[id] = composed;

					const object = this.objects[id];
					object.apply(change);
				} else {
					this.values[id] = change;

					const object = this._createObject(id, type);
					this.objects[id] = object;
				}
			}
		};

		this.registerType('map', e => new SharedMap(e));

		this.root = this._getObject('root', 'map');
	}

	registerType(type, factory) {
		this.factories[type] = factory;
		return this;
	}

	open() {
		return this.editor.connect()
			.then(initial => initial.apply(this._changeHandler));
	}

	close() {
		this.editor.close();
	}

	apply(id, type, op) {
		if(typeof this.values[id] !== 'undefined') {
			const current = this.values[id];
			const composed = this.type.types[type].compose(current, op);

			this.values[id] = composed;
		} else {
			this.values[id] = op;
		}

		this.editor.apply(combined.delta()
			.update(id, type, op)
			.done()
		);
	}

	_getObject(id, type) {
		let object = this.objects[id];
		if(typeof object !== 'undefined') return object;

		this.values[id] = new CompoundOperation([]);
		object = this._createObject(id, type);
		this.objects[id] = object;

		return object;
	}

	_createObject(id, type) {
		let editor = this._createEditor(id, type);
		return this.factories[type](editor);
	}

	_createEditor(id, type) {
		const self = this;
		return {
			objectId: id,
			objectType: type,

			get current() {
				return self.values[this.objectId];
			},

			send(op) {
				self.apply(this.objectId, this.objectType, op);
			}
		};
	}

	containsKey(key) {
		return this.root.containsKey(key);
	}

	get(key) {
		return this.root.get(key);
	}

	remove(key) {
		return this.root.remove(key);
	}

	set(key, value) {
		return this.root.set(key, value);
	}
}

module.exports = Model;
