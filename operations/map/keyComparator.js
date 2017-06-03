'use strict';

module.exports = function keyComparator(a, b) {
	return a.key < b.key ? -1 : (a.key > b.key ? 1 : 0);
};
