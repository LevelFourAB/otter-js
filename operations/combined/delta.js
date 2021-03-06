'use strict';

const CompoundOperation = require('../compound-operation');
const ops = require('./ops');
const idComparator = require('./idComparator');

class UpdateDelta {
	constructor() {
		this._ops = [];
	}

	update(id, type, operation) {
		if(this._ops[id]) {
			throw new Error('Can not update id `' + id + '` several times');
		}

		this._ops[id] = new ops.Update(id, type, operation);
		return this;
	}

	done() {
		const result = [];

		for(const key in this._ops) {
			if(! this._ops.hasOwnProperty(key)) continue;

			const value = this._ops[key];
			result.push(value);
		}

		result.sort(idComparator);
		return new CompoundOperation(result);
	}
}

module.exports = UpdateDelta;
