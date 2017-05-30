'use strict';

const OperationSync = require('./sync');
const TaggedOperation = require('./tagged-operation');

class SocketIoSync extends OperationSync {
	constructor(type, socket, editableId) {
		super(type);

		this.socket = socket;
		this.editableId = editableId;
	}

	connect() {
		return new Promise((resolve, reject) => {
			// Start listening for changes to the editable
			this.socket.on('change editable', data => {
				if(data.editable !== this.editableId) return;

				// Pass the operation to the connected editor
				this.events.emit('change', new TaggedOperation(
					data.historyId,
					data.token,
					this.type.fromJSON(data.operation)
				));
			});

			this.socket.on('load editable', data => {
				if(data.editable !== this.editableId) return;

				// Resolve the promise with the initial editable
				resolve(new TaggedOperation(
					data.historyId,
					data.token,
					this.type.fromJSON(data.operation)
				));
			});

			// When Socket.io connects send a request to load our editable
			this.socket.emit('load editable', {
				editable: this.editableId
			});
		});
	}

	send(op) {
		this.socket.emit('change editable', {
			editable: this.editableId,
			historyId: op.historyId,
			token: op.token,
			operation: this.type.toJSON(op.operation)
		});
	}

	close() {
		this.socket.emit('close editable', {
			editable: this.editableId
		});
	}
}

module.exports = SocketIoSync;
