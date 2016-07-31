'use strict';

exports.operations = {
	map: require('./operations/map'),
	string: require('./operations/string'),
	combined: require('./operations/combined')
};

exports.engine = {
	Editor: require('./engine/editor'),
	EditorControl: require('./engine/editor-control'),
	OperationSync: require('./engine/sync'),
	TaggedOperation: require('./engine/tagged-operation')
};

exports.Model = require('./model');
