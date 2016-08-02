'use strict';

class SharedObject {
	constructor(editor) {
		this.editor = editor;
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
		this.editor.events.on(event, listener);
		return this;
	}

}

module.exports = SharedObject;
