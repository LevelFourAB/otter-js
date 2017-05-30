'use strict';

const ops = require('./ops');
const CompoundOperation = require('../compound-operation');

/**
 * Helper for building a delta over a map.
 */
class MapDelta {
	constructor() {
		this._values = {};
	}

	/**
	 * Set a new value for the given key.
	 *
	 * @param {string} key
	 *   the key that is being updated
	 * @param currentValue
	 *   the current value of the key
	 * @param newValue
	 *   the new value of the key
	 */
	set(key, currentValue, newValue) {
		const current = this._values[key];
		if(current) {
			if(current.newValue != currentValue) {
				throw new Error('Trying set value twice, but newValue of previous set does not match currentValue of this set');
			}

			current.newValue = newValue;
		} else {
			this._values[key] = {
				oldValue: currentValue,
				newValue: newValue
			};
		}

		return this;
	}

	/**
	 * Remove a value from the map.
	 *
	 * @param {string} key
	 *   the key that is being removed
	 * @param currentValue
	 *   the current value the key has before being removed
	 */
	remove(key, currentValue) {
		return this.set(key, currentValue, null);
	}

	/**
	 * Create the operation that represent these changes.
	 */
	done() {
		const result = [];

		for(const key in this._values) {
			if(! this._values.hasOwnProperty(key)) continue;

			const value = this._values[key];
			result.push(new ops.Set(key, value.oldValue, value.newValue));
		}

		return new CompoundOperation(result);
	}
}

module.exports = MapDelta;
