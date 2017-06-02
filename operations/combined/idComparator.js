'use strict';

/**
 * Comparator function that compares two ops by using their identifier.
 */
module.exports = function idComparator(a, b) {
	return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
};
