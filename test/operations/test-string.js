'use strict';

const expect = require('chai').expect;
const assert = require('chai').assert;
const string = require('../../src/operations/string');

const type = string.newType();

describe('String OT', function() {
	describe('compose', function() {
		it('#1', function() {
			const op1 = string.delta()
				.insert('Hello World')
				.done();

			const op2 = string.delta()
				.retain(6)
				.delete('World')
				.insert('Cookies')
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.insert('Hello Cookies')
				.done()
			);
		});

		it('#2', function() {
			const op1 = string.delta()
				.retain(6)
				.insert('World')
				.done();

			const op2 = string.delta()
				.retain(6)
				.delete('World')
				.insert('Cookies')
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.retain(6)
				.insert('Cookies')
				.done()
			);
		});

		it('#3', function() {
			const op1 = string.delta()
				.retain(6)
				.insert('World')
				.done();

			const op2 = string.delta()
				.retain(6)
				.retain(1)
				.delete('orld')
				.insert(' ')
				.insert('Cookies')
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.retain(6)
				.insert('W Cookies')
				.done()
			);
		});

		it('#4', function() {
			const op1 = string.delta()
				.insert('Hello ')
				.retain(5)
				.done();

			const op2 = string.delta()
				.retain(11)
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.insert('Hello ')
				.retain(5)
				.done()
			);
		});

		it('#5', function() {
			const op1 = string.delta()
				.delete('Hello ')
				.retain(5)
				.done();

			const op2 = string.delta()
				.insert('Cookie ')
				.retain(5)
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.delete('Hello ')
				.insert('Cookie ')
				.retain(5)
				.done()
			);
		});

		it('#6', function() {
			const op1 = string.delta()
				.insert('Cookie ')
				.retain(5)
				.done();

			const op2 = string.delta()
				.delete('Cookie')
				.retain(5)
				.done();

			let failed = false;
			let res;
			try {
				res = type.compose(op1, op2);
			} catch(e) {
				failed = true;
			}

			if(! failed) {
				assert.isNotOk(res, 'This test should fail, but instead got: ' + res.toString());
			}
		});

		it('#7', function() {
			const op1 = string.delta()
				.insert('Hello Cookie')
				.done();

			const op2 = string.delta()
				.retain(6)
				.insert('!')
				.retain(6)
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.insert('Hello !Cookie')
				.done()
			);
		});

		it('#8', function() {
			const op1 = string.delta()
				.retain(6)
				.insert('!')
				.done();

			const op2 = string.delta()
				.insert('Cookie')
				.retain(7)
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.insert('Cookie')
				.retain(6)
				.insert('!')
				.done()
			);
		});

		it('#9', function() {
			const op1 = string.delta()
				.insert('Hello World!')
				.done();

			const op2 = string.delta()
				.retain(6)
				.delete('World')
				.insert('Cookies')
				.retain(1)
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.insert('Hello Cookies!')
				.done()
			);
		});
	});

	describe('transform', function() {

		function test(left, right, expectedLeft, expectedRight) {
			const op = type.transform(left, right);
			expect(op.left).to.deep.equal(expectedLeft, 'left mismatch');
			expect(op.right).to.deep.equal(expectedRight, 'right mismatch');
		}

		function reversibleTest(left, right, expectedLeft, expectedRight) {
			test(left, right, expectedLeft, expectedRight);
			test(right, left, expectedRight, expectedLeft);
		}

		it('insertionBeforeRight', function() {
			reversibleTest(
				opInsert(20, 1, 'a'),
				opInsert(20, 2, '1'),
				opInsert(21, 1, 'a'),
				opInsert(21, 3, '1')
			);
		});

		it('insertionAtSameLocation', function() {
			test(
				opInsert(20, 2, 'abc'),
				opInsert(20, 2, '123'),
				opInsert(23, 2, 'abc'),
				opInsert(23, 5, '123')
			);
		});

		it('delete', function() {
			reversibleTest(
				opInsert(20, 1, 'abc'),
				opDelete(20, 2, 'de'),
				opInsert(18, 1, 'abc'),
				opDelete(23, 5, 'de')
			);
		});

		it('other #1', function() {
			reversibleTest(
				opDelete(20, 1, 'abcde'),
				opDelete(20, 7, 'fg'),
				opDelete(18, 1, 'abcde'),
				opDelete(15, 2, 'fg')
			);
		});

		it('other #2', function() {
			reversibleTest(
				opDelete(20, 1, 'abcde'),
				opDelete(20, 6, 'fg'),
				opDelete(18, 1, 'abcde'),
				opDelete(15, 1, 'fg')
			);
		});

		it('other #3', function() {
			reversibleTest(
				opDelete(20, 1, 'abcde'),
				opDelete(20, 3, 'cdefghi'),
				opDelete(13, 1, 'ab'),
				opDelete(15, 1, 'fghi')
			);
		});

		it('other #4', function() {
			reversibleTest(
				opDelete(20, 1, 'abcdefg'),
				opDelete(20, 3, 'cd'),
				opDelete(18, 1, 'abefg'),
				opRetain(13)
			);
		});

		it('other #5', function() {
			reversibleTest(
				opDelete(20, 1, 'abcdefg'),
				opDelete(20, 1, 'abcdefg'),
				opRetain(13),
				opRetain(13)
			);
		});

		it('mix #1', function() {
			reversibleTest(
				string.delta()
					.retain(6)
					.delete('World')
					.insert('Cookies')
					.done(),

				string.delta()
					.retain(11)
					.insert('!')
					.done(),

				string.delta()
					.retain(6)
					.delete('World')
					.insert('Cookies')
					.retain(1)
					.done(),

				string.delta()
					.retain(13)
					.insert('!')
					.done()
			);
		});
	});
});

function opRetain(i) {
	return string.delta()
		.retain(i)
		.done();
}

function opInsert(size, location, characters) {
	return string.delta()
		.retain(location)
		.insert(characters)
		.retain(size - location)
		.done();
}

function opDelete(size, location, characters) {
	return string.delta()
		.retain(location)
		.delete(characters)
		.retain(size - location - characters.length)
		.done()
}
