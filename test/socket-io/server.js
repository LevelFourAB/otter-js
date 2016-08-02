'use strict';

const port = 7000;

const io = require('socket.io')(port);
console.log('starting at port', port);

const SocketIoServer = require('../../src/engine/socket-io-server');
const InMemoryHistory = require('../../src/engine/in-memory-history');

const combined = require('../../src/operations/combined');
const type = combined.newType();

const server = new SocketIoServer(io, {
	history: function(id) {
		return new InMemoryHistory(type, combined.delta().done());
	}
});
