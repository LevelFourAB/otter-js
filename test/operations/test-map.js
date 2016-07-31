'use strict';

const expect = require('chai').expect;
const assert = require('chai').assert;
const map = require('../../src/operations/map');

const type = map.newType();

describe('Map OT', function() {
	describe('compose', function() {
		it('sameKeyAndValue', function() {
			const op1 = map.delta()
				.set('one', null, 'abc')
				.done();

			const op2 = map.delta()
				.set('one', null, 'abc')
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(map.delta()
				.set('one', null, 'abc')
				.done()
			);
		});

		it('sameKey', function() {
			const op1 = map.delta()
				.set('one', null, 'abc')
				.done();

			const op2 = map.delta()
				.set('one', 'abc', 'def')
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(map.delta()
				.set('one', null, 'def')
				.done()
			);
		});

		it('differentKeys1', function() {
			const op1 = map.delta()
				.set('one', null, 'abc')
				.done();

			const op2 = map.delta()
				.set('two', null, 'def')
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(map.delta()
				.set('one', null, 'abc')
				.set('two', null, 'def')
				.done()
			);
		});

		it('differentKeys2', function() {
			const op1 = map.delta()
				.set('two', null, 'def')
				.done();

			const op2 = map.delta()
				.set('one', null, 'abc')
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(map.delta()
				.set('one', null, 'abc')
				.set('two', null, 'def')
				.done()
			);
		});

		it('multipleDifferentKeys1', function() {
			const op1 = map.delta()
				.set('one', null, 'abc')
				.set('two', null, 'def')
				.done();

			const op2 = map.delta()
				.set('one', 'abc', 'def')
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(map.delta()
				.set('one', null, 'def')
				.set('two', null, 'def')
				.done()
			);
		});

		it('multipleDifferentKeys2', function() {
			const op1 = map.delta()
				.set('two', null, 'def')
				.set('one', null, 'abc')
				.done();

			const op2 = map.delta()
				.set('one', 'abc', 'def')
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(map.delta()
				.set('one', null, 'def')
				.set('two', null, 'def')
				.done()
			);
		});

		it('multipleDifferentKeys3', function() {
			const op1 = map.delta()
				.set('one', null, 'abc')
				.set('two', null, 'def')
				.done();

			const op2 = map.delta()
				.set('two', 'def', 'ghi')
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(map.delta()
				.set('one', null, 'abc')
				.set('two', null, 'ghi')
				.done()
			);
		});

		it('multipleDifferentKeys4', function() {
			const op1 = map.delta()
				.set('one', null, 'abc')
				.set('two', null, 'def')
				.done();

			const op2 = map.delta()
				.set('two', 'def', 'ghi')
				.set('one', 'abc', 'def')
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(map.delta()
				.set('one', null, 'def')
				.set('two', null, 'ghi')
				.done()
			);
		});

		it('multipleSameKey', function() {
			const op1 = map.delta()
				.set('one', null, 'abc')
				.done();

			const op2 = map.delta()
				.set('one', 'abc', 'def')
				.set('one', 'def', 'ghi')
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(map.delta()
				.set('one', null, 'ghi')
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

		it('differentKeys', function() {
			reversibleTest(
				map.delta()
					.set('one', null, 'abc')
					.done(),

				map.delta()
					.set('two', null, 'def')
					.done(),

				map.delta()
					.set('one', null, 'abc')
					.done(),

				map.delta()
					.set('two', null, 'def')
					.done()
			);
		});

		it('sameKey', function() {
			test(
				map.delta()
					.set('one', null, 'abc')
					.done(),

				map.delta()
					.set('one', null, 'def')
					.done(),

				map.delta()
					.done(),

				map.delta()
					.set('one', 'abc', 'def')
					.done()
			);
		});

		it('sameSeveralSameKey1', function() {
			test(
				map.delta()
					.set('one', null, 'abc')
					.set('two', null, 'kaka')
					.done(),

				map.delta()
					.set('one', null, 'def')
					.done(),

				map.delta()
					.set('two', null, 'kaka')
					.done(),

				map.delta()
					.set('one', 'abc', 'def')
					.done()
			);
		});

		it('sameSeveralSameKey2', function() {
			test(
				map.delta()
					.set('two', null, 'abc')
					.set('one', null, 'kaka')
					.done(),

				map.delta()
					.set('two', null, 'def')
					.done(),

				map.delta()
					.set('one', null, 'kaka')
					.done(),

				map.delta()
					.set('two', 'abc', 'def')
					.done()
			);
		});
	});
});
