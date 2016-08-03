'use strict';

exports.operations = {
	map: require('./operations/map'),
	list: require('./operations/list'),
	string: require('./operations/string'),
	combined: require('./operations/combined')
};

exports.engine = {
	Editor: require('./engine/editor'),
	EditorControl: require('./engine/editor-control'),
	OperationSync: require('./engine/sync'),
	TaggedOperation: require('./engine/tagged-operation'),
	SocketIoSync: require('./engine/socket-io-sync')
};

exports.Model = require('./model');
exports.model = {
	bind: {
		text: require('./model/binding/text')
	}
};
