'use strict';

/**
 * Convert from a data value into a value usable in the model API.
 */
exports.fromData = function(editor, data) {
	if(typeof data === 'undefined') return null;

	const type = data[0];
	switch(type) {
		case 'ref':
			// Reference to another object
			return editor.getObject(data[1], data[2]);
		case 'value':
			return data[1];
		default:
			throw new Error('Unknown type of data: ' + type);
	}
};

/**
 * Convert to a value suitable for use in a operation.
 */
exports.toData = function(value) {
	if(typeof value === 'undefined') return null;

	if(value && value.objectType && value.objectId) {
		return [ 'ref', value.objectId, value.objectType ];
	} else {
		return [ 'value', value ];
	}
};
