'use strict';

class Update {
	constructor(id, type, operation) {
		this.id = id;
		this.type = type;
		this.operation = operation;
	}

	apply(handler) {
		handler.update(this.id, this.type, this.operation);
	}

	invert() {
		return new Update(this.id, this.type, this.operation.invert());
	}

	toString() {
		return 'Update{id=' + this.id + ', type=' + this.type + ', operation=' + this.operation + '}';
	}
}

exports.Update = Update;
