'use strict';

const io = require('socket.io-client');
const SocketIoSync = require('../../src/engine/socket-io-sync');
const Editor = require('../../src/engine/editor');
const Model = require('../../src/model');

const socket = io('http://localhost:7000');
const sync = new SocketIoSync(Model.defaultType(), socket, 'test');

const model = new Model(new Editor('thisisnotveryunique', sync));

model.open()
	.then(() => {
		console.log('open');

		let test = model.get('test');
		console.log(test);
		if(! test) {
			console.log('creating new string');
			test = model.newString();
			test.set('Hello World!');
			model.set('test', test);
		}

		console.log(test.get());
	}).catch(e => console.log(e));
