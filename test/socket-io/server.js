'use strict';

const port = 7000;

console.log('starting at port', port);

const SocketIoServer = require('../../src/engine/socket-io-server');
const InMemoryHistory = require('../../src/engine/in-memory-history');

const combined = require('../../src/operations/combined');
const type = combined.newType();

const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const fs = require('fs');

app.listen(port);

function handler(req, res) {
	let filename;
	if(req.url === '/') {
		filename = __dirname + '/index.html';
	} else if(req.url === '/otter.js') {
		filename = __dirname + '/../../build/otter.js';
	} else {
		res.writeHead(404);
		return res.end();
	}

	fs.readFile(filename, function(err, data) {
		if(err) {
			res.writeHead(500);
			return res.end('Error loading');
	    }

		res.writeHead(200);
		res.end(data);
	});
}


const server = new SocketIoServer(io, {
	history: function(id) {
		return new InMemoryHistory(type, combined.delta().done());
	}
});
