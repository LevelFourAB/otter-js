'use strict';

const expect = require('chai').expect;
const assert = require('chai').assert;
const list = require('../../src/operations/list');

const type = list.newType();

describe('List OT', function() {
	describe('compose', function() {
		it('#1', function() {
			const op1 = list.delta()
				.insert('one')
				.insert('two')
				.done();

			const op2 = list.delta()
				.retain(1)
				.delete('two')
				.insert('three')
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(list.delta()
				.insert('one')
				.insert('three')
				.done()
			);
		});

		it('#2', function() {
			const op1 = list.delta()
				.retain(1)
				.insert('one')
				.done();

			const op2 = list.delta()
				.retain(1)
				.delete('one')
				.insert('three')
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(list.delta()
				.retain(1)
				.insert('three')
				.done()
			);
		});

		it('#3', function() {
			const op1 = list.delta()
				.insert('one')
				.done();

			const op2 = list.delta()
				.delete('one')
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(list.delta()
				.done()
			);
		});

		it('#4', function() {
			const op1 = list.delta()
				.delete('one')
				.done();

			const op2 = list.delta()
				.insert('one')
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(list.delta()
				.delete('one')
				.insert('one')
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
				opInsert(20, 1, [ 'a' ]),
				opInsert(20, 2, [ '1' ]),
				opInsert(21, 1, [ 'a' ]),
				opInsert(21, 3, [ '1' ])
			);
		});

		it('insertionAtSameLocation', function() {
			test(
				opInsert(20, 2, [ 'a', 'b', 'c' ]),
				opInsert(20, 2, [ '1', '2', '3' ]),
				opInsert(23, 2, [ 'a', 'b', 'c' ]),
				opInsert(23, 5, [ '1', '2', '3' ])
			);
		});

		it('delete', function() {
			reversibleTest(
				opInsert(20, 1, [ 'a', 'b', 'c' ]),
				opDelete(20, 2, [ 'd', 'e' ]),
				opInsert(18, 1, [ 'a', 'b', 'c' ]),
				opDelete(23, 5, [ 'd', 'e' ])
			);
		});

		it('other #1', function() {
			reversibleTest(
				opDelete(20, 1, [ 'a', 'b', 'c', 'd', 'e' ]),
				opDelete(20, 7, [ 'f', 'g' ]),
				opDelete(18, 1, [ 'a', 'b', 'c', 'd', 'e' ]),
				opDelete(15, 2, [ 'f', 'g' ])
			);
		});

		it('other #2', function() {
			reversibleTest(
				opDelete(20, 1, [ 'a', 'b', 'c', 'd', 'e' ]),
				opDelete(20, 6, [ 'f', 'g' ]),
				opDelete(18, 1, [ 'a', 'b', 'c', 'd', 'e' ]),
				opDelete(15, 1, [ 'f', 'g' ])
			);
		});

		it('other #3', function() {
			reversibleTest(
				opDelete(20, 1, [ 'a', 'b', 'c', 'd', 'e' ]),
				opDelete(20, 3, [ 'c', 'd', 'e', 'f', 'g', 'h', 'i' ]),
				opDelete(13, 1, [ 'a', 'b' ]),
				opDelete(15, 1, [ 'f', 'g', 'h', 'i' ])
			)
		});

		it('other #4', function() {
			reversibleTest(
				opDelete(20, 1, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ]),
				opDelete(20, 3, [ 'c', 'd' ]),
				opDelete(18, 1, [ 'a', 'b', 'e', 'f', 'g' ]),
				opRetain(13)
			);
		})

		it('other #5', function() {
			reversibleTest(
				opDelete(20, 1, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ]),
				opDelete(20, 1, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ]),
				opRetain(13),
				opRetain(13)
			);
		});
	});
});

function opRetain(i) {
	return list.delta()
		.retain(i)
		.done();
}

function opInsert(size, location, items) {
	return list.delta()
		.retain(location)
		.insertMultiple(items)
		.retain(size - location)
		.done();
}

function opDelete(size, location, items) {
	return list.delta()
		.retain(location)
		.deleteMultiple(items)
		.retain(size - location - items.length)
		.done();
}
