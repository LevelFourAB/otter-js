(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["otter"] = factory();
	else
		root["otter"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.operations = {
		map: __webpack_require__(1),
		list: __webpack_require__(12),
		string: __webpack_require__(19),
		combined: __webpack_require__(27)
	};

	exports.engine = {
		Editor: __webpack_require__(34),
		EditorControl: __webpack_require__(36),
		OperationSync: __webpack_require__(41),
		TaggedOperation: __webpack_require__(40),
		SocketIoSync: __webpack_require__(42)
	};

	exports.Model = __webpack_require__(43);
	exports.model = {
		bind: {
			text: __webpack_require__(51)
		}
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var MapType = __webpack_require__(2);
	var MapDelta = __webpack_require__(11);

	exports.MapType = MapType;
	exports.newType = function (options) {
	  return new MapType(options);
	};

	exports.MapDelta = MapDelta;
	exports.delta = function () {
	  return new MapDelta();
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var OTType = __webpack_require__(3);
	var _compose = __webpack_require__(5);
	var _transform = __webpack_require__(9);
	var serialization = __webpack_require__(10);

	var MapType = function (_OTType) {
		_inherits(MapType, _OTType);

		function MapType() {
			_classCallCheck(this, MapType);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(MapType).call(this));
		}

		_createClass(MapType, [{
			key: 'compose',
			value: function compose(left, right) {
				return _compose(left, right);
			}
		}, {
			key: 'transform',
			value: function transform(left, right) {
				return _transform(left, right);
			}
		}, {
			key: 'toJSON',
			value: function toJSON(op) {
				return serialization.toJSON(op);
			}
		}, {
			key: 'fromJSON',
			value: function fromJSON(json) {
				return serialization.fromJSON(json);
			}
		}]);

		return MapType;
	}(OTType);

	module.exports = MapType;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Composer = __webpack_require__(4);

	var OTType = function () {
		function OTType() {
			_classCallCheck(this, OTType);
		}

		_createClass(OTType, [{
			key: 'newComposer',
			value: function newComposer() {
				return new Composer(this);
			}
		}]);

		return OTType;
	}();

	module.exports = OTType;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Composer that can compose several operations at once.
	 */

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Composer = function () {
		function Composer(type) {
			_classCallCheck(this, Composer);

			this.type = type;
		}

		_createClass(Composer, [{
			key: 'add',
			value: function add(op) {
				if (this.result) {
					this.result = this.type.compose(this.result, op);
				} else {
					this.result = op;
				}

				return this;
			}
		}, {
			key: 'done',
			value: function done() {
				return this.result;
			}
		}]);

		return Composer;
	}();

	module.exports = Composer;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var OperationIterator = __webpack_require__(6);
	var CompoundOperation = __webpack_require__(7);
	var ops = __webpack_require__(8);

	function keyComparator(a, b) {
		return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
	}

	/**
	 * Compose two operations on a map.
	 */
	module.exports = function (left, right) {
		var it1 = new OperationIterator(left, keyComparator);
		var it2 = new OperationIterator(right, keyComparator);

		var result = [];

		while (it1.hasNext) {
			var op1 = it1.next();

			var handled = false;

			while (it2.hasNext) {
				var op2 = it2.next();

				var compared = keyComparator(op1, op2);
				if (compared > 0) {
					/*
	     * Left key is larger than right, so push the right key onto
	     * the result as we can't combine it with anything.
	     */

					result.push(op2);
					continue;
				} else if (compared < 0) {
					/*
	     * Left key is smaller than right, release it back for handling
	     * and try the next left operation.
	     */
					it2.back();
				} else {
					if (op1 instanceof ops.Set && op2 instanceof ops.Set) {
						it1.replace(new ops.Set(op1.key, op1.oldValue, op2.newValue));
					}

					handled = true;
				}
				break;
			}

			if (!handled) {
				result.push(op1);
			}
		}

		while (it2.hasNext) {
			result.push(it2.next());
		}

		result.sort(keyComparator);
		return new CompoundOperation(result);
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CompoundOperation = __webpack_require__(7);

	/**
	 * Iterator over operations. Can be created over any operation and uses
	 * CompoundOperation to find individual operations.
	 *
	 * The iterator also supports changing the iteration by replacing operations
	 * or going back to handle an operation again.
	 */

	var OperationIterator = function () {
		function OperationIterator(op, comparator) {
			_classCallCheck(this, OperationIterator);

			var ops = CompoundOperation.asArray(op);
			if (comparator) {
				ops.sort(comparator);
			}

			this.index = 0;
			this._ops = ops;
		}

		/**
	  * Get if more operations are available in this iterator.
	  */


		_createClass(OperationIterator, [{
			key: 'next',


			/**
	   * Advance and return the next operation.
	   */
			value: function next() {
				if (this.index >= this._ops.length) {
					throw 'No more operations available';
				}

				var result = this._ops[this.index];
				this.index++;
				return result;
			}

			/**
	   * Go back one step in the iteration, to handle the current operation again.
	   */

		}, {
			key: 'back',
			value: function back() {
				if (this.index === 0) {
					throw 'Can not go back, iteration not started';
				}

				this.index--;
			}

			/**
	   * Replace the operation with a new one.
	   */

		}, {
			key: 'replace',
			value: function replace(op) {
				if (this.index === 0) {
					throw 'Can not replace, iteration not started';
				}

				this.index--;
				this._ops[this.index] = op;
			}
		}, {
			key: 'hasNext',
			get: function get() {
				return this.index < this._ops.length;
			}
		}]);

		return OperationIterator;
	}();

	module.exports = OperationIterator;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Operation that consists of several operations in sequence.
	 */

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CompoundOperation = function () {
		function CompoundOperation(ops) {
			_classCallCheck(this, CompoundOperation);

			this._ops = ops;
		}

		_createClass(CompoundOperation, [{
			key: 'apply',
			value: function apply(handler) {
				this._ops.forEach(function (op) {
					return op.apply(handler);
				});
			}

			/**
	   * Get the given operation as an array, even if it is not a compound
	   * operation to start with.
	   */

		}, {
			key: 'toString',
			value: function toString() {
				return "CompoundOperation[" + this._ops + ']';
			}
		}, {
			key: 'operations',
			get: function get() {
				return this._ops;
			},
			set: function set(ops) {
				throw 'Can not set operations';
			}
		}], [{
			key: 'asArray',
			value: function asArray(op) {
				if (op instanceof CompoundOperation) {
					return op.operations.slice(0);
				} else if (op && op.apply) {
					return [op];
				} else {
					throw new Error('No valid operation specified: ' + op);
				}
			}
		}]);

		return CompoundOperation;
	}();

	module.exports = CompoundOperation;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Set = function () {
		function Set(key, oldValue, newValue) {
			_classCallCheck(this, Set);

			this.key = key;
			this.oldValue = oldValue;
			this.newValue = newValue;
		}

		_createClass(Set, [{
			key: "apply",
			value: function apply(handler) {
				if (this.newValue === null) {
					handler.remove(this.key, this.oldValue);
				} else {
					handler.set(this.key, this.oldValue, this.newValue);
				}
			}
		}, {
			key: "invert",
			value: function invert() {
				return new Set(this.key, this.newValue, this.oldValue);
			}
		}, {
			key: "toString",
			value: function toString() {
				return "Set{key=" + this.key + ", oldValue=" + this.oldValue + ", newValue=" + this.newValue + "}";
			}
		}]);

		return Set;
	}();

	exports.Set = Set;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var OperationIterator = __webpack_require__(6);
	var CompoundOperation = __webpack_require__(7);
	var ops = __webpack_require__(8);

	function keyComparator(a, b) {
		return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
	}

	/**
	 * Compose two operations on a map.
	 */
	module.exports = function (left, right) {
		var it1 = new OperationIterator(left, keyComparator);
		var it2 = new OperationIterator(right, keyComparator);

		var deltaLeft = [];
		var deltaRight = [];

		while (it1.hasNext) {
			var op1 = it1.next();

			var handled = false;

			while (it2.hasNext) {
				var op2 = it2.next();

				var compared = keyComparator(op1, op2);
				if (compared > 0) {
					/*
	     * Left key is larger than right, no transformation against
	     * left key to be done. Push right onto delta right.
	     */

					deltaRight.push(op2);
					continue;
				} else if (compared < 0) {
					/*
	     * Left key is less than right, back up right by one and
	     * let left key be added to delta left.
	     */
					it2.back();
				} else {
					if (op1 instanceof ops.Set && op2 instanceof ops.Set) {
						deltaRight.push(new ops.Set(op1.key, op1.newValue, op2.newValue));
					}

					handled = true;
				}

				break;
			}

			if (!handled) {
				deltaLeft.push(op1);
			}
		}

		while (it2.hasNext) {
			deltaRight.push(it2.next());
		}

		deltaLeft.sort(keyComparator);
		deltaRight.sort(keyComparator);
		return {
			left: new CompoundOperation(deltaLeft),
			right: new CompoundOperation(deltaRight)
		};
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var CompoundOperation = __webpack_require__(7);
	var ops = __webpack_require__(8);

	/**
	 * Turn operations into an array with JSON friendly values. This does not
	 * do anything special with the actual values and just assumes they are
	 * already JSON friendly.
	 */
	exports.toJSON = function (op) {
		var result = [];
		CompoundOperation.asArray(op).forEach(function (subOp) {
			if (subOp instanceof ops.Set) {
				result.push(['set', {
					key: subOp.key,
					oldValue: subOp.oldValue,
					newValue: subOp.newValue
				}]);
			} else {
				throw new Error('Unsupported operation: ' + subOp);
			}
		});

		return result;
	};

	/**
	 * Turn a JSON value into operations that can be used when composing and
	 * transforming.
	 */
	exports.fromJSON = function (json) {
		var result = [];

		json.forEach(function (data) {
			switch (data[0]) {
				case "set":
					var op = data[1];
					result.push(new ops.Set(op.key, op.oldValue || null, op.newValue || null));
					break;
				default:
					throw new Error('Unsupported type of operation: ' + data[0]);
			}
		});

		return new CompoundOperation(result);
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ops = __webpack_require__(8);
	var CompoundOperation = __webpack_require__(7);

	/**
	 * Helper for building a delta over a map.
	 */

	var MapDelta = function () {
		function MapDelta() {
			_classCallCheck(this, MapDelta);

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


		_createClass(MapDelta, [{
			key: 'set',
			value: function set(key, currentValue, newValue) {
				var current = this._values[key];
				if (current) {
					if (current.newValue != currentValue) {
						throw 'Trying set value twice, but newValue of previous set does not match currentValue of this set';
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

		}, {
			key: 'remove',
			value: function remove(key, currentValue) {
				return this.set(key, currentValue, null);
			}

			/**
	   * Create the operation that represent these changes.
	   */

		}, {
			key: 'done',
			value: function done() {
				var result = [];

				for (var key in this._values) {
					if (!this._values.hasOwnProperty(key)) continue;

					var value = this._values[key];
					result.push(new ops.Set(key, value.oldValue, value.newValue));
				}

				return new CompoundOperation(result);
			}
		}]);

		return MapDelta;
	}();

	module.exports = MapDelta;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ListType = __webpack_require__(13);
	var ListDelta = __webpack_require__(15);

	exports.ListType = ListType;
	exports.newType = function (options) {
	  return new ListType(options);
	};

	exports.ListDelta = ListDelta;
	exports.delta = function () {
	  return new ListDelta();
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var OTType = __webpack_require__(3);
	var _compose = __webpack_require__(14);
	var _transform = __webpack_require__(17);
	var serialization = __webpack_require__(18);

	var ListType = function (_OTType) {
		_inherits(ListType, _OTType);

		function ListType() {
			_classCallCheck(this, ListType);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(ListType).call(this));
		}

		_createClass(ListType, [{
			key: 'compose',
			value: function compose(left, right) {
				return _compose(left, right);
			}
		}, {
			key: 'transform',
			value: function transform(left, right) {
				return _transform(left, right);
			}
		}, {
			key: 'toJSON',
			value: function toJSON(op) {
				return serialization.toJSON(op);
			}
		}, {
			key: 'fromJSON',
			value: function fromJSON(json) {
				return serialization.fromJSON(json);
			}
		}]);

		return ListType;
	}(OTType);

	module.exports = ListType;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var OperationIterator = __webpack_require__(6);
	var ListDelta = __webpack_require__(15);
	var ops = __webpack_require__(16);

	/**
	 * Compose two operations by stepping through operations to figure out how
	 * the combined result should look like.
	 */
	module.exports = function (left, right) {
		left = new OperationIterator(left);
		right = new OperationIterator(right);

		var delta = new ListDelta();

		function handleRetain(op1, op2) {
			var length1 = op1.length;

			if (op2 instanceof ops.Retain) {
				var length2 = op2.length;

				if (length1 < length2) {
					// Left operation is shorter, retain left count and rewrite right
					delta.retain(length1);

					right.replace(new ops.Retain(length2 - length1));
				} else if (length1 > length2) {
					// Right operation is shorter, retain right and rewrite left
					delta.retain(length2);

					left.replace(new ops.Retain(length1 - length2));
				} else {
					// Matching lengths, no need to do anything special
					delta.retain(length1);
				}
			} else if (op2 instanceof ops.Insert) {
				// Right operation is a insert, insert and handle this retain again
				delta.adopt(op2);

				left.back();
			} else if (op2 instanceof ops.Delete) {
				// Right operation is a delete, add it to the delta and replace ourselves

				var items2 = op2.items;
				var _length = items2.length;

				if (length1 < _length) {
					delta.deleteMultiple(items2.slice(0, length1));
					right.replace(new ops.Delete(items2.slice(length1)));
				} else if (length1 > _length) {
					// Only replace if we deleted less than we retain
					delta.deleteMultiple(items2);
					left.replace(new ops.Retain(length1 - _length));
				} else {
					delta.deleteMultiple(items2);
				}
			}
		}

		function handleInsert(op1, op2) {
			var items1 = op1.items;
			var length1 = items1.length;

			if (op2 instanceof ops.Retain) {
				var length2 = op2.length;

				if (length1 < length2) {
					/*
	     * Left can fit into the right retain, insert all of it and
	     * replace right with leftover retain count.
	     */

					delta.adopt(op1);
					right.replace(new ops.Retain(length2 - length1));
				} else if (length1 > length2) {
					/*
	     * Left is longer than right. Insert substring of left and
	     * replace with rest of value.
	     */
					delta.insertMultiple(items1.slice(0, length2));

					left.replace(new ops.Insert(items1.slice(length2)));
				} else {
					// Both left and right have the same length
					delta.adopt(op1);
				}
			} else if (op2 instanceof ops.Insert) {
				/*
	    * Two inserts, right is inserted first and the we handle left
	    * again.
	    */
				delta.adopt(op2);
				left.back();
			} else if (op2 instanceof ops.Delete) {
				var items2 = op2.items;
				var _length2 = items2.length;

				if (length1 > _length2) {
					/*
	     * Left insert is longer than right delete, replace left with
	     * remaining text from left.
	     */
					left.replace(new ops.Insert(items1.slice(_length2)));
				} else if (length1 < _length2) {
					/*
	     * Left insert is shorther than right delete, replace right with
	     * remaining text from right.
	     */
					right.replace(new ops.Delete(items2.slice(length1)));
				} else {
					// Exact same length, do nothing as they cancel each other
				}
			}
		}

		function handleDelete(op1, op2) {
			if (op2 instanceof ops.Retain) {
				/*
	    * Right operation is a retain, delete left and back up one to
	    * handle right retain again.
	    */
				delta.adopt(op1);

				right.back();
			} else if (op2 instanceof ops.Insert) {
				/*
	    * Right opreation is an insert, push left delete and right insert
	    * onto the delta.
	    */
				delta.adopt(op1);
				delta.adopt(op2);
			} else if (op2 instanceof ops.Delete) {
				/*
	    * Right operation is also a delete. Push left delete and handle
	    * right delete again.
	    */
				delta.adopt(op1);
				right.back();
			}
		}

		while (left.hasNext && right.hasNext) {
			var op1 = left.next();
			var op2 = right.next();

			if (op1 instanceof ops.Retain) {
				handleRetain(op1, op2);
			} else if (op1 instanceof ops.Insert) {
				handleInsert(op1, op2);
			} else if (op1 instanceof ops.Delete) {
				handleDelete(op1, op2);
			}
		}

		while (left.hasNext) {
			var _op = left.next();
			if (_op instanceof ops.Delete) {
				delta.adopt(_op);
			} else {
				throw new Error('Composition failure: Operation size mismatch');
			}
		}

		while (right.hasNext) {
			var _op2 = right.next();
			if (_op2 instanceof ops.Retain) {
				throw new Error('Dangling retain: ' + _op2);
			}

			delta.adopt(_op2);
		}

		return delta.done();
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ops = __webpack_require__(16);
	var CompoundOperation = __webpack_require__(7);

	var EMPTY = 0;
	var RETAIN = 1;
	var INSERT = 2;
	var DELETE = 3;

	/**
	 * Helper to create operations that indicate changes to a string.
	 */

	var ListDelta = function () {
		function ListDelta() {
			_classCallCheck(this, ListDelta);

			this._ops = [];

			this._retainCount = 0;
			this._state = EMPTY;
			this._items = [];
		}

		_createClass(ListDelta, [{
			key: '_flush',
			value: function _flush() {
				switch (this._state) {
					case RETAIN:
						if (this._retainCount > 0) {
							this._ops.push(new ops.Retain(this._retainCount));
							this._retainCount = 0;
						}
						break;
					case INSERT:
						if (this._items.length > 0) {
							var op = new ops.Insert(this._items);

							/*
	       * If the previous operation is a delete operation we
	       * enforce that this insert comes before it.
	       */
							var previous = this._ops[this._ops.length - 1];
							if (previous instanceof ops.Delete) {
								this._ops[this._ops.length - 1] = op;
								this._ops.push(previous);
							} else {
								this._ops.push(op);
							}

							this._items.length = 0;
						}
						break;
					case DELETE:
						if (this._items.length > 0) {
							this._ops.push(new ops.Delete(this._items));
							this._items.length = 0;
						}
						break;
				}
			}
		}, {
			key: '_switchState',
			value: function _switchState(state) {
				if (this._state != state) {
					this._flush();
					this._state = state;
				}
			}
		}, {
			key: 'retain',
			value: function retain(length) {
				if (length <= 0) return this;

				this._switchState(RETAIN);

				this._retainCount += length;
				return this;
			}
		}, {
			key: 'insert',
			value: function insert(item) {
				this._switchState(INSERT);

				this._items.push(item);
				return this;
			}
		}, {
			key: 'insertMultiple',
			value: function insertMultiple(items) {
				var _this = this;

				this._switchState(INSERT);

				items.forEach(function (item) {
					return _this._items.push(item);
				});
				return this;
			}
		}, {
			key: 'delete',
			value: function _delete(item) {
				this._switchState(DELETE);

				this._items.push(item);
				return this;
			}
		}, {
			key: 'deleteMultiple',
			value: function deleteMultiple(items) {
				var _this2 = this;

				this._switchState(DELETE);

				items.forEach(function (item) {
					return _this2._items.push(item);
				});
				return this;
			}
		}, {
			key: 'adopt',
			value: function adopt(op) {
				if (op instanceof ops.Retain) {
					this.retain(op.length);
				} else if (op instanceof ops.Insert) {
					this.insertMultiple(op.items);
				} else if (op instanceof ops.Delete) {
					this.deleteMultiple(op.items);
				} else {
					throw new Error('Unsupported operation: ' + op);
				}

				return this;
			}
		}, {
			key: 'done',
			value: function done() {
				this._flush();
				return new CompoundOperation(this._ops);
			}
		}]);

		return ListDelta;
	}();

	module.exports = ListDelta;

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Retain operation. Indicates that a number of list items should be kept.
	 */

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Retain = function () {
		function Retain(length) {
			_classCallCheck(this, Retain);

			this.length = length;
		}

		_createClass(Retain, [{
			key: 'apply',
			value: function apply(handler) {
				handler.retain(this.length);
			}
		}, {
			key: 'invert',
			value: function invert() {
				return this;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return 'Retain{' + this.length + '}';
			}
		}]);

		return Retain;
	}();

	/**
	 * Insert operation. Insert items at the given position.
	 */


	var Insert = function () {
		function Insert(items) {
			_classCallCheck(this, Insert);

			this.items = items.slice(0);
		}

		_createClass(Insert, [{
			key: 'apply',
			value: function apply(handler) {
				handler.insert(this.items);
			}
		}, {
			key: 'invert',
			value: function invert() {
				return Delete(this.items);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return 'Insert{' + this.items.join(', ') + '}';
			}
		}]);

		return Insert;
	}();

	/**
	 * Delete operation. Delete some text at the current position.
	 */


	var Delete = function () {
		function Delete(items) {
			_classCallCheck(this, Delete);

			this.items = items.slice(0);
		}

		_createClass(Delete, [{
			key: 'apply',
			value: function apply(handler) {
				handler.delete(this.items);
			}
		}, {
			key: 'invert',
			value: function invert() {
				return Insert(this.items);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return 'Delete{' + this.items.join(', ') + '}';
			}
		}]);

		return Delete;
	}();

	exports.Retain = Retain;
	exports.Insert = Insert;
	exports.Delete = Delete;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var OperationIterator = __webpack_require__(6);
	var ListDelta = __webpack_require__(15);
	var ops = __webpack_require__(16);

	/**
	 * Main transformation for lists. Very similar to how strings are handled.
	 */
	module.exports = function (left, right) {
		left = new OperationIterator(left);
		right = new OperationIterator(right);

		var deltaLeft = new ListDelta();
		var deltaRight = new ListDelta();

		function handleRetain(op1, op2) {
			var length1 = op1.length;

			if (op2 instanceof ops.Retain) {
				var length2 = op2.length;

				if (length1 > length2) {
					/*
	     * Left is longer than right, retain length of right and
	     * replace left with remaining.
	     */

					deltaLeft.retain(length2);
					deltaRight.retain(length2);

					left.replace(new ops.Retain(length1 - length2));
				} else if (length1 < length2) {
					/*
	     * Left is shorter than right, retain length of left and
	     * replace right with remaining.
	     */

					deltaLeft.retain(length1);
					deltaRight.retain(length1);

					right.replace(new ops.Retain(length2 - length1));
				} else {
					// Same length, retain both
					deltaLeft.retain(length1);
					deltaRight.retain(length2);
				}
			} else if (op2 instanceof ops.Insert) {
				/*
	    * Right is an insertion, just insert into right with a matching
	    * retain into left detla and ask left to be handled again.
	    */
				var items2 = op2.items;
				var _length = items2.length;

				deltaLeft.retain(_length);
				deltaRight.adopt(op2);

				left.back();
			} else if (op2 instanceof ops.Delete) {
				var _items = op2.items;
				var _length2 = _items.length;

				if (length1 > _length2) {
					/*
	     * Left is longer than right, let right delete and replace
	     * left with retain of remaining.
	     */
					deltaRight.adopt(op2);

					left.replace(new ops.Retain(length1 - _length2));
				} else if (length1 < _length2) {
					/*
	     * Left is shorter than right, let right delete and replace
	     * right with remaining.
	     */
					deltaRight.deleteMultiple(_items.slice(0, length1));

					right.replace(new ops.Delete(_items.slice(length1)));
				} else {
					// Same length, simply delete
					deltaRight.adopt(op2);
				}
			}
		}

		function handleInsert(op1, op2) {
			var items1 = op1.items;
			var length1 = items1.length;

			deltaLeft.adopt(op1);
			deltaRight.retain(length1);

			right.back();
		}

		function handleDelete(op1, op2) {
			var items1 = op1.items;
			var length1 = items1.length;

			if (op2 instanceof ops.Retain) {
				var length2 = op2.length;
				if (length1 > length2) {
					/*
	     * Left is longer than right, delete up to length of right
	     * and replace left with delete for remaining.
	     */
					deltaLeft.deleteMultiple(items1.slice(0, length2));

					left.replace(new ops.Delete(items1.slice(length2)));
				} else if (length1 < length2) {
					/*
	     * Left is shorter than right, delete all and replace right
	     * with retain of reamining.
	     */
					deltaLeft.adopt(op1);

					right.replace(new ops.Retain(length2 - length1));
				} else {
					// Same length, just delete
					deltaLeft.adopt(op1);
				}
			} else if (op2 instanceof ops.Insert) {
				/*
	    * Right is an insertion, just insert into right with a matching
	    * retain into left detla and ask left to be handled again.
	    */
				var items2 = op2.items;
				var _length3 = items2.length;

				deltaLeft.retain(_length3);
				deltaRight.adopt(op2);

				left.back();
			} else if (op2 instanceof ops.Delete) {
				var _items2 = op2.items;
				var _length4 = _items2.length;

				if (length1 > _length4) {
					/*
	     * Left is longer than right, replace left with a delete of
	     * remaining text.
	     */
					left.replace(new ops.Delete(items1.slice(_length4)));
				} else if (length1 < _length4) {
					/*
	     * Left is shorter than right, replace right with a delete of
	     * remaining text.
	     */
					right.replace(new ops.Delete(_items2.slice(length1)));
				} else {
					// Do nothing
				}
			}
		}

		while (left.hasNext) {
			var op1 = left.next();

			if (right.hasNext) {
				var op2 = right.next();

				if (op1 instanceof ops.Retain) {
					handleRetain(op1, op2);
				} else if (op1 instanceof ops.Insert) {
					handleInsert(op1, op2);
				} else if (op1 instanceof ops.Delete) {
					handleDelete(op1, op2);
				}
			} else {
				/*
	    * Operations are still available, but no matching operations
	    * in right.
	    */
				if (op1 instanceof ops.Insert) {
					var items1 = op1.items;
					deltaLeft.adopt(op1);
					deltaRight.retain(items1.length);
				} else {
					throw 'Transformation failure, mismatch in operation. Current left operation: ' + op1.toString();
				}
			}
		}

		while (right.hasNext) {
			var _op = right.next();
			if (_op instanceof ops.Insert) {
				var items2 = _op.items;

				deltaRight.adopt(_op);
				deltaLeft.retain(items2.length);
			} else {
				throw 'Transformation failure, mismatch in operation. Current right operation: ' + _op.toString();
			}
		}

		return {
			left: deltaLeft.done(),
			right: deltaRight.done()
		};
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var CompoundOperation = __webpack_require__(7);
	var ListDelta = __webpack_require__(15);
	var ops = __webpack_require__(16);

	/**
	 * Turn operations into an array with JSON friendly values.
	 */
	exports.toJSON = function (op) {
		var result = [];
		CompoundOperation.asArray(op).forEach(function (subOp) {
			if (subOp instanceof ops.Retain) {
				result.push(['retain', subOp.length]);
			} else if (subOp instanceof ops.Insert) {
				result.push(['insert', subOp.items]);
			} else if (subOp instanceof ops.Delete) {
				result.push(['delete', subOp.items]);
			} else {
				throw new Error('Unsupported operation: ' + subOp);
			}
		});

		return result;
	};

	/**
	 * Turn a JSON value into operations that can be used when composing and
	 * transforming.
	 */
	exports.fromJSON = function (json) {
		var delta = new ListDelta();

		json.forEach(function (data) {
			switch (data[0]) {
				case 'retain':
					var length = data[1];
					delta.retain(length);
					break;
				case 'insert':
					delta.insertMultiple(data[1]);
					break;
				case 'delete':
					delta.deleteMultiple(data[1]);
					break;
				default:
					throw new Error('Unsupported type of operation: ' + data[0]);
			}
		});

		return delta.done();
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var StringType = __webpack_require__(20);
	var StringDelta = __webpack_require__(22);

	exports.StringType = StringType;
	exports.newType = function (options) {
	  return new StringType(options);
	};

	exports.StringDelta = StringDelta;
	exports.delta = function () {
	  return new StringDelta();
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var OTType = __webpack_require__(3);
	var _compose = __webpack_require__(21);
	var _transform = __webpack_require__(25);
	var serialization = __webpack_require__(26);

	var StringType = function (_OTType) {
		_inherits(StringType, _OTType);

		function StringType() {
			_classCallCheck(this, StringType);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(StringType).call(this));
		}

		_createClass(StringType, [{
			key: 'compose',
			value: function compose(left, right) {
				return _compose(left, right);
			}
		}, {
			key: 'transform',
			value: function transform(left, right) {
				return _transform(left, right);
			}
		}, {
			key: 'toJSON',
			value: function toJSON(op) {
				return serialization.toJSON(op);
			}
		}, {
			key: 'fromJSON',
			value: function fromJSON(json) {
				return serialization.fromJSON(json);
			}
		}]);

		return StringType;
	}(OTType);

	module.exports = StringType;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var OperationIterator = __webpack_require__(6);
	var StringDelta = __webpack_require__(22);
	var ops = __webpack_require__(23);

	var annotations = __webpack_require__(24);
	var AnnotationChange = annotations.AnnotationChange;

	/**
	 * Compose two operations by stepping through operations to figure out how
	 * the combined result should look like.
	 */
	module.exports = function (left, right) {
		left = new OperationIterator(left);
		right = new OperationIterator(right);

		var annotationChanges = null;

		var delta = new annotations.AnnotationNormalizingDelta(new StringDelta(), function () {
			var change = annotationChanges;
			annotationChanges = null;
			return change;
		});

		function handleRetain(op1, op2) {
			var length1 = op1.length;

			if (op2 instanceof ops.Retain) {
				var length2 = op2.length;

				if (length1 < length2) {
					// Left operation is shorter, retain left count and rewrite right
					delta.retain(length1);

					right.replace(new ops.Retain(length2 - length1));
				} else if (length1 > length2) {
					// Right operation is shorter, retain right and rewrite left
					delta.retain(length2);

					left.replace(new ops.Retain(length1 - length2));
				} else {
					// Matching lengths, no need to do anything special
					delta.retain(length1);
				}
			} else if (op2 instanceof ops.Insert) {
				// Right operation is a insert, insert and handle this retain again
				delta.insert(op2.value);

				left.back();
			} else if (op2 instanceof ops.Delete) {
				// Right operation is a delete, add it to the delta and replace ourselves

				var value2 = op2.value;
				var _length = value2.length;

				if (length1 < _length) {
					delta.delete(value2.substring(0, length1));
					right.replace(new ops.Delete(value2.substring(length1)));
				} else if (length1 > _length) {
					// Only replace if we deleted less than we retain
					delta.delete(value2);
					left.replace(new ops.Retain(length1 - _length));
				} else {
					delta.delete(value2);
				}
			} else if (op2 instanceof ops.AnnotationUpdate) {
				annotationChanges = AnnotationChange.merge(annotationChanges, op2.change);
				left.back();
			}
		}

		function handleInsert(op1, op2) {
			var value1 = op1.value;
			var length1 = op1.value.length;

			if (op2 instanceof ops.Retain) {
				var length2 = op2.length;

				if (length1 < length2) {
					/*
	     * Left can fit into the right retain, insert all of it and
	     * replace right with leftover retain count.
	     */

					delta.insert(value1);
					right.replace(new ops.Retain(length2 - length1));
				} else if (length1 > length2) {
					/*
	     * Left is longer than right. Insert substring of left and
	     * replace with rest of value.
	     */
					delta.insert(value1.substring(0, length2));

					left.replace(new ops.Insert(value1.substring(length2)));
				} else {
					// Both left and right have the same length
					delta.insert(value1);
				}
			} else if (op2 instanceof ops.Insert) {
				/*
	    * Two inserts, right is inserted first and the we handle left
	    * again.
	    */
				delta.insert(op2.value);
				left.back();
			} else if (op2 instanceof ops.Delete) {
				var value2 = op2.value;
				var _length2 = value2.length;

				if (length1 > _length2) {
					/*
	     * Left insert is longer than right delete, replace left with
	     * remaining text from left.
	     */
					left.replace(new ops.Insert(value1.substring(_length2)));
				} else if (length1 < _length2) {
					/*
	     * Left insert is shorther than right delete, replace right with
	     * remaining text from right.
	     */
					right.replace(new ops.Delete(value2.substring(length1)));
				} else {
					// Exact same length, do nothing as they cancel each other
				}
			} else if (op2 instanceof ops.AnnotationUpdate) {
				annotationChanges = AnnotationChange.merge(annotationChanges, op2.change);
				left.back();
			}
		}

		function handleDelete(op1, op2) {
			var value1 = op1.value;
			var length1 = value1.length;

			if (op2 instanceof ops.Retain) {
				/*
	    * Right operation is a retain, delete left and back up one to
	    * handle right retain again.
	    */
				delta.delete(value1);

				right.back();
			} else if (op2 instanceof ops.Insert) {
				/*
	    * Right opreation is an insert, push left delete and right insert
	    * onto the delta.
	    */
				delta.delete(value1);
				delta.insert(op2.value);
			} else if (op2 instanceof ops.Delete) {
				/*
	    * Right operation is also a delete. Push left delete and handle
	    * right delete again.
	    */
				delta.delete(value1);
				right.back();
			} else if (op2 instanceof ops.AnnotationUpdate) {
				annotationChanges = AnnotationChange.merge(annotationChanges, op2.change);
				left.back();
			}
		}

		function handleAnnotationUpdate(op1, op2) {
			var change1 = op1.change;

			if (op2 instanceof ops.AnnotationUpdate) {
				/*
	    * Right operation is also an annotation update. Merge the two
	    * sets of changes.
	    */
				var merged = AnnotationChange.merge(change1, op2.change);
				annotationChanges = AnnotationChange.merge(annotationChanges, merged);
			} else {
				/*
	    * Right operation is something else, queue the annotation changes
	    * and handle right again.
	    */
				annotationChanges = AnnotationChange.merge(annotationChanges, change1);
				right.back();
			}
		}

		while (left.hasNext && right.hasNext) {
			var op1 = left.next();
			var op2 = right.next();

			if (op1 instanceof ops.Retain) {
				handleRetain(op1, op2);
			} else if (op1 instanceof ops.Insert) {
				handleInsert(op1, op2);
			} else if (op1 instanceof ops.Delete) {
				handleDelete(op1, op2);
			} else if (op1 instanceof ops.AnnotationUpdate) {
				handleAnnotationUpdate(op1, op2);
			}
		}

		while (left.hasNext) {
			var _op = left.next();
			if (_op instanceof ops.AnnotationUpdate || _op instanceof ops.Delete) {
				/*
	    * Annotation updates are zero-sized so they can always be composed.
	    */
				_op.apply(delta);
			} else {
				throw new Error('Composition failure: Operation size mismatch');
			}
		}

		while (right.hasNext) {
			var _op2 = right.next();
			_op2.apply(delta);
		}

		return delta.done();
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ops = __webpack_require__(23);
	var CompoundOperation = __webpack_require__(7);
	var AnnotationChange = __webpack_require__(24).AnnotationChange;

	var EMPTY = 0;
	var RETAIN = 1;
	var INSERT = 2;
	var DELETE = 3;
	var ANNOTATIONS = 4;

	/**
	 * Helper to create operations that indicate changes to a string.
	 */

	var StringDelta = function () {
		function StringDelta() {
			_classCallCheck(this, StringDelta);

			this._ops = [];

			this._state = EMPTY;
			this._value = '';
		}

		_createClass(StringDelta, [{
			key: '_flush',
			value: function _flush() {
				switch (this._state) {
					case RETAIN:
						if (this._retainCount > 0) {
							this._ops.push(new ops.Retain(this._retainCount));
						}
						break;
					case INSERT:
						if (this._value.length > 0) {
							var op = new ops.Insert(this._value);

							/*
	       * If the previous operation is a delete operation we
	       * enforce that this insert comes before it.
	       */
							var previous = this._ops[this._ops.length - 1];
							if (previous instanceof ops.Delete) {
								this._ops[this._ops.length - 1] = op;
								this._ops.push(previous);
							} else {
								this._ops.push(op);
							}
						}
						break;
					case DELETE:
						if (this._value.length > 0) {
							this._ops.push(new ops.Delete(this._value));
						}
						break;
					case ANNOTATIONS:
						if (this._annotationChange) {
							this._ops.push(new ops.AnnotationUpdate(this._annotationChange));
						}
				}

				this._retainCount = 0;
				this._value = '';
				this._annotationChange = null;
			}
		}, {
			key: 'retain',
			value: function retain(length) {
				if (length <= 0) return;

				if (this._state != RETAIN) {
					this._flush();
					this._state = RETAIN;
				}

				this._retainCount += length;
				return this;
			}
		}, {
			key: 'insert',
			value: function insert(value) {
				if (this._state != INSERT) {
					this._flush();
					this._state = INSERT;
				}

				this._value += value;
				return this;
			}
		}, {
			key: 'delete',
			value: function _delete(value) {
				if (this._state != DELETE) {
					this._flush();
					this._state = DELETE;
				}

				this._value += value;
				return this;
			}
		}, {
			key: 'updateAnnotations',
			value: function updateAnnotations(changes) {
				if (changes) {
					if (changes.empty) return;

					if (this._state != ANNOTATIONS) {
						this._flush();
						this._state = ANNOTATIONS;
					}

					this._annotationChange = AnnotationChange.merge(this._annotationChange, changes);
				} else {
					return new AnnotationUpdater(this);
				}
			}
		}, {
			key: 'done',
			value: function done() {
				this._flush();
				return new CompoundOperation(this._ops);
			}
		}]);

		return StringDelta;
	}();

	var AnnotationUpdater = function () {
		function AnnotationUpdater(parent) {
			_classCallCheck(this, AnnotationUpdater);

			this._parent = parent;
			this._changes = {};
		}

		_createClass(AnnotationUpdater, [{
			key: 'set',
			value: function set(key, oldValue, newValue) {
				if (newValue === null || typeof newValue === 'undefined') {
					throw new Error('newValue must have a non-null value');
				}

				this._changes[key] = {
					oldValue: oldValue,
					newValue: newValue
				};

				return this;
			}
		}, {
			key: 'remove',
			value: function remove(key, currentValue) {
				if (currentValue === null || typeof currentValue === 'undefined') {
					throw new Error('currentValue must have a non-null value');
				}

				this._changes[key] = {
					oldValue: currentValue,
					newValue: null
				};

				return this;
			}
		}, {
			key: 'done',
			value: function done() {
				var change = new AnnotationChange(this._changes);
				if (change.empty) return this._parent;

				if (this._parent._state != ANNOTATIONS) {
					this._parent._flush();
					this._parent._state = ANNOTATIONS;
				}

				this._parent._annotationChange = AnnotationChange.merge(this._parent._annotationChange, new AnnotationChange(this._changes));

				return this._parent;
			}
		}]);

		return AnnotationUpdater;
	}();

	module.exports = StringDelta;

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Retain operation. Indicates that a number of characters should be retained
	 * from the current value.
	 */

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Retain = function () {
		function Retain(length) {
			_classCallCheck(this, Retain);

			this.length = length;
		}

		_createClass(Retain, [{
			key: 'apply',
			value: function apply(handler) {
				handler.retain(this.length);
			}
		}, {
			key: 'invert',
			value: function invert() {
				return this;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return 'Retain{' + this.length + '}';
			}
		}]);

		return Retain;
	}();

	/**
	 * Insert operation. Insert some text at the current position.
	 */


	var Insert = function () {
		function Insert(value) {
			_classCallCheck(this, Insert);

			this.value = value;
		}

		_createClass(Insert, [{
			key: 'apply',
			value: function apply(handler) {
				handler.insert(this.value);
			}
		}, {
			key: 'invert',
			value: function invert() {
				return Delete(this.value);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return 'Insert{' + this.value + '}';
			}
		}]);

		return Insert;
	}();

	/**
	 * Delete operation. Delete some text at the current position.
	 */


	var Delete = function () {
		function Delete(value) {
			_classCallCheck(this, Delete);

			this.value = value;
		}

		_createClass(Delete, [{
			key: 'apply',
			value: function apply(handler) {
				handler.delete(this.value);
			}
		}, {
			key: 'invert',
			value: function invert() {
				return Insert(this.value);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return 'Delete{' + this.value + '}';
			}
		}]);

		return Delete;
	}();

	var AnnotationUpdate = function () {
		function AnnotationUpdate(change) {
			_classCallCheck(this, AnnotationUpdate);

			this.change = change;
		}

		_createClass(AnnotationUpdate, [{
			key: 'apply',
			value: function apply(handler) {
				handler.updateAnnotations(this.change);
			}
		}, {
			key: 'invert',
			value: function invert() {
				return new AnnotationUpdate(this.change.invert());
			}
		}, {
			key: 'toString',
			value: function toString() {
				return 'AnnotationUpdate{' + this.change + '}';
			}
		}]);

		return AnnotationUpdate;
	}();

	exports.Retain = Retain;
	exports.Insert = Insert;
	exports.Delete = Delete;
	exports.AnnotationUpdate = AnnotationUpdate;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ops = __webpack_require__(23);

	/**
	 * Decsribes several changes to annotations.
	 */

	var AnnotationChange = function () {
		function AnnotationChange(changes) {
			_classCallCheck(this, AnnotationChange);

			this._changes = changes;

			this.length = this.keys().length;
		}

		_createClass(AnnotationChange, [{
			key: 'keys',
			value: function keys() {
				return Object.keys(this._changes);
			}
		}, {
			key: 'forEach',
			value: function forEach(callback) {
				var _this = this;

				this.keys().forEach(function (key) {
					var change = _this._changes[key];
					callback.call(null, key, change.oldValue, change.newValue);
				});
			}
		}, {
			key: 'containsKey',
			value: function containsKey(key) {
				return !!this._changes[key];
			}
		}, {
			key: 'get',
			value: function get(key) {
				var change = this._changes[key];
				return change ? change.newValue : null;
			}
		}, {
			key: 'getChange',
			value: function getChange(key) {
				return this._changes[key];
			}
		}, {
			key: 'isRemoval',
			value: function isRemoval(key) {
				var change = this._changes[key];
				return change ? change.newValue === null : false;
			}
		}, {
			key: 'invert',
			value: function invert() {
				var result = {};
				this.forEach(function (key, oldValue, newValue) {
					result[key] = {
						oldValue: newValue,
						newValue: oldValue
					};
				});

				return new AnnotationChange(result);
			}
		}, {
			key: 'mergeWith',
			value: function mergeWith(other) {
				var result = {};
				this.forEach(function (key, oldValue, newValue) {
					result[key] = {
						oldValue: oldValue,
						newValue: newValue
					};
				});

				other.forEach(function (key, oldValue, newValue) {
					var current = result[key];
					var change = {
						oldValue: oldValue,
						newValue: newValue
					};

					if (current) {
						if (current.newValue == oldValue) {
							/*
	       * Merge changes if the last change has the same new value
	       * this change says is its old value.
	       */
							change.oldValue = current.oldValue;
						} else if (!newValue && current.newValue) {
							/*
	       * The changes indicates a removal but does not seem to
	       * be a continuation of the previous one. Let the current
	       * value win.
	       */
							return;
						}
					}

					if (change.oldValue != change.newValue) {
						result[key] = change;
					} else {
						delete result[key];
					}
				});

				return new AnnotationChange(result);
			}
		}, {
			key: 'toString',
			value: function toString() {
				var items = [];
				this.forEach(function (key, oldValue, newValue) {
					items.push(key + '=' + oldValue + ' -> ' + newValue);
				});
				return '[' + items.join(', ') + ']';
			}
		}, {
			key: 'empty',
			get: function get() {
				return this.length === 0;
			}
		}], [{
			key: 'merge',
			value: function merge(first, second) {
				if (!first) return second;
				if (!second) return first;

				return first.mergeWith(second);
			}
		}]);

		return AnnotationChange;
	}();

	var AnnotationNormalizingDelta = function () {
		function AnnotationNormalizingDelta(delta, source) {
			_classCallCheck(this, AnnotationNormalizingDelta);

			this.delta = delta;
			this.source = source;
			this.tracker = {};
		}

		_createClass(AnnotationNormalizingDelta, [{
			key: 'retain',
			value: function retain(count) {
				this.flush();
				this.delta.retain(count);
			}
		}, {
			key: 'insert',
			value: function insert(s) {
				this.flush();
				this.delta.insert(s);
			}
		}, {
			key: 'delete',
			value: function _delete(s) {
				this.delta.delete(s);
			}
		}, {
			key: 'done',
			value: function done() {
				this.flush();
				return this.delta.done();
			}
		}, {
			key: 'updateAnnotations',
			value: function updateAnnotations(changes) {
				this.flush();
				this.delta.updateAnnotations(changes);
			}
		}, {
			key: 'flush',
			value: function flush() {
				var _this2 = this;

				var change = this.source();
				if (!change || change.empty) return;

				var updater = this.delta.updateAnnotations();
				change.forEach(function (key, oldValue, newValue) {
					var previous = _this2.tracker[key];

					if (newValue === null) {
						// This annotation key is being removed
						delete _this2.tracker[key];
						if (previous) {
							if (previous.newValue == oldValue) {
								updater.remove(key, previous.newValue);
							}
						} else {
							updater.remove(key, oldValue);
						}
					} else {
						// Annotation is being changed
						if (previous) {
							updater.set(key, previous.newValue, newValue);
						} else {
							updater.set(key, oldValue, newValue);
						}

						_this2.tracker[key] = {
							oldValue: oldValue,
							newValue: newValue
						};
					}
				});
				updater.done();
			}
		}]);

		return AnnotationNormalizingDelta;
	}();

	exports.AnnotationChange = AnnotationChange;
	exports.AnnotationNormalizingDelta = AnnotationNormalizingDelta;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var OperationIterator = __webpack_require__(6);
	var StringDelta = __webpack_require__(22);
	var ops = __webpack_require__(23);

	var annotations = __webpack_require__(24);
	var AnnotationChange = annotations.AnnotationChange;

	/**
	 * Main transformation for strings.
	 */
	module.exports = function (left, right) {
		left = new OperationIterator(left);
		right = new OperationIterator(right);

		var leftAnnotations = void 0;
		var rightAnnotations = void 0;
		var deltaLeft = new annotations.AnnotationNormalizingDelta(new StringDelta(), function () {
			var change = leftAnnotations;
			leftAnnotations = null;
			return change;
		});
		var deltaRight = new annotations.AnnotationNormalizingDelta(new StringDelta(), function () {
			var change = rightAnnotations;
			rightAnnotations = null;
			return change;
		});

		function handleRetain(op1, op2) {
			var length1 = op1.length;

			if (op2 instanceof ops.Retain) {
				var length2 = op2.length;

				if (length1 > length2) {
					/*
	     * Left is longer than right, retain length of right and
	     * replace left with remaining.
	     */

					deltaLeft.retain(length2);
					deltaRight.retain(length2);

					left.replace(new ops.Retain(length1 - length2));
				} else if (length1 < length2) {
					/*
	     * Left is shorter than right, retain length of left and
	     * replace right with remaining.
	     */

					deltaLeft.retain(length1);
					deltaRight.retain(length1);

					right.replace(new ops.Retain(length2 - length1));
				} else {
					// Same length, retain both
					deltaLeft.retain(length1);
					deltaRight.retain(length2);
				}
			} else if (op2 instanceof ops.Insert) {
				/*
	    * Right is an insertion, just insert into right with a matching
	    * retain into left detla and ask left to be handled again.
	    */
				var value2 = op2.value;
				var _length = value2.length;

				deltaLeft.retain(_length);
				deltaRight.insert(value2);

				left.back();
			} else if (op2 instanceof ops.Delete) {
				var _value = op2.value;
				var _length2 = _value.length;

				if (length1 > _length2) {
					/*
	     * Left is longer than right, let right delete and replace
	     * left with retain of remaining.
	     */
					deltaRight.delete(_value);

					left.replace(new ops.Retain(length1 - _length2));
				} else if (length1 < _length2) {
					/*
	     * Left is shorter than right, let right delete and replace
	     * right with remaining.
	     */
					deltaRight.delete(_value.substring(0, length1));

					right.replace(new ops.Delete(_value.substring(length1)));
				} else {
					// Same length, simply delete
					deltaRight.delete(_value);
				}
			} else if (op2 instanceof ops.AnnotationUpdate) {
				rightAnnotations = AnnotationChange.merge(rightAnnotations, op2.change);
				left.back();
			}
		}

		function handleInsert(op1, op2) {
			if (op2 instanceof ops.AnnotationUpdate) {
				rightAnnotations = AnnotationChange.merge(rightAnnotations, op2.change);
				left.back();
			} else {
				var value1 = op1.value;
				var length1 = op1.value.length;

				deltaLeft.insert(value1);
				deltaRight.retain(length1);

				right.back();
			}
		}

		function handleDelete(op1, op2) {
			var value1 = op1.value;
			var length1 = value1.length;

			if (op2 instanceof ops.Retain) {
				var length2 = op2.length;
				if (length1 > length2) {
					/*
	     * Left is longer than right, delete up to length of right
	     * and replace left with delete for remaining.
	     */
					deltaLeft.delete(value1.substring(0, length2));

					left.replace(new ops.Delete(value1.substring(length2)));
				} else if (length1 < length2) {
					/*
	     * Left is shorter than right, delete all and replace right
	     * with retain of reamining.
	     */
					deltaLeft.delete(value1);

					right.replace(new ops.Retain(length2 - length1));
				} else {
					// Same length, just delete
					deltaLeft.delete(value1);
				}
			} else if (op2 instanceof ops.Insert) {
				/*
	    * Right is an insertion, just insert into right with a matching
	    * retain into left detla and ask left to be handled again.
	    */
				var value2 = op2.value;
				var _length3 = value2.length;

				deltaLeft.retain(_length3);
				deltaRight.insert(value2);

				left.back();
			} else if (op2 instanceof ops.Delete) {
				var _value2 = op2.value;
				var _length4 = _value2.length;

				if (length1 > _length4) {
					/*
	     * Left is longer than right, replace left with a delete of
	     * remaining text.
	     */
					left.replace(new ops.Delete(value1.substring(_length4)));
				} else if (length1 < _length4) {
					/*
	     * Left is shorter than right, replace right with a delete of
	     * remaining text.
	     */
					right.replace(new ops.Delete(_value2.substring(length1)));
				} else {
					// Do nothing
				}
			} else if (op2 instanceof ops.AnnotationUpdate) {
				rightAnnotations = AnnotationChange.merge(rightAnnotations, op2.change);
				left.back();
			}
		}

		function handleAnnotationUpdate(op1, op2) {
			var change1 = op1.change;
			leftAnnotations = AnnotationChange.merge(leftAnnotations, change1);

			if (op2 instanceof ops.AnnotationUpdate) {
				var change2 = op2.change;
				rightAnnotations = AnnotationChange.merge(rightAnnotations, change2);
			} else {
				right.back();
			}
		}

		while (left.hasNext) {
			var op1 = left.next();

			if (right.hasNext) {
				var op2 = right.next();

				if (op1 instanceof ops.Retain) {
					handleRetain(op1, op2);
				} else if (op1 instanceof ops.Insert) {
					handleInsert(op1, op2);
				} else if (op1 instanceof ops.Delete) {
					handleDelete(op1, op2);
				} else if (op1 instanceof ops.AnnotationUpdate) {
					handleAnnotationUpdate(op1, op2);
				}
			} else {
				/*
	    * Operations are still available, but no matching operations
	    * in right.
	    */
				if (op1 instanceof ops.Insert) {
					var value1 = op1.value;
					deltaLeft.insert(value1);
					deltaRight.retain(value1.length);
				} else {
					throw 'Transformation failure, mismatch in operation. Current left operation: ' + op1.toString();
				}
			}
		}

		while (right.hasNext) {
			var _op = right.next();
			if (_op instanceof ops.Insert) {
				var value2 = _op.value;

				deltaRight.insert(value2);
				deltaLeft.retain(value2.length);
			} else {
				throw 'Transformation failure, mismatch in operation. Current right operation: ' + _op.toString();
			}
		}

		return {
			left: deltaLeft.done(),
			right: deltaRight.done()
		};
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var CompoundOperation = __webpack_require__(7);
	var ops = __webpack_require__(23);
	var StringDelta = __webpack_require__(22);
	var AnnotationChange = __webpack_require__(24).AnnotationChange;

	/**
	 * Turn operations into a string.
	 */
	exports.toJSON = function (op) {
		var result = [];
		CompoundOperation.asArray(op).forEach(function (subOp) {
			if (subOp instanceof ops.Retain) {
				result.push(['retain', subOp.length]);
			} else if (subOp instanceof ops.Insert) {
				result.push(['insert', subOp.value]);
			} else if (subOp instanceof ops.Delete) {
				result.push(['delete', subOp.value]);
			} else if (subOp instanceof ops.AnnotationUpdate) {
				result.push(['annotations', subOp.change._changes]);
			} else {
				throw new Error('Unsupported operation: ' + subOp);
			}
		});

		return result;
	};

	/**
	 * Turn a JSON string into operations we can work with.
	 */
	exports.fromJSON = function (input) {
		if (!Array.isArray(input)) {
			throw new Error('Given input is not an array, got: ' + input);
		}

		var delta = new StringDelta();
		input.forEach(function (op) {
			switch (op[0]) {
				case 'retain':
					delta.retain(op[1]);
					break;
				case 'insert':
					delta.insert(op[1]);
					break;
				case 'delete':
					delta.delete(op[1]);
					break;
				case 'annotations':
					delta.updateAnnotations(new AnnotationChange(op[1]));
					break;
				default:
					throw new Error('Unknown operation: ' + op);
			}
		});

		return delta.done();
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var CombinedType = __webpack_require__(28);
	var CombinedDelta = __webpack_require__(33);

	exports.CombinedType = CombinedType;
	exports.newType = function (options) {
	  return new CombinedType(options);
	};

	exports.CombinedDelta = CombinedDelta;
	exports.delta = function () {
	  return new CombinedDelta();
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var OTType = __webpack_require__(3);

	var map = __webpack_require__(1);
	var string = __webpack_require__(19);
	var list = __webpack_require__(12);

	var _compose = __webpack_require__(29);
	var _transform = __webpack_require__(31);
	var serialization = __webpack_require__(32);

	var CombinedType = function (_OTType) {
		_inherits(CombinedType, _OTType);

		function CombinedType() {
			_classCallCheck(this, CombinedType);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CombinedType).call(this));

			_this.types = {
				map: map.newType(),
				list: list.newType(),
				string: string.newType()
			};
			return _this;
		}

		_createClass(CombinedType, [{
			key: 'addType',
			value: function addType(id, type) {
				if (type.newType) {
					type = type.newType();
				}

				if (!type.transform || !type.compose) {
					throw 'Invalid type. Types must have a compose and transform function';
				}

				this.types[id] = type;
				return this;
			}
		}, {
			key: 'compose',
			value: function compose(left, right) {
				return _compose(this.types, left, right);
			}
		}, {
			key: 'transform',
			value: function transform(left, right) {
				return _transform(this.types, left, right);
			}
		}, {
			key: 'toJSON',
			value: function toJSON(op) {
				return serialization.toJSON(this.types, op);
			}
		}, {
			key: 'fromJSON',
			value: function fromJSON(json) {
				return serialization.fromJSON(this.types, json);
			}
		}]);

		return CombinedType;
	}(OTType);

	module.exports = CombinedType;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var OperationIterator = __webpack_require__(6);
	var CompoundOperation = __webpack_require__(7);
	var ops = __webpack_require__(30);

	function idComparator(a, b) {
		return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
	}

	/**
	 * Compose two operations on a map.
	 */
	module.exports = function (types, left, right) {
		var it1 = new OperationIterator(left, idComparator);
		var it2 = new OperationIterator(right, idComparator);

		var result = [];

		while (it1.hasNext) {
			var op1 = it1.next();

			var handled = false;

			while (it2.hasNext) {
				var op2 = it2.next();

				var compared = idComparator(op1, op2);
				if (compared > 0) {
					/*
	     * Left key is larger than right, so push the right key onto
	     * the result as we can't combine it with anything.
	     */

					result.push(op2);
					continue;
				} else if (compared < 0) {
					/*
	     * Left key is smaller than right, release it back for handling
	     * and try the next left operation.
	     */
					it2.back();
				} else {
					if (op1 instanceof ops.Update && op2 instanceof ops.Update) {

						if (op1.type != op2.type) {
							throw 'Can not compose, operations with id `' + op1.id + '` have different types: ' + op1.type + ' vs ' + op2.type;
						}

						var type = types[op1.type];
						if (!type) {
							throw 'Can not compose, unknown type: ' + op1.type;
						}

						var composed = type.compose(op1.operation, op2.operation);
						it1.replace(new ops.Update(op1.id, op1.type, composed));
					}

					handled = true;
				}
				break;
			}

			if (!handled) {
				result.push(op1);
			}
		}

		while (it2.hasNext) {
			result.push(it2.next());
		}

		result.sort(idComparator);
		return new CompoundOperation(result);
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Update = function () {
		function Update(id, type, operation) {
			_classCallCheck(this, Update);

			this.id = id;
			this.type = type;
			this.operation = operation;
		}

		_createClass(Update, [{
			key: "apply",
			value: function apply(handler) {
				handler.update(this.id, this.type, this.operation);
			}
		}, {
			key: "invert",
			value: function invert() {
				return new Update(this.id, this.type, this.operation.invert());
			}
		}, {
			key: "toString",
			value: function toString() {
				return "Update{id=" + this.id + ", type=" + this.type + ", operation=" + this.operation + "}";
			}
		}]);

		return Update;
	}();

	exports.Update = Update;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var OperationIterator = __webpack_require__(6);
	var CompoundOperation = __webpack_require__(7);
	var ops = __webpack_require__(30);

	function idComparator(a, b) {
		return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
	}

	/**
	 * Main transformation for the combined type. This will sort operations
	 * according to their id and handle them in order. Most of the actual work is
	 * done by the transformation done by the subtypes.
	 */
	module.exports = function (types, left, right) {
		var it1 = new OperationIterator(left, idComparator);
		var it2 = new OperationIterator(right, idComparator);

		var deltaLeft = [];
		var deltaRight = [];

		while (it1.hasNext) {
			var op1 = it1.next();

			var handled = false;

			while (it2.hasNext) {
				var op2 = it2.next();

				var compared = idComparator(op1, op2);
				if (compared > 0) {
					/*
	     * Left key is larger than right, no transformation against
	     * left key to be done. Push right onto delta right.
	     */

					deltaRight.push(op2);
					continue;
				} else if (compared < 0) {
					/*
	     * Left key is less than right, back up right by one and
	     * let left key be added to delta left.
	     */
					it2.back();
				} else {
					if (op1 instanceof ops.Update && op2 instanceof ops.Update) {

						if (op1.type != op2.type) {
							throw 'Can not compose, operations with id `' + op1.id + '` have different types: ' + op1.type + ' vs ' + op2.type;
						}

						var type = types[op1.type];
						if (!type) {
							throw 'Can not compose, unknown type: ' + op1.type;
						}

						var transformed = type.transform(op1.operation, op2.operation);
						deltaLeft.push(new ops.Update(op1.id, op1.type, transformed.left));
						deltaRight.push(new ops.Update(op2.id, op2.type, transformed.right));
					}

					handled = true;
				}

				break;
			}

			if (!handled) {
				deltaLeft.push(op1);
			}
		}

		while (it2.hasNext) {
			deltaRight.push(it2.next());
		}

		deltaLeft.sort(idComparator);
		deltaRight.sort(idComparator);
		return {
			left: new CompoundOperation(deltaLeft),
			right: new CompoundOperation(deltaRight)
		};
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var CompoundOperation = __webpack_require__(7);
	var CombinedDelta = __webpack_require__(33);
	var ops = __webpack_require__(30);

	/**
	 * Turn operations into an array with JSON friendly values.
	 */
	exports.toJSON = function (types, op) {
		var result = [];
		CompoundOperation.asArray(op).forEach(function (subOp) {
			if (subOp instanceof ops.Update) {
				result.push(['update', subOp.id, subOp.type, types[subOp.type].toJSON(subOp.operation)]);
			} else {
				throw new Error('Unsupported operation: ' + subOp);
			}
		});

		return result;
	};

	/**
	 * Turn a JSON value into operations that can be used when composing and
	 * transforming.
	 */
	exports.fromJSON = function (types, json) {
		var delta = new CombinedDelta();

		json.forEach(function (data) {
			switch (data[0]) {
				case 'update':
					delta.update(data[1], data[2], types[data[2]].fromJSON(data[3]));
					break;
				default:
					throw new Error('Unsupported type of operation: ' + data[0]);
			}
		});

		return delta.done();
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CompoundOperation = __webpack_require__(7);
	var ops = __webpack_require__(30);

	var UpdateDelta = function () {
		function UpdateDelta() {
			_classCallCheck(this, UpdateDelta);

			this._ops = [];
		}

		_createClass(UpdateDelta, [{
			key: 'update',
			value: function update(id, type, operation) {
				if (this._ops[id]) {
					throw 'Can not update id `' + id + '` several times';
				}

				this._ops[id] = new ops.Update(id, type, operation);
				return this;
			}
		}, {
			key: 'done',
			value: function done() {
				var result = [];

				for (var key in this._ops) {
					if (!this._ops.hasOwnProperty(key)) continue;

					var value = this._ops[key];
					result.push(value);
				}

				return new CompoundOperation(result);
			}
		}]);

		return UpdateDelta;
	}();

	module.exports = UpdateDelta;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EventEmitter = __webpack_require__(35);

	var SYNCHRONIZED = 0;
	var AWAITING_CONFIRM = 1;
	var AWAITING_CONFIRM_WITH_BUFFER = 2;

	/**
	 * Editor for a operational transformation type. The editor synchronizes
	 * with other editors via an instance of {@link OperationSync}.
	 *
	 * Every editor connected needs to have a unique session id, session ids may
	 * not be reused. The session id is used internally to create tokens that
	 * are used to keep track of what changes are actually remote.
	 */

	var Editor = function () {
		/**
	  * Create a new editor.
	  *
	  * @param id {string}
	  *   unique session id for this editor
	  * @param sync {OperationSync}
	  *   synchronization provider, usually an instance that will send and
	  *   receive {@link TaggedOperation}s from a central server
	  */
		function Editor(sync) {
			_classCallCheck(this, Editor);

			this.type = sync.type;
			this.sync = sync;

			this.lastId = 0;

			this.state = SYNCHRONIZED;
			this.events = new EventEmitter();

			this.composing = null;
			this.composeDepth = 0;
		}

		_createClass(Editor, [{
			key: 'connect',
			value: function connect() {
				var _this = this;

				return this.sync.connect(this.receive.bind(this)).then(function (initial) {
					_this.parentHistoryId = initial.historyId;
					_this.current = initial.operation;
					_this.id = initial.token;

					_this.sync.addEventListener('change', _this.receive.bind(_this));

					return initial.operation;
				});
			}
		}, {
			key: 'close',
			value: function close() {
				this.sync.close();
			}
		}, {
			key: 'performEdit',
			value: function performEdit(callback) {
				this.composeDepth++;
				try {
					return callback();
				} finally {
					if (--this.composeDepth === 0 && this.composing) {
						this.apply(this.composing);
						this.composing = null;
					}
				}
			}
		}, {
			key: 'addEventListener',
			value: function addEventListener(event, listener) {
				this.events.on(event, listener);
			}
		}, {
			key: 'on',
			value: function on(event, listener) {
				return this.addEventListener(event, listener);
			}
		}, {
			key: 'removeEventListener',
			value: function removeEventListener(event, listener) {
				this.events.removeListener(event, listener);
			}
		}, {
			key: 'receive',
			value: function receive(op) {
				switch (this.state) {
					case SYNCHRONIZED:
						this.parentHistoryId = op.historyId;
						this.composeAndTriggerListeners(op.operation);
						break;
					case AWAITING_CONFIRM:
						if (this.lastSent.token === op.token) {
							/*
	       * This is the operation we previously sent, we have already
	       * applied this locally so we can safely switch to a
	       * synchronized sate.
	       */
							this.parentHistoryId = op.historyId;
							this.state = SYNCHRONIZED;
						} else {
							/*
	       * Someone else has edited the document before our own
	       * operation was applied. Transform the incoming operation
	       * over our sent operation.
	       */
							var transformed = this.type.transform(op.operation, this.lastSent.operation);

							/*
	       * We stay in our current state but replace lastSent with
	       * the transformed operation so any other edits can be
	       * safely applied.
	       */
							this.lastSent = {
								historyId: op.historyId,
								token: this.lastSent.token,
								operation: transformed.right
							};

							this.parentHistoryId = op.historyId;
							this.composeAndTriggerListeners(transformed.left);
						}
						break;
					case AWAITING_CONFIRM_WITH_BUFFER:
						if (this.lastSent.token === op.token) {
							/*
	       * This is the operation we previously sent, so request
	       * that we send our buffer and switch to awaiting confirm.
	       */
							this.parentHistoryId = op.historyId;
							this.state = AWAITING_CONFIRM;

							this.lastSent = {
								historyId: op.historyId,
								token: this.buffer.token,
								operation: this.buffer.operation
							};
							this.sync.send(this.lastSent);
						} else {
							/*
	       * Someone else has edited the document, rewrite both the
	       * incoming and our buffered operation.
	       */

							var _transformed = this.type.transform(op.operation, this.lastSent.operation);

							/*
	       * As for awaiting confirm, we replace lastSent with a
	       * transformed operation
	       */
							this.lastSent = {
								historyId: op.historyId,
								token: this.lastSent.token,
								operation: _transformed.right
							};

							/*
	       * Transform the already transformed remote operation over
	       * our buffer.
	       */
							_transformed = this.type.transform(this.buffer.operation, _transformed.left);

							this.buffer = {
								historyId: op.historyId,
								token: this.buffer.token,
								operation: _transformed.left
							};

							this.parentHistoryId = op.historyId;
							this.composeAndTriggerListeners(_transformed.right);
						}
						break;
					default:
						throw 'Unknown state: ' + this.state;
				}
			}

			/**
	   * Indicate that a local edit has been made and apply it to this editor,
	   * synchroizing it with other editors.
	   */

		}, {
			key: 'apply',
			value: function apply(op) {
				if (typeof this.parentHistoryId === 'undefined') {
					throw 'Editor has not been connected';
				}

				if (this.composeDepth > 0) {
					// Current composing several edits, just compose without sending
					if (this.composing) {
						this.composing = this.type.compose(this.composing, op);
					} else {
						this.composing = op;
					}

					return;
				}

				// Compose together with the current operation
				this.current = this.type.compose(this.current, op);

				var tagged = void 0;
				switch (this.state) {
					case SYNCHRONIZED:
						/*
	      * Create a tagged version with a unique token and start
	      * tracking when it is applied.
	      */
						tagged = {
							historyId: this.parentHistoryId,
							token: this.id + '-' + this.lastId++,
							operation: op
						};

						this.state = AWAITING_CONFIRM;
						this.lastSent = tagged;
						this.sync.send(tagged);
						break;
					case AWAITING_CONFIRM:
						/*
	      * We are already waiting for another operation to be applied,
	      * buffer this one.
	      */
						tagged = {
							historyId: this.parentHistoryId,
							token: this.id + '-' + this.lastId++,
							operation: op
						};

						this.state = AWAITING_CONFIRM_WITH_BUFFER;
						this.buffer = tagged;
						break;
					case AWAITING_CONFIRM_WITH_BUFFER:
						/*
	      * We have something buffered, compose the buffer together
	      * with this edit.
	      */
						this.buffer.operation = this.type.compose(this.buffer.operation, op);
						break;
					default:
						throw 'Unknown state: ' + this.state;
				}

				this.events.emit('change', {
					operation: op,
					local: true
				});
			}
		}, {
			key: 'composeAndTriggerListeners',
			value: function composeAndTriggerListeners(op) {
				this.current = this.type.compose(this.current, op);
				this.events.emit('change', {
					operation: op,
					local: false
				});
			}
		}]);

		return Editor;
	}();

	Editor.SYNCHRONIZED = SYNCHRONIZED;
	Editor.AWAITING_CONFIRM = AWAITING_CONFIRM;
	Editor.AWAITING_CONFIRM_WITH_BUFFER = AWAITING_CONFIRM_WITH_BUFFER;

	module.exports = Editor;

/***/ },
/* 35 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var locallock = __webpack_require__(37);
	var TaggedOperation = __webpack_require__(40);

	/**
	 * Helper for keeping several editors in sync.
	 */

	var EditorControl = function () {
		/**
	  * Create a new editor control using the specified history storage.
	  *
	  * @param history
	  *   the history implementation to use for storing information
	  * @param [lock]
	  *   optional lock function, see {@link LocalLock} for details about
	  *   how to implement locks.
	  * @param [idGenerator]
	  *   optional function that returns a unique session id. The default
	  *   function uses the current timestamp and a random number as the
	  *   id.
	  */
		function EditorControl(history, lock, idGenerator) {
			_classCallCheck(this, EditorControl);

			this.history = history;
			this.type = history.type;

			this.lock = lock || locallock();
			this.idGenerator = idGenerator || function () {
				var now = Date.now();
				var random = Math.floor(Math.random() * 50000);

				return now.toString(36) + '-' + random.toString(36);
			};
		}

		/**
	  * Get the operation that describes the document that a new client should
	  * start with.
	  *
	  * @return {Promise}
	  *   Promise that will resolve to the latest tagged operation.
	  */


		_createClass(EditorControl, [{
			key: 'latest',
			value: function latest() {
				var _this = this;

				return this.history.latest().then(function (id) {
					return _this.history.until(id + 1).then(function (items) {
						var sessionId = _this.idGenerator();

						var composer = _this.history.type.newComposer();
						items.forEach(function (item) {
							composer.add(item);
						});

						var composed = composer.done();
						return new TaggedOperation(id, sessionId, composed);
					});
				});
			}

			/**
	   * Store a new operation taking information from the given
	   * {@link TaggedOperation} to determine the history id the change occured
	   * on.
	   *
	   * @return {Promise}
	   *   Promise that will resolve to a tagged operation that is suitable
	   *   for applying to other editors.
	   */

		}, {
			key: 'store',
			value: function store(historyId, token, op) {
				var _this2 = this;

				return this.lock(function (done) {
					/*
	     * While holding the lock, compose everything that other editors
	     * have done after the given history id. Then transform the result
	     * over this before storing and then finally resolving the promise.
	     */
					var toStore = void 0;
					_this2.history.from(historyId + 1).then(function (items) {
						var type = _this2.history.type;

						var composer = type.newComposer();
						items.forEach(function (item) {
							composer.add(item);
						});
						var composed = composer.done();

						if (composed) {
							var transformed = type.transform(composed, op);
							toStore = transformed.right;
						} else {
							toStore = op;
						}

						return _this2.history.store(toStore);
					}).then(function (historyId) {
						done(null, new TaggedOperation(historyId, token, toStore));
					}).catch(function (err) {
						return done(err);
					});
				});
			}
		}]);

		return EditorControl;
	}();

	module.exports = EditorControl;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var doLater = typeof setImmediate === 'undefined' ? setTimeout : setImmediate;

	/**
	 * This is an implementation of a lock that queues up requests to acquire
	 * the lock.
	 */

	var LocalLock = function () {
		function LocalLock() {
			_classCallCheck(this, LocalLock);

			this.queue = [];
			this.acquired = false;
		}

		_createClass(LocalLock, [{
			key: 'acquire',
			value: function acquire(cb) {
				var _this = this;

				return new Promise(function (resolve, reject) {
					if (_this.acquired) {
						_this.queue.push({
							callback: cb,
							resolve: resolve,
							reject: reject
						});
						return;
					}

					_this.acquired = true;

					cb(_this._createdDoneCallback(resolve, reject));
				});
			}
		}, {
			key: '_createdDoneCallback',
			value: function _createdDoneCallback(resolve, reject) {
				var _this2 = this;

				var used = false;
				return function (err, result) {
					if (used) return;

					if (err !== null) {
						reject(err);
					} else {
						resolve(result);
					}

					used = true;
					if (_this2.queue.length === 0) {
						_this2.acquired = false;
					} else {
						(function () {
							var next = _this2._queue[0];
							_this2.queue.splice(0, 1);

							doLater(function () {
								var done = this._createdDoneCallback(next.resolve, next.reject);
								next.callback(done);
							});
						})();
					}
				};
			}
		}]);

		return LocalLock;
	}();

	module.exports = function () {
		var lock = new LocalLock();

		return function (cb) {
			return lock.acquire(cb);
		};
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(38).setImmediate))

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(39).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(38).setImmediate, __webpack_require__(38).clearImmediate))

/***/ },
/* 39 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	(function () {
	    try {
	        cachedSetTimeout = setTimeout;
	    } catch (e) {
	        cachedSetTimeout = function () {
	            throw new Error('setTimeout is not defined');
	        }
	    }
	    try {
	        cachedClearTimeout = clearTimeout;
	    } catch (e) {
	        cachedClearTimeout = function () {
	            throw new Error('clearTimeout is not defined');
	        }
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        return setTimeout(fun, 0);
	    } else {
	        return cachedSetTimeout.call(null, fun, 0);
	    }
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        clearTimeout(marker);
	    } else {
	        cachedClearTimeout.call(null, marker);
	    }
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 40 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Extended information about an operation to help with synchronizing changes.
	 */

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TaggedOperation = function TaggedOperation(historyId, token, operation) {
		_classCallCheck(this, TaggedOperation);

		this.historyId = historyId;
		this.token = token;
		this.operation = operation;
	};

	module.exports = TaggedOperation;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EventEmitter = __webpack_require__(35);

	/*
	 * Synchronization between editor instances. Usually by syncing with a
	 * central server of some sort.
	 *
	 * Instances of this uses events to notify editors about changes. The main
	 * event is `change` with a single @{link TaggedOperation} as its argument.
	 *
	 * Once connected a sync *must* emit all changes that occur after the returned
	 * initial operation. The sync *must* emit these changes in order.
	 *
	 * @abstract
	 */

	var OperationSync = function () {
		function OperationSync(type) {
			_classCallCheck(this, OperationSync);

			if (!type) throw new Error('OperationSync needs access to the OTType');

			this.type = type;
			this.events = new EventEmitter();
		}

		/**
	  * Add an event listener to this sync.
	  */


		_createClass(OperationSync, [{
			key: 'on',
			value: function on(event, listener) {
				return this.addEventListener(event, listener);
			}

			/**
	   * Add an event listener to this sync.
	   */

		}, {
			key: 'addEventListener',
			value: function addEventListener(event, listener) {
				this.events.on(event, listener);
			}

			/**
	   * Connect and fetch the latest version of the document/model.
	   *
	   * @returns {TaggedOperation}
	   *   the latest version of the document/model being edited
	   */

		}, {
			key: 'connect',
			value: function connect() {
				throw 'Not implemented';
			}

			/**
	   * Send an edit to other editors.
	  	 * @param {TaggedOperation} op
	   */

		}, {
			key: 'send',
			value: function send(op) {
				throw 'Not implemented';
			}

			/**
	   * Close this sync.
	   */

		}, {
			key: 'close',
			value: function close() {}
		}], [{
			key: 'local',
			value: function local(control) {
				return new LocalSync(control);
			}
		}]);

		return OperationSync;
	}();

	var doLater = typeof setImmediate === 'undefined' ? setTimeout : setImmediate;

	/**
	 * A sync that works locally, useful for testing.
	 */

	var LocalSync = function (_OperationSync) {
		_inherits(LocalSync, _OperationSync);

		function LocalSync(control) {
			_classCallCheck(this, LocalSync);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LocalSync).call(this, control.type));

			_this.control = control;
			_this.queue = [];
			_this.promises = [];
			return _this;
		}

		_createClass(LocalSync, [{
			key: 'connect',
			value: function connect() {
				return this.control.latest();
			}
		}, {
			key: 'send',
			value: function send(op) {
				this.queue.push(op);

				this.flush();
			}
		}, {
			key: 'suspend',
			value: function suspend() {
				this.suspended = true;
			}
		}, {
			key: 'resume',
			value: function resume() {
				this.suspended = false;

				this.flush();
			}
		}, {
			key: 'flush',
			value: function flush() {
				var _this2 = this;

				if (this.suspended) return;

				doLater(function () {
					var promise = Promise.resolve(true);
					_this2.queue.forEach(function (op) {
						promise = promise.then(function () {
							return _this2.control.store(op.historyId, op.token, op.operation).then(function (transformed) {
								_this2.events.emit('change', transformed);
							});
						});
					});

					_this2.queue.length = 0;

					promise.then(function () {
						// Extra check to ensure that nothing new has been queued
						if (_this2.queue.length !== 0) return;

						doLater(function () {
							_this2.promises.forEach(function (promise) {
								promise.resolve();
							});

							_this2.promises.length = 0;
						});
					}).catch(function (e) {
						console.log('Error occured during flush', e.stack || e);
					});
				});
			}
		}, {
			key: 'waitForEmpty',
			value: function waitForEmpty() {
				var _this3 = this;

				return new Promise(function (resolve, reject) {
					if (_this3.queue.length === 0) {
						resolve();
					} else {
						_this3.promises.push({
							resolve: resolve,
							reject: reject
						});
					}
				});
			}
		}]);

		return LocalSync;
	}(OperationSync);

	module.exports = OperationSync;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(38).setImmediate))

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var OperationSync = __webpack_require__(41);
	var TaggedOperation = __webpack_require__(40);

	var SocketIoSync = function (_OperationSync) {
		_inherits(SocketIoSync, _OperationSync);

		function SocketIoSync(type, socket, editableId) {
			_classCallCheck(this, SocketIoSync);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SocketIoSync).call(this, type));

			_this.socket = socket;
			_this.editableId = editableId;
			return _this;
		}

		_createClass(SocketIoSync, [{
			key: 'connect',
			value: function connect() {
				var _this2 = this;

				return new Promise(function (resolve, reject) {
					// Start listening for changes to the editable
					_this2.socket.on('change editable', function (data) {
						if (data.editable !== _this2.editableId) return;

						// Pass the operation to the connected editor
						_this2.events.emit('change', new TaggedOperation(data.historyId, data.token, _this2.type.fromJSON(data.operation)));
					});

					_this2.socket.on('load editable', function (data) {
						if (data.editable !== _this2.editableId) return;

						// Resolve the promise with the initial editable
						resolve(new TaggedOperation(data.historyId, data.token, _this2.type.fromJSON(data.operation)));
					});

					// When Socket.io connects send a request to load our editable
					_this2.socket.emit('load editable', {
						editable: _this2.editableId
					});
				});
			}
		}, {
			key: 'send',
			value: function send(op) {
				this.socket.emit('change editable', {
					editable: this.editableId,
					historyId: op.historyId,
					token: op.token,
					operation: this.type.toJSON(op.operation)
				});
			}
		}, {
			key: 'close',
			value: function close() {
				this.socket.emit('close editable', {
					editable: this.editableId
				});
			}
		}]);

		return SocketIoSync;
	}(OperationSync);

	module.exports = SocketIoSync;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EventEmitter = __webpack_require__(35);
	var events = __webpack_require__(44);

	var SharedMap = __webpack_require__(45);
	var SharedList = __webpack_require__(48);
	var SharedString = __webpack_require__(49);

	var CompoundOperation = __webpack_require__(7);
	var combined = __webpack_require__(27);

	var Model = function () {
		function Model(editor) {
			var _this = this;

			_classCallCheck(this, Model);

			this.editor = editor;
			this.type = editor.type;

			this._lastObjectId = 0;

			this.factories = {};

			this.editors = {};
			this.values = {};
			this.objects = {};

			this.events = new EventEmitter();

			editor.addEventListener('change', function (change) {
				if (!change.local) {
					change.operation.apply(_this._changeHandler);
				}

				_this.events.emit('change', change);
			});

			this._changeHandler = {
				update: function update(id, type, change) {
					if (typeof _this.values[id] !== 'undefined') {
						var current = _this.values[id];
						var composed = _this.type.types[type].compose(current, change);

						_this.values[id] = composed;

						var _editor = _this.editors[id];
						_this.remote = true;
						_editor.apply({
							operation: change,
							local: false,
							remote: true
						});
					} else {
						_this.values[id] = change;

						var object = _this._createObject(id, type);
						_this.objects[id] = object;
					}
				}
			};

			this.registerType('map', function (e) {
				return new SharedMap(e);
			});
			this.registerType('list', function (e) {
				return new SharedList(e);
			});
			this.registerType('string', function (e) {
				return new SharedString(e);
			});

			this.root = this._getObject('root', 'map');
			this.root.on('valueChanged', function (data) {
				return _this.events.emit('valueChanged', data);
			});
			this.root.on('valueRemoved', function (data) {
				return _this.events.emit('valueRemove', data);
			});
		}

		_createClass(Model, [{
			key: 'registerType',
			value: function registerType(type, factory) {
				this.factories[type] = factory;
				return this;
			}
		}, {
			key: 'newMap',
			value: function newMap() {
				return this.newObject('map');
			}
		}, {
			key: 'newList',
			value: function newList() {
				return this.newObject('list');
			}
		}, {
			key: 'newString',
			value: function newString() {
				return this.newObject('string');
			}
		}, {
			key: 'newObject',
			value: function newObject(type) {
				var objectId = this.editor.id + '-' + this._lastObjectId++;
				return this._getObject(objectId, type);
			}
		}, {
			key: 'open',
			value: function open() {
				var _this2 = this;

				return this.editor.connect().then(function (initial) {
					return initial.apply(_this2._changeHandler);
				});
			}
		}, {
			key: 'close',
			value: function close() {
				this.editor.close();
			}
		}, {
			key: 'performEdit',
			value: function performEdit(callback) {
				this.editor.performEdit(callback);
			}
		}, {
			key: '_apply',
			value: function _apply(id, type, op) {
				// Compose together with the current value for the object
				if (typeof this.values[id] !== 'undefined') {
					var current = this.values[id];
					var composed = this.type.types[type].compose(current, op);

					this.values[id] = composed;
				} else {
					this.values[id] = op;
				}

				// Ask the object to apply the operation as a local one
				var editor = this.editors[id];
				if (editor) {
					this.remote = false;
					editor.apply({
						operation: op,
						local: true,
						remote: false
					});

					editor.queueEvent('change', op);
				}

				// Ask the editor to apply the operation and sync it with other editors
				this.editor.apply(combined.delta().update(id, type, op).done());
			}
		}, {
			key: 'getObject',
			value: function getObject(id) {
				var object = this.objects[id];
				return object || null;
			}
		}, {
			key: '_queueEvent',
			value: function _queueEvent(id, type, data) {
				var editor = this.editors[id];
				editor.events.emit(type, new events.Event(this.remote, data));
			}
		}, {
			key: '_getObject',
			value: function _getObject(id, type) {
				var object = this.objects[id];
				if (typeof object !== 'undefined') return object;

				this.values[id] = new CompoundOperation([]);
				object = this._createObject(id, type);
				this.objects[id] = object;

				return object;
			}
		}, {
			key: '_createObject',
			value: function _createObject(id, type) {
				var editor = this._createEditor(id, type);
				this.editors[id] = editor;
				return this.factories[type](editor);
			}
		}, {
			key: '_createEditor',
			value: function _createEditor(id, type) {
				var self = this;
				return {
					objectId: id,
					objectType: type,

					events: new EventEmitter(),

					model: self,

					getObject: function getObject(id, type) {
						return self._getObject(id, type);
					},
					queueEvent: function queueEvent(type, data) {
						self._queueEvent(id, type, data);
					},


					get current() {
						return self.values[this.objectId];
					},

					send: function send(op) {
						self._apply(this.objectId, this.objectType, op);
					},
					apply: function apply(op, local) {
						throw new Error('No hook for applying data registered');
					}
				};
			}
		}, {
			key: 'containsKey',
			value: function containsKey(key) {
				return this.root.containsKey(key);
			}
		}, {
			key: 'get',
			value: function get(key, factory) {
				return this.root.get(key, factory);
			}
		}, {
			key: 'remove',
			value: function remove(key) {
				return this.root.remove(key);
			}
		}, {
			key: 'set',
			value: function set(key, value) {
				return this.root.set(key, value);
			}
		}, {
			key: 'addEventListener',
			value: function addEventListener(event, listener) {
				return this.events.on(event, listener);
			}
		}, {
			key: 'on',
			value: function on(event, listener) {
				return this.events.on(event, listener);
			}
		}, {
			key: 'removeEventListener',
			value: function removeEventListener(event, listener) {
				this.events.removeListener(event, listener);
			}
		}], [{
			key: 'defaultType',
			value: function defaultType() {
				return combined.newType();
			}
		}]);

		return Model;
	}();

	module.exports = Model;

/***/ },
/* 44 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Base for events that are triggered. Keeps track of the source of an event
	 * via the remote/local property.
	 */

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Event = function Event(remote, data) {
		var _this = this;

		_classCallCheck(this, Event);

		this.remote = remote;
		this.local = !remote;

		Object.keys(data).forEach(function (k) {
			return _this[k] = data[k];
		});
	};

	exports.Event = Event;
	exports.VALUE_CHANGED = 'valueChanged';
	exports.VALUE_REMOVED = 'valueRemoved';

	exports.INSERT = 'insert';
	exports.DELETE = 'delete';

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SharedObject = __webpack_require__(46);
	var map = __webpack_require__(1);
	var dataValues = __webpack_require__(47);

	var SharedMap = function (_SharedObject) {
		_inherits(SharedMap, _SharedObject);

		function SharedMap(editor) {
			_classCallCheck(this, SharedMap);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SharedMap).call(this, editor));

			_this.values = {};

			_this._apply({
				operation: editor.current
			});
			editor.apply = _this._apply.bind(_this);
			return _this;
		}

		_createClass(SharedMap, [{
			key: '_apply',
			value: function _apply(data) {
				var _this2 = this;

				data.operation.apply({
					remove: function remove(id, oldValue) {
						var old = _this2.values[id];
						delete _this2.values[id];

						_this2.editor.queueEvent('valueRemoved', {
							key: id,
							oldValue: old
						});
					},

					set: function set(id, oldValue, newValue) {
						var value = dataValues.fromData(_this2.editor, newValue);
						var old = _this2.values[id];
						_this2.values[id] = value;

						_this2.editor.queueEvent('valueChanged', {
							key: id,
							oldValue: old,
							newValue: value
						});
					}
				});
			}
		}, {
			key: 'containsKey',
			value: function containsKey(key) {
				return typeof this.values[key] !== 'undefined';
			}
		}, {
			key: 'get',
			value: function get(key, factory) {
				var _this3 = this;

				var value = this.values[key];
				if (value) return value;

				if (factory) {
					(function () {
						var model = _this3.editor.model;
						model.performEdit(function () {
							value = _this3.values[key] = factory(model);

							_this3.editor.send(map.delta().set(key, dataValues.toData(null), dataValues.toData(value)).done());
						});
					})();
				}

				return value || null;
			}
		}, {
			key: 'remove',
			value: function remove(key) {
				var old = this.values[key];
				if (typeof old !== 'undefined') {
					this.editor.send(map.delta().set(key, dataValues.toData(null)));
				}
			}
		}, {
			key: 'set',
			value: function set(key, value) {
				if (value === null || typeof value === 'undefined') {
					throw 'Value must not be null or undefined';
				}

				var old = this.values[key];
				this.editor.send(map.delta().set(key, dataValues.toData(old), dataValues.toData(value)).done());
			}
		}]);

		return SharedMap;
	}(SharedObject);

	module.exports = SharedMap;

/***/ },
/* 46 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SharedObject = function () {
		function SharedObject(editor) {
			_classCallCheck(this, SharedObject);

			this.editor = editor;
		}

		_createClass(SharedObject, [{
			key: 'addEventListener',
			value: function addEventListener(event, listener) {
				return this.on(event, listener);
			}
		}, {
			key: 'on',
			value: function on(event, listener) {
				this.editor.events.on(event, listener);
				return this;
			}
		}, {
			key: 'removeEventListener',
			value: function removeEventListener(event, listener) {
				return this.editor.events.removeListener(event, listener);
			}
		}, {
			key: 'objectId',
			get: function get() {
				return this.editor.objectId;
			}
		}, {
			key: 'objectType',
			get: function get() {
				return this.editor.objectType;
			}
		}]);

		return SharedObject;
	}();

	module.exports = SharedObject;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SharedObject = __webpack_require__(46);

	/**
	 * Convert from a data value into a value usable in the model API.
	 */
	exports.fromData = function (editor, data) {
		if (typeof data === 'undefined') return null;

		var type = data[0];
		switch (type) {
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
	exports.toData = function (value) {
		if (typeof value === 'undefined') return null;

		if (value instanceof SharedObject) {
			return ['ref', value.objectId, value.objectType];
		} else {
			return ['value', value];
		}
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SharedObject = __webpack_require__(46);
	var list = __webpack_require__(12);
	var dataValues = __webpack_require__(47);

	var isInteger = Number.isInteger || function (value) {
		return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
	};

	var SharedList = function (_SharedObject) {
		_inherits(SharedList, _SharedObject);

		function SharedList(editor) {
			_classCallCheck(this, SharedList);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SharedList).call(this, editor));

			_this.items = [];
			var self = _this;
			editor.current.apply({
				retain: function retain(count) {
					throw new Error('Invalid current value, must only contain inserts');
				},
				delete: function _delete(value) {
					throw new Error('Invalid current value, must only contain inserts');
				},
				insert: function insert(values) {
					values.forEach(function (v) {
						self.items.push(dataValues.fromData(editor, v));
					});
				}
			});

			editor.apply = _this._apply.bind(_this);
			return _this;
		}

		/**
	  * Apply an operation to this list. This will mutate the value
	  *
	  * @protected
	  */


		_createClass(SharedList, [{
			key: '_apply',
			value: function _apply(data) {
				var self = this;
				var index = 0;
				data.operation.apply({
					retain: function retain(count) {
						index += count;
					},
					insert: function insert(values) {
						var newValues = values.map(function (v) {
							return dataValues.fromData(self.editor, v);
						});
						Array.prototype.splice.apply(self.items, [index, 0].concat(newValues));

						var fromIndex = index;
						index += values.length;

						self.editor.queueEvent('valuesInserted', {
							index: fromIndex,
							values: newValues
						});
					},
					delete: function _delete(values) {
						var oldValues = self.items.splice(index, values.length);

						self.editor.queueEvent('valuesRemoved', {
							index: index,
							values: oldValues
						});
					}
				});
			}
		}, {
			key: 'get',
			value: function get(index) {
				return this.items[index];
			}
		}, {
			key: 'indexOf',
			value: function indexOf(object) {
				for (var i = 0; i < this.items.length; i++) {
					if (this.items[i] === object) return i;
				}

				return -1;
			}
		}, {
			key: 'clear',
			value: function clear() {
				var delta = list.delta();

				this.items.forEach(function (item) {
					return delta.delete(dataValues.toData(item));
				});

				this.editor.send(delta.done());
			}
		}, {
			key: 'add',
			value: function add(item) {
				this.editor.send(list.delta().retain(this.items.length).insert(dataValues.toData(item)).done());
			}
		}, {
			key: 'addAll',
			value: function addAll(items) {
				var delta = list.delta().retain(this.items.length);

				items.forEach(function (item) {
					return delta.insert(dataValues.toData(item));
				});

				this.editor.send(delta.done());
			}
		}, {
			key: 'insert',
			value: function insert(index, item) {
				if (!isInteger(index)) {
					throw new Error('Index must be an integer, was: ' + index);
				}

				if (index > this.items.length) {
					throw new Error('Can not insert at ' + index + ', only ' + this.items.length + ' items in list');
				}
				if (index < 0) {
					throw new Error('Can not insert at ' + index + ', index must not be negative');
				}

				var length = this.items.length;
				this.editor.send(list.delta().retain(index).insert(dataValues.toData(item)).retain(length - index).done());
			}
		}, {
			key: 'insertAll',
			value: function insertAll(index, items) {
				var length = this.items.length;

				if (!isInteger(index)) {
					throw new Error('Index must be an integer, was: ' + index);
				}

				if (index > this.items.length) {
					throw new Error('Can not insert at ' + index + ', only ' + this.items.length + ' items in list');
				}
				if (index < 0) {
					throw new Error('Can not insert at ' + index + ', index must not be negative');
				}

				var delta = list.delta().retain(index);

				items.forEach(function (item) {
					return delta.insert(dataValues.toData(item));
				});

				delta.retain(length - index);
				this.editor.send(delta.done());
			}
		}, {
			key: 'remove',
			value: function remove(index) {
				var length = this.items.length;

				if (!isInteger(index)) {
					throw new Error('Index must be an integer, was: ' + index);
				}

				if (index >= length) {
					throw new Error('Can not remove at ' + index + ', only ' + this.items.length + ' items in list');
				}
				if (index < 0) {
					throw new Error('Can not remove at ' + index + ', index must not be negative');
				}

				this.editor.send(list.delta().retain(index).delete(dataValues.toData(this.items[index])).retain(length - index - 1).done());
			}
		}, {
			key: 'removeRange',
			value: function removeRange(fromIndex, toIndex) {
				if (!isInteger(fromIndex)) {
					throw new Error('fromIndex must be an integer, was: ' + fromIndex);
				}

				if (fromIndex < 0 || fromIndex > this.items.length) {
					throw new Error('fromIndex must be between 0 and ' + (this.items.length - 1) + ', but was ' + fromIndex);
				}

				if (!isInteger(toIndex)) {
					throw new Error('toIndex must be an integer, was: ' + toIndex);
				}

				if (toIndex < 0 || toIndex >= this.items.length) {
					throw new Error('toIndex must be between 0 and ' + this.items.length + ', but was ' + toIndex);
				}

				var length = this.items.length;
				var delta = list.delta().retain(fromIndex);

				for (var i = fromIndex; i < toIndex; i++) {
					delta.delete(dataValues.toData(this.items[i]));
				}

				var diff = toIndex - fromIndex;
				delta.retain(length - fromIndex - diff);

				this.editor.send(delta.done());
			}
		}, {
			key: 'removeObject',
			value: function removeObject(obj) {
				var idx = this.indexOf(obj);
				if (idx < 0) return;

				this.remove(idx);
			}
		}, {
			key: 'set',
			value: function set(index, value) {
				if (!isInteger(index)) {
					throw new Error('Index must be an integer, was: ' + index);
				}

				var length = this.items.length;
				if (index > length) {
					throw new Error('Can not set at ' + index + ', only ' + length + ' items in list');
				}
				if (index < 0) {
					throw new Error('Can not set at ' + index + ', index must not be negative');
				}

				this.editor.send(list.delta().retain(index).insert(dataValues.toData(value)).delete(dataValues.toData(this.items[index])).retain(length - index - 1).done());
			}
		}, {
			key: 'asArray',
			value: function asArray() {
				return this.items.slice(0);
			}
		}, {
			key: 'length',
			get: function get() {
				return this.items.length;
			}
		}]);

		return SharedList;
	}(SharedObject);

	module.exports = SharedList;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var diff = __webpack_require__(50);

	var SharedObject = __webpack_require__(46);
	var string = __webpack_require__(19);

	var SharedString = function (_SharedObject) {
		_inherits(SharedString, _SharedObject);

		function SharedString(editor) {
			_classCallCheck(this, SharedString);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SharedString).call(this, editor));

			_this.value = '';
			var self = _this;
			editor.current.apply({
				retain: function retain(count) {
					throw new Error('Invalid current value, must only contain inserts');
				},
				delete: function _delete(value) {
					throw new Error('Invalid current value, must only contain inserts');
				},
				insert: function insert(value) {
					self.value += value;
				}
			});

			editor.apply = _this._apply.bind(_this);
			return _this;
		}

		/**
	  * Apply an operation to this string. This will mutate the value and
	  * trigger listeners while doing so.
	  *
	  * @protected
	  */


		_createClass(SharedString, [{
			key: '_apply',
			value: function _apply(data) {
				var self = this;
				var index = 0;
				data.operation.apply({
					retain: function retain(count) {
						index += count;
					},
					insert: function insert(value) {
						self.value = self.value.substr(0, index) + value + self.value.substr(index);

						var from = index;
						index += value.length;

						self.editor.queueEvent('insert', {
							index: from,
							value: value
						});
					},
					delete: function _delete(value) {
						self.value = self.value.substr(0, index) + self.value.substr(index + value.length);

						self.editor.queueEvent('delete', {
							index: index,
							fromIndex: index,
							toIndex: index + value.length,

							value: value
						});
					}
				});
			}

			/**
	   * Get the current value of this string. If this method is called during
	   * a change event it will return the value of the string as if the
	   * change has been applied.
	   *
	   * @return
	   *   the current value
	   */

		}, {
			key: 'get',
			value: function get() {
				return this.value;
			}

			/**
	   * Set the value of this string. This will automatically diff the new
	   * value against the previous value just send the changes.
	   */

		}, {
			key: 'set',
			value: function set(value) {
				if (this.value === value) return;

				var delta = string.delta();
				var index = 0;
				diff(this.value, value).forEach(function (d) {
					switch (d[0]) {
						case diff.EQUAL:
							delta.retain(d[1].length);
							break;
						case diff.INSERT:
							delta.insert(d[1]);

							break;
						case diff.DELETE:
							delta.delete(d[1]);
							break;
					}
				});

				this.editor.send(delta.done());
			}

			/**
	   * Append something to this string.
	   */

		}, {
			key: 'append',
			value: function append(value) {
				var length = this.value.length;
				this.editor.send(string.delta().retain(length).insert(value).done());
			}

			/**
	   * Insert text at the specified index in this string.
	   *
	   * @param {number} index
	   *   the zero-based index to insert text at
	   * @param {string} value
	   *   the value to insert
	   */

		}, {
			key: 'insert',
			value: function insert(index, value) {
				var length = this.value.length;

				if (index <= 0) {
					throw new Error('index must be more than or equal to 0');
				}

				if (index > length) {
					throw new Error('index must not be more than the length of the current value');
				}

				this.editor.send(string.delta().retain(index).insert(value).retain(length - index).done());
			}

			/**
	   * Remove text between the two indexes.
	   *
	   * @param {number} fromIndex
	   *   the index to start removing at (inclusive)
	   * @param {number} toIndex
	   *   the index to stop removing at (exclusive)
	   */

		}, {
			key: 'remove',
			value: function remove(fromIndex, toIndex) {
				if (fromIndex <= 0) {
					throw new Error('fromIndex must be more than or equal to 0');
				}

				var length = this.value.length();
				if (toIndex > length) {
					throw new Error('toIndex must not be more than the length of the current value');
				}

				if (toIndex <= fromIndex) {
					throw new Error('toIndex must be more than fromIndex');
				}

				var deleted = this.value.substring(fromIndex, toIndex);
				this.editor.send(string.delta().retain(fromIndex).delete(deleted).retain(length - toIndex).done());
			}
		}]);

		return SharedString;
	}(SharedObject);

	module.exports = SharedString;

/***/ },
/* 50 */
/***/ function(module, exports) {

	/**
	 * This library modifies the diff-patch-match library by Neil Fraser
	 * by removing the patch and match functionality and certain advanced
	 * options in the diff function. The original license is as follows:
	 *
	 * ===
	 *
	 * Diff Match and Patch
	 *
	 * Copyright 2006 Google Inc.
	 * http://code.google.com/p/google-diff-match-patch/
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */


	/**
	 * The data structure representing a diff is an array of tuples:
	 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
	 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
	 */
	var DIFF_DELETE = -1;
	var DIFF_INSERT = 1;
	var DIFF_EQUAL = 0;


	/**
	 * Find the differences between two texts.  Simplifies the problem by stripping
	 * any common prefix or suffix off the texts before diffing.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @return {Array} Array of diff tuples.
	 */
	function diff_main(text1, text2) {
	  // Check for equality (speedup).
	  if (text1 == text2) {
	    if (text1) {
	      return [[DIFF_EQUAL, text1]];
	    }
	    return [];
	  }

	  // Trim off common prefix (speedup).
	  var commonlength = diff_commonPrefix(text1, text2);
	  var commonprefix = text1.substring(0, commonlength);
	  text1 = text1.substring(commonlength);
	  text2 = text2.substring(commonlength);

	  // Trim off common suffix (speedup).
	  commonlength = diff_commonSuffix(text1, text2);
	  var commonsuffix = text1.substring(text1.length - commonlength);
	  text1 = text1.substring(0, text1.length - commonlength);
	  text2 = text2.substring(0, text2.length - commonlength);

	  // Compute the diff on the middle block.
	  var diffs = diff_compute_(text1, text2);

	  // Restore the prefix and suffix.
	  if (commonprefix) {
	    diffs.unshift([DIFF_EQUAL, commonprefix]);
	  }
	  if (commonsuffix) {
	    diffs.push([DIFF_EQUAL, commonsuffix]);
	  }
	  diff_cleanupMerge(diffs);
	  return diffs;
	};


	/**
	 * Find the differences between two texts.  Assumes that the texts do not
	 * have any common prefix or suffix.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @return {Array} Array of diff tuples.
	 */
	function diff_compute_(text1, text2) {
	  var diffs;

	  if (!text1) {
	    // Just add some text (speedup).
	    return [[DIFF_INSERT, text2]];
	  }

	  if (!text2) {
	    // Just delete some text (speedup).
	    return [[DIFF_DELETE, text1]];
	  }

	  var longtext = text1.length > text2.length ? text1 : text2;
	  var shorttext = text1.length > text2.length ? text2 : text1;
	  var i = longtext.indexOf(shorttext);
	  if (i != -1) {
	    // Shorter text is inside the longer text (speedup).
	    diffs = [[DIFF_INSERT, longtext.substring(0, i)],
	             [DIFF_EQUAL, shorttext],
	             [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
	    // Swap insertions for deletions if diff is reversed.
	    if (text1.length > text2.length) {
	      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
	    }
	    return diffs;
	  }

	  if (shorttext.length == 1) {
	    // Single character string.
	    // After the previous speedup, the character can't be an equality.
	    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
	  }

	  // Check to see if the problem can be split in two.
	  var hm = diff_halfMatch_(text1, text2);
	  if (hm) {
	    // A half-match was found, sort out the return data.
	    var text1_a = hm[0];
	    var text1_b = hm[1];
	    var text2_a = hm[2];
	    var text2_b = hm[3];
	    var mid_common = hm[4];
	    // Send both pairs off for separate processing.
	    var diffs_a = diff_main(text1_a, text2_a);
	    var diffs_b = diff_main(text1_b, text2_b);
	    // Merge the results.
	    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
	  }

	  return diff_bisect_(text1, text2);
	};


	/**
	 * Find the 'middle snake' of a diff, split the problem in two
	 * and return the recursively constructed diff.
	 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @return {Array} Array of diff tuples.
	 * @private
	 */
	function diff_bisect_(text1, text2) {
	  // Cache the text lengths to prevent multiple calls.
	  var text1_length = text1.length;
	  var text2_length = text2.length;
	  var max_d = Math.ceil((text1_length + text2_length) / 2);
	  var v_offset = max_d;
	  var v_length = 2 * max_d;
	  var v1 = new Array(v_length);
	  var v2 = new Array(v_length);
	  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
	  // integers and undefined.
	  for (var x = 0; x < v_length; x++) {
	    v1[x] = -1;
	    v2[x] = -1;
	  }
	  v1[v_offset + 1] = 0;
	  v2[v_offset + 1] = 0;
	  var delta = text1_length - text2_length;
	  // If the total number of characters is odd, then the front path will collide
	  // with the reverse path.
	  var front = (delta % 2 != 0);
	  // Offsets for start and end of k loop.
	  // Prevents mapping of space beyond the grid.
	  var k1start = 0;
	  var k1end = 0;
	  var k2start = 0;
	  var k2end = 0;
	  for (var d = 0; d < max_d; d++) {
	    // Walk the front path one step.
	    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
	      var k1_offset = v_offset + k1;
	      var x1;
	      if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
	        x1 = v1[k1_offset + 1];
	      } else {
	        x1 = v1[k1_offset - 1] + 1;
	      }
	      var y1 = x1 - k1;
	      while (x1 < text1_length && y1 < text2_length &&
	             text1.charAt(x1) == text2.charAt(y1)) {
	        x1++;
	        y1++;
	      }
	      v1[k1_offset] = x1;
	      if (x1 > text1_length) {
	        // Ran off the right of the graph.
	        k1end += 2;
	      } else if (y1 > text2_length) {
	        // Ran off the bottom of the graph.
	        k1start += 2;
	      } else if (front) {
	        var k2_offset = v_offset + delta - k1;
	        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
	          // Mirror x2 onto top-left coordinate system.
	          var x2 = text1_length - v2[k2_offset];
	          if (x1 >= x2) {
	            // Overlap detected.
	            return diff_bisectSplit_(text1, text2, x1, y1);
	          }
	        }
	      }
	    }

	    // Walk the reverse path one step.
	    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
	      var k2_offset = v_offset + k2;
	      var x2;
	      if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
	        x2 = v2[k2_offset + 1];
	      } else {
	        x2 = v2[k2_offset - 1] + 1;
	      }
	      var y2 = x2 - k2;
	      while (x2 < text1_length && y2 < text2_length &&
	             text1.charAt(text1_length - x2 - 1) ==
	             text2.charAt(text2_length - y2 - 1)) {
	        x2++;
	        y2++;
	      }
	      v2[k2_offset] = x2;
	      if (x2 > text1_length) {
	        // Ran off the left of the graph.
	        k2end += 2;
	      } else if (y2 > text2_length) {
	        // Ran off the top of the graph.
	        k2start += 2;
	      } else if (!front) {
	        var k1_offset = v_offset + delta - k2;
	        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
	          var x1 = v1[k1_offset];
	          var y1 = v_offset + x1 - k1_offset;
	          // Mirror x2 onto top-left coordinate system.
	          x2 = text1_length - x2;
	          if (x1 >= x2) {
	            // Overlap detected.
	            return diff_bisectSplit_(text1, text2, x1, y1);
	          }
	        }
	      }
	    }
	  }
	  // Diff took too long and hit the deadline or
	  // number of diffs equals number of characters, no commonality at all.
	  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
	};


	/**
	 * Given the location of the 'middle snake', split the diff in two parts
	 * and recurse.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {number} x Index of split point in text1.
	 * @param {number} y Index of split point in text2.
	 * @return {Array} Array of diff tuples.
	 */
	function diff_bisectSplit_(text1, text2, x, y) {
	  var text1a = text1.substring(0, x);
	  var text2a = text2.substring(0, y);
	  var text1b = text1.substring(x);
	  var text2b = text2.substring(y);

	  // Compute both diffs serially.
	  var diffs = diff_main(text1a, text2a);
	  var diffsb = diff_main(text1b, text2b);

	  return diffs.concat(diffsb);
	};


	/**
	 * Determine the common prefix of two strings.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the start of each
	 *     string.
	 */
	function diff_commonPrefix(text1, text2) {
	  // Quick check for common null cases.
	  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
	    return 0;
	  }
	  // Binary search.
	  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
	  var pointermin = 0;
	  var pointermax = Math.min(text1.length, text2.length);
	  var pointermid = pointermax;
	  var pointerstart = 0;
	  while (pointermin < pointermid) {
	    if (text1.substring(pointerstart, pointermid) ==
	        text2.substring(pointerstart, pointermid)) {
	      pointermin = pointermid;
	      pointerstart = pointermin;
	    } else {
	      pointermax = pointermid;
	    }
	    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
	  }
	  return pointermid;
	};


	/**
	 * Determine the common suffix of two strings.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the end of each string.
	 */
	function diff_commonSuffix(text1, text2) {
	  // Quick check for common null cases.
	  if (!text1 || !text2 ||
	      text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
	    return 0;
	  }
	  // Binary search.
	  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
	  var pointermin = 0;
	  var pointermax = Math.min(text1.length, text2.length);
	  var pointermid = pointermax;
	  var pointerend = 0;
	  while (pointermin < pointermid) {
	    if (text1.substring(text1.length - pointermid, text1.length - pointerend) ==
	        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
	      pointermin = pointermid;
	      pointerend = pointermin;
	    } else {
	      pointermax = pointermid;
	    }
	    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
	  }
	  return pointermid;
	};


	/**
	 * Do the two texts share a substring which is at least half the length of the
	 * longer text?
	 * This speedup can produce non-minimal diffs.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {Array.<string>} Five element Array, containing the prefix of
	 *     text1, the suffix of text1, the prefix of text2, the suffix of
	 *     text2 and the common middle.  Or null if there was no match.
	 */
	function diff_halfMatch_(text1, text2) {
	  var longtext = text1.length > text2.length ? text1 : text2;
	  var shorttext = text1.length > text2.length ? text2 : text1;
	  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
	    return null;  // Pointless.
	  }

	  /**
	   * Does a substring of shorttext exist within longtext such that the substring
	   * is at least half the length of longtext?
	   * Closure, but does not reference any external variables.
	   * @param {string} longtext Longer string.
	   * @param {string} shorttext Shorter string.
	   * @param {number} i Start index of quarter length substring within longtext.
	   * @return {Array.<string>} Five element Array, containing the prefix of
	   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
	   *     of shorttext and the common middle.  Or null if there was no match.
	   * @private
	   */
	  function diff_halfMatchI_(longtext, shorttext, i) {
	    // Start with a 1/4 length substring at position i as a seed.
	    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
	    var j = -1;
	    var best_common = '';
	    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
	    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
	      var prefixLength = diff_commonPrefix(longtext.substring(i),
	                                           shorttext.substring(j));
	      var suffixLength = diff_commonSuffix(longtext.substring(0, i),
	                                           shorttext.substring(0, j));
	      if (best_common.length < suffixLength + prefixLength) {
	        best_common = shorttext.substring(j - suffixLength, j) +
	            shorttext.substring(j, j + prefixLength);
	        best_longtext_a = longtext.substring(0, i - suffixLength);
	        best_longtext_b = longtext.substring(i + prefixLength);
	        best_shorttext_a = shorttext.substring(0, j - suffixLength);
	        best_shorttext_b = shorttext.substring(j + prefixLength);
	      }
	    }
	    if (best_common.length * 2 >= longtext.length) {
	      return [best_longtext_a, best_longtext_b,
	              best_shorttext_a, best_shorttext_b, best_common];
	    } else {
	      return null;
	    }
	  }

	  // First check if the second quarter is the seed for a half-match.
	  var hm1 = diff_halfMatchI_(longtext, shorttext,
	                             Math.ceil(longtext.length / 4));
	  // Check again based on the third quarter.
	  var hm2 = diff_halfMatchI_(longtext, shorttext,
	                             Math.ceil(longtext.length / 2));
	  var hm;
	  if (!hm1 && !hm2) {
	    return null;
	  } else if (!hm2) {
	    hm = hm1;
	  } else if (!hm1) {
	    hm = hm2;
	  } else {
	    // Both matched.  Select the longest.
	    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
	  }

	  // A half-match was found, sort out the return data.
	  var text1_a, text1_b, text2_a, text2_b;
	  if (text1.length > text2.length) {
	    text1_a = hm[0];
	    text1_b = hm[1];
	    text2_a = hm[2];
	    text2_b = hm[3];
	  } else {
	    text2_a = hm[0];
	    text2_b = hm[1];
	    text1_a = hm[2];
	    text1_b = hm[3];
	  }
	  var mid_common = hm[4];
	  return [text1_a, text1_b, text2_a, text2_b, mid_common];
	};


	/**
	 * Reorder and merge like edit sections.  Merge equalities.
	 * Any edit section can move as long as it doesn't cross an equality.
	 * @param {Array} diffs Array of diff tuples.
	 */
	function diff_cleanupMerge(diffs) {
	  diffs.push([DIFF_EQUAL, '']);  // Add a dummy entry at the end.
	  var pointer = 0;
	  var count_delete = 0;
	  var count_insert = 0;
	  var text_delete = '';
	  var text_insert = '';
	  var commonlength;
	  while (pointer < diffs.length) {
	    switch (diffs[pointer][0]) {
	      case DIFF_INSERT:
	        count_insert++;
	        text_insert += diffs[pointer][1];
	        pointer++;
	        break;
	      case DIFF_DELETE:
	        count_delete++;
	        text_delete += diffs[pointer][1];
	        pointer++;
	        break;
	      case DIFF_EQUAL:
	        // Upon reaching an equality, check for prior redundancies.
	        if (count_delete + count_insert > 1) {
	          if (count_delete !== 0 && count_insert !== 0) {
	            // Factor out any common prefixies.
	            commonlength = diff_commonPrefix(text_insert, text_delete);
	            if (commonlength !== 0) {
	              if ((pointer - count_delete - count_insert) > 0 &&
	                  diffs[pointer - count_delete - count_insert - 1][0] ==
	                  DIFF_EQUAL) {
	                diffs[pointer - count_delete - count_insert - 1][1] +=
	                    text_insert.substring(0, commonlength);
	              } else {
	                diffs.splice(0, 0, [DIFF_EQUAL,
	                                    text_insert.substring(0, commonlength)]);
	                pointer++;
	              }
	              text_insert = text_insert.substring(commonlength);
	              text_delete = text_delete.substring(commonlength);
	            }
	            // Factor out any common suffixies.
	            commonlength = diff_commonSuffix(text_insert, text_delete);
	            if (commonlength !== 0) {
	              diffs[pointer][1] = text_insert.substring(text_insert.length -
	                  commonlength) + diffs[pointer][1];
	              text_insert = text_insert.substring(0, text_insert.length -
	                  commonlength);
	              text_delete = text_delete.substring(0, text_delete.length -
	                  commonlength);
	            }
	          }
	          // Delete the offending records and add the merged ones.
	          if (count_delete === 0) {
	            diffs.splice(pointer - count_insert,
	                count_delete + count_insert, [DIFF_INSERT, text_insert]);
	          } else if (count_insert === 0) {
	            diffs.splice(pointer - count_delete,
	                count_delete + count_insert, [DIFF_DELETE, text_delete]);
	          } else {
	            diffs.splice(pointer - count_delete - count_insert,
	                count_delete + count_insert, [DIFF_DELETE, text_delete],
	                [DIFF_INSERT, text_insert]);
	          }
	          pointer = pointer - count_delete - count_insert +
	                    (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
	        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
	          // Merge this equality with the previous one.
	          diffs[pointer - 1][1] += diffs[pointer][1];
	          diffs.splice(pointer, 1);
	        } else {
	          pointer++;
	        }
	        count_insert = 0;
	        count_delete = 0;
	        text_delete = '';
	        text_insert = '';
	        break;
	    }
	  }
	  if (diffs[diffs.length - 1][1] === '') {
	    diffs.pop();  // Remove the dummy entry at the end.
	  }

	  // Second pass: look for single edits surrounded on both sides by equalities
	  // which can be shifted sideways to eliminate an equality.
	  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
	  var changes = false;
	  pointer = 1;
	  // Intentionally ignore the first and last element (don't need checking).
	  while (pointer < diffs.length - 1) {
	    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
	        diffs[pointer + 1][0] == DIFF_EQUAL) {
	      // This is a single edit surrounded by equalities.
	      if (diffs[pointer][1].substring(diffs[pointer][1].length -
	          diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
	        // Shift the edit over the previous equality.
	        diffs[pointer][1] = diffs[pointer - 1][1] +
	            diffs[pointer][1].substring(0, diffs[pointer][1].length -
	                                        diffs[pointer - 1][1].length);
	        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
	        diffs.splice(pointer - 1, 1);
	        changes = true;
	      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
	          diffs[pointer + 1][1]) {
	        // Shift the edit over the next equality.
	        diffs[pointer - 1][1] += diffs[pointer + 1][1];
	        diffs[pointer][1] =
	            diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
	            diffs[pointer + 1][1];
	        diffs.splice(pointer + 1, 1);
	        changes = true;
	      }
	    }
	    pointer++;
	  }
	  // If shifts were made, the diff needs reordering and another shift sweep.
	  if (changes) {
	    diff_cleanupMerge(diffs);
	  }
	};


	var diff = diff_main;
	diff.INSERT = DIFF_INSERT;
	diff.DELETE = DIFF_DELETE;
	diff.EQUAL = DIFF_EQUAL;


	module.exports = diff;


/***/ },
/* 51 */
/***/ function(module, exports) {

	'use strict';

	var events = ['input'];

	/**
	 * Bind a text input or a textarea to the given {@link SharedString}.
	 */
	function bind(string, element) {

		var ignore = false;
		function snapshot() {
			if (ignore) return;

			string.set(element.value);
		}

		events.forEach(function (event) {
			element.addEventListener(event, snapshot);
		});

		// TODO: Smarter way to track selection movememt
		function insertText(e) {
			if (e.local) return;

			ignore = true;
			try {
				var start = element.selectionStart;
				var end = element.selectionEnd;

				var length = e.value.length;

				element.value = element.value.substring(0, e.index) + e.value + element.value.substring(e.index);

				// Transform the selection
				if (start > e.index) start += length;
				if (end > e.index) end += length;

				element.selectionStart = start;
				element.selectionEnd = end;
			} finally {
				ignore = false;
			}
		}

		function deleteText(e) {
			if (e.local) return;

			ignore = true;
			try {
				var start = element.selectionStart;
				var end = element.selectionEnd;

				var length = e.value.length;

				element.value = element.value.substring(0, e.fromIndex) + element.value.substring(e.toIndex);

				// Transform the selection
				if (start > e.fromIndex) start = Math.max(e.fromIndex, start - length);
				if (end > e.fromIndex) end = Math.max(e.fromIndex, end - length);

				element.selectionStart = start;
				element.selectionEnd = end;
			} finally {
				ignore = false;
			}
		}

		string.on('insert', insertText);
		string.on('delete', deleteText);

		element.value = string.get();

		return {
			disconnect: function disconnect() {
				string.removeEventListener('insert', insertText);
				string.removeEventListener('delete', deleteText);

				events.forEach(function (event) {
					element.removeEventListener(event, snapshot);
				});
			}
		};
	}

	module.exports = bind;

/***/ }
/******/ ])
});
;