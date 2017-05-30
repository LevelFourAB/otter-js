'use strict';

/**
 * Base for events that are triggered. Keeps track of the source of an event
 * via the remote/local property.
 */
class Event {
	constructor(remote, data) {
		this.remote = remote;
		this.local = ! remote;

		Object.keys(data).forEach(k => this[k] = data[k]);
	}
}

exports.Event = Event;
exports.VALUE_CHANGED = 'valueChanged';
exports.VALUE_REMOVED = 'valueRemoved';

exports.INSERT = 'insert';
exports.DELETE = 'delete';
