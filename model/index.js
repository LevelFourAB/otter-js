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

		this.editors = new Map();
		this.objects = new Map();

		this.events = new EventEmitter();

		editor.addEventListener('change', change => {
			if(! change.local) {
				change.operation.apply(this._changeHandler);
			}

			this.events.emit('change', change);
		});

		this._changeHandler = {
			update: (id, type, change) => {
				if(this.objects.has(id)) {
					const editor = this.editors.get(id);
					this.remote = true;
					editor.apply({
						operation: change,
						local: false,
						remote: true
					});
				} else {
					const object = this._createObject(id, type, change);
					this.objects.set(id, object);
				}
			}
		};

		this.registerType('map', e => new SharedMap(e));
		this.registerType('list', e => new SharedList(e));
		this.registerType('string', e => new SharedString(e));

		this.root = this._getObject('root', 'map');
		this.root.on('valueChanged', data => this.events.emit('valueChanged', data));
		this.root.on('valueRemoved', data => this.events.emit('valueRemove', data));
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

	performEdit(callback) {
		this.editor.performEdit(callback);
	}

	get undoRedo() {
		return this.editor.undoRedo;
	}

	_apply(id, type, op) {
		// Ask the object to apply the operation as a local one
		const editor = this.editors.get(id);
		if(editor) {
			this.remote = false;
			editor.apply({
				operation: op,
				local: true,
				remote: false
			});

			editor.queueEvent('change', op);
		}

		// Ask the editor to apply the operation and sync it with other editors
		this.editor.apply(combined.delta()
			.update(id, type, op)
			.done()
		);
	}

	getObject(id) {
		let object = this.objects[id];
		return object || null;
	}

	_queueEvent(id, type, data) {
		const editor = this.editors.get(id);
		editor.events.emit(type, new events.Event(this.remote, data));
	}

	_getObject(id, type) {
		let object = this.objects.get(id);
		if(typeof object !== 'undefined') return object;

		object = this._createObject(id, type, new CompoundOperation([]));
		this.objects.set(id, object);

		return object;
	}

	_createObject(id, type, op) {
		let editor = this._createEditor(id, type, op);
		this.editors.set(id, editor);
		let result = this.factories[type](editor);
		delete editor.current;
		return result;
	}

	_createEditor(id, type, op) {
		const self = this;
		return {
			objectId: id,
			objectType: type,

			events: new EventEmitter(),

			model: self,

			getObject(id, type) {
				return self._getObject(id, type);
			},

			queueEvent(type, data) {
				self._queueEvent(id, type, data);
			},

			current: op,

			send(op) {
				self._apply(this.objectId, this.objectType, op);
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
		return this.events.on(event, listener);
	}

	on(event, listener) {
		return this.events.on(event, listener);
	}

	removeEventListener(event, listener) {
		this.events.removeListener(event, listener);
	}

	static defaultType() {
		return combined.newType();
	}
}

module.exports = Model;
