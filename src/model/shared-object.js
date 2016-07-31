'use strict';

const EventEmitter = require('events');

class SharedObject {
	constructor(editor) {
		this.editor = editor;

		this.events = new EventEmitter();
	}

	get objectId() {
		return this.editor.objectId;
	}

	get objectType() {
		return this.editor.objectType;
	}

	addEventListener(event, listener) {
		return this.on(event, listener);
	}

	on(event, listener) {
		this.events.on(event, listener);
		return this;
	}

}

module.exports = SharedObject;
