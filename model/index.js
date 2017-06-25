'use strict';

const EventEmitter = require('events');
const events = require('./events');

const SharedMap = require('./shared-map');
const SharedList = require('./shared-list');
const SharedString = require('./shared-string');

const CompoundOperation = require('../operations/compound-operation');
const combined = require('../operations/combined');

const HLRU = require('hashlru');

class Model {
	constructor(editor) {
		this.editor = editor;
		this.type = editor.type;

		this._lastObjectId = 0;

		this.proxyRef = {};
		this.factories = {};

		this.cache = new HLRU(1000);
		this.refs = new Map();

		this.events = new EventEmitter();

		editor.addEventListener('change', change => {
			if(! change.local) {
				change.operation.apply(this._changeHandler);
			}

			this.events.emit('change', change);
		});

		this._changeHandler = {
			update: (id, type, change) => {
				const ref = this._findRef(id);
				if(ref) {
					this.remote = true;
					ref.editor.apply({
						operation: change,
						local: false,
						remote: true
					});
				}
			}
		};

		editor.addEventListener('state', e => this.events.emit('state', e));

		this.registerType('map', e => new SharedMap(e));
		this.registerType('list', e => new SharedList(e));
		this.registerType('string', e => new SharedString(e));

		this.root = this._getObject('root', 'map');
		this.refs.set(this.cache.get('root'));
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
		const ref = this._findRef(id);
		if(ref) {
			this.remote = false;
			ref.editor.apply({
				operation: op,
				local: true,
				remote: false
			});

			ref.editor.queueEvent('change', op);
		}

		// Ask the editor to apply the operation and sync it with other editors
		this.editor.apply(combined.delta()
			.update(id, type, op)
			.done()
		);
	}

	getObject(id) {
		return this._getObject(id, null, false);
	}

	_queueEvent(id, type, data) {
		const ref = this._findRef(id);
		if(! ref) return;

		ref.editor.events.emit(type, new events.Event(this.remote, data));
	}

	_findRef(id) {
		return this.refs.get(id) || this.cache.get(id);
	}

	_getObject(id, type, create=true) {
		// Find the object if it is referenced or cached
		let ref = this._findRef(id);
		if(ref) return ref.proxy;

		return this._createObject(id, type, create);
	}

	_createObject(id, type, createIfNonExistent) {

		// Function to create a new instance
		const create = () =>  {
			// Find the current operation of this object
			let op = this.editor.current ? this.type.find(this.editor.current, id) : null;

			if(op || createIfNonExistent) {
				// If there is an op or we should auto-create resolve everything
				const editor = this._createEditor(
					id,
					type || op.type,
					(op && op.operation) || new CompoundOperation([])
				);
				const result = this.factories[type](editor);
				editor.current = null;
				return { object: result, editor: editor };
			} else {
				return null;
			}
		};

		// Find or create this object
		const find = proxy => {
			let ref = this._findRef(id);
			if(ref) return ref;

			ref = create();
			ref.proxy = proxy;
			ref.editor.ref = ref;
			this.cache.set(id, ref);
			return ref;
		};

		const proxy = new Proxy(this.proxyRef, {
			get: function(target, name) {
				return find(proxy).object[name];
			}
		});

		if(createIfNonExistent) {
			// Non-existent object can just resolve
			return proxy;
		} else {
			// Need to check if we the object actually exists
			let ref = find(proxy);
			return ref ? ref.proxy : null;
		}
	}

	_createEditor(id, type, op) {
		const self = this;
		const events = new EventEmitter();
		let editor;

		if(id !== 'root') {
			// Automatically handle referencing of this object when listeners change
			let listenerCount = 0;
			events.on('removeEventListener', () => {
				if(--listenerCount === 0) {
					this.refs.delete(id);
				}
			});

			events.on('addListener', () => {
				if(listenerCount++ === 0) {
					this.refs.set(id, editor.ref);
				}
			});
		}

		return editor = {
			objectId: id,
			objectType: type,

			events: {
				addListener: function(eventName, listener) {
					events.addListener(eventName, listener);
				},

				removeListener: function(eventName, listener) {
					events.removeListener(eventName, listener);
				},

				emit: events.emit.bind(events)
			},

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
