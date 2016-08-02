'use strict';

const CompoundOperation = require('../compound-operation');
const ops = require('./ops');
const StringDelta = require('./delta');

/**
 * Turn operations into a string.
 */
exports.toJSON = function(op) {
	const result = [];
	CompoundOperation.asArray(op)
		.forEach(subOp => {
			if(subOp instanceof ops.Retain) {
				result.push('__' + subOp.length);
			} else if(subOp instanceof ops.Insert) {
				result.push('++\'' + subOp.value.replace(/'/g, '\\\'') + '\'');
			} else if(subOp instanceof ops.Delete) {
				result.push('--\'' + subOp.value.replace(/'/g, '\\\'') + '\'');
			} else {
				throw new Error('Unsupported operation: ' + subOp);
			}
		});

	return result.length === 0 ? '' : result.join(';') + ';';
};

/**
 * Turn a JSON string into operations we can work with.
 */
exports.fromJSON = function(input) {
	const delta = new StringDelta();

	let i = 0;
	let len = input.length;

	function nextIs(c) {
		if(++i >= len) {
			throw new Error('Invalid operation, no more characters to read');
		}

		if(input.charAt(i) !== c) {
			throw new Error('Invalid operation, expected ' + c + ' but got ' + input.charAt(i));
		}

		i++;
	}

	function readUntilEnd(useQuotes) {
		let buffer = [];
		let quoted = false;

		while(i < len) {
			const c0 = input.charAt(i);
			if(c0 === ';' && ! quoted) {
				return buffer.join('');
			} else if(c0 === '\\' && quoted) {
				if(input.charAt(i + 1) === '\'') {
					buffer.push('\'');

					i += 1;
				} else {
					buffer.push('\\');
				}
			} else if(c0 === '\'' && useQuotes) {
				quoted = ! quoted;
			} else {
				buffer.push(c0);
			}

			i++;
		}

		throw new Error('Reached end of stream before end of operation');
	}

	while(i < len) {
		const c = input.charAt(i);
		if(c === '_') {
			nextIs('_');
			delta.retain(parseInt(readUntilEnd(false)));
		} else if(c === '+') {
			nextIs('+');
			delta.insert(readUntilEnd(true));
		} else if(c === '-') {
			nextIs('-');
			delta.delete(readUntilEnd(true));
		} else {
			throw new Error('Unknown operation started with: ' + c);
		}

		i++;
	}

	return delta.done();
};
