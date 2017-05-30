'use strict';

/**
 * Extended information about an operation to help with synchronizing changes.
 */
class TaggedOperation {
	constructor(historyId, token, operation) {
		this.historyId = historyId;
		this.token = token;
		this.operation = operation;
	}
}

module.exports = TaggedOperation;
