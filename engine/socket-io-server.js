'use strict';

const EditorControl = require('./editor-control');

class SocketIoServer {
	constructor(io, options) {
		if(typeof options !== 'object') {
			throw new Error('options need to be specified');
		}

		if(typeof options.history !== 'function') {
			throw new Error('options.history needs to be a function that returns a history instance');
		}

		this.controls = [];
		this.io = io;
		this.options = options;

		io.on('connection', socket => {
			socket.on('load editable', data => this._load(socket, data));
			socket.on('change editable', data => this._change(socket, data));
			socket.on('close editable', data => {
				socket.leave(data.editable);
			});
		});
	}

	getEditorControl(id) {
		// TODO: Determine when we should keep editor controls cached
		let control = this.controls[id];
		if(control) return control;

		control = this.controls[id] = new EditorControl(
			this.options.history(id),
			this.options.lock ? this.options.lock(id) : null
		);

		return control;
	}

	_toData(control, id, data) {
		return {
			editable: id,
			historyId: data.historyId,
			token: data.token,
			operation: control.type.toJSON(data.operation)
		};
	}

	_load(socket, data) {
		const id = data.editable;
		const control = this.getEditorControl(id);
		control.latest()
			.then(latest => {
				socket.join(id);

				socket.emit('load editable', this._toData(control, id, latest));
			}).catch(e => {
				// eslint-disable-next-line no-console
				console.log('Error occured during load', e);
			});
	}

	_change(socket, data) {
		const id = data.editable;
		const control = this.getEditorControl(data.editable);

		control.store(
			data.historyId,
			data.token,
			control.type.fromJSON(data.operation)
		).then(op => {
			this.io.in(id).emit('change editable', this._toData(control, id, op));
		});
	}
}

module.exports = SocketIoServer;
