'use strict';

const EventEmitter = require('events');
const events = require('./events');

const SharedMap = require('./shared-map');
const SharedList = require('./shared-list');
const SharedString = require('./shared-string');

const CompoundOperation = require('../operations/compound-operation');
const combined = require('../operations/combined');

class Model {
	constructor(editor) {
		this.editor = editor;
		this.type = editor.type;

		this._lastObjectId = 0;

		this.factories = {};

		this.editors = {};
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

					const editor = this.editors[id];
					this.remote = true;
					editor.apply({
						operation: change,
						local: false,
						remote: true
					});
				} else {
					this.values[id] = change;

					const object = this._createObject(id, type);
					this.objects[id] = object;
				}
			}
		};

		this.registerType('map', e => new SharedMap(e));
		this.registerType('list', e => new SharedList(e));
		this.registerType('string', e => new SharedString(e));

		this.root = this._getObject('root', 'map');
	}

	registerType(type, factory) {
		this.factories[type] = factory;
		return this;
	}

	newMap() {
		return this.newObject('map');
	}

	newList() {
		return this.newObject('list');
	}

	newString() {
		return this.newObject('string');
	}

	newObject(type) {
		const objectId = this.editor.id + '-' + (this._lastObjectId++);
		return this._getObject(objectId, type);
	}

	open() {
		return this.editor.connect()
			.then(initial => initial.apply(this._changeHandler));
	}

	close() {
		this.editor.close();
	}

	apply(id, type, op) {
		// Compose together with the current value for the object
		if(typeof this.values[id] !== 'undefined') {
			const current = this.values[id];
			const composed = this.type.types[type].compose(current, op);

			this.values[id] = composed;
		} else {
			this.values[id] = op;
		}

		// Ask the editor to apply the operation and sync it with other editors
		this.remote = false;
		this.editor.apply(combined.delta()
			.update(id, type, op)
			.done()
		);

		// Ask the object to apply the operation as a local one
		const editor = this.editors[id];
		if(editor) {
			editor.apply({
				operation: op,
				local: true,
				remote: false
			});

			editor.queueEvent('change', op);
		}
	}

	_queueEvent(id, type, data) {
		const editor = this.editors[id];
		editor.events.emit(type, new events.Event(this.remote, data));
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
		this.editors[id] = editor;
		return this.factories[type](editor);
	}

	_createEditor(id, type) {
		const self = this;
		return {
			objectId: id,
			objectType: type,

			events: new EventEmitter(),

			getObject(id, type) {
				return self._getObject(id, type);
			},

			queueEvent(type, data) {
				self._queueEvent(id, type, data);
			},

			get current() {
				return self.values[this.objectId];
			},

			send(op) {
				self.apply(this.objectId, this.objectType, op);
			},

			apply(op, local) {
				throw new Error('No hook for applying data registered');
			}
		};
	}

	containsKey(key) {
		return this.root.containsKey(key);
	}

	get(key, factory) {
		return this.root.get(key, factory);
	}

	remove(key) {
		return this.root.remove(key);
	}

	set(key, value) {
		return this.root.set(key, value);
	}

	addEventListener(event, listener) {
		return this.root.addEventListener(event, listener);
	}

	on(event, listener) {
		return this.root.on(event, listener);
	}

	static defaultType() {
		return combined.newType();
	}
}

module.exports = Model;
