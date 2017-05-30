'use strict';

const expect = require('chai').expect;
const assert = require('chai').assert;
const string = require('../../operations/string');

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

		it('#10', function() {
			const op1 = string.delta()
				.insert('Hello ')
				.updateAnnotations()
					.set('key', null, true)
					.done()
				.insert('World')
				.updateAnnotations()
					.remove('key', true)
					.done()
				.done();

			const op2 = string.delta()
				.retain(11)
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.insert('Hello ')
				.updateAnnotations()
					.set('key', null, true)
					.done()
				.insert('World')
				.updateAnnotations()
					.remove('key', true)
					.done()
				.done());
		});

		it('#11', function() {
			const op1 = string.delta()
				.insert('Hello ')
				.updateAnnotations()
					.set('key', null, true)
					.done()
				.insert('World')
				.updateAnnotations()
					.remove('key', true)
					.done()
				.done();

			const op2 = string.delta()
				.retain(6)
				.updateAnnotations()
					.remove('key', true)
					.done()
				.retain(5)
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.insert('Hello World')
				.updateAnnotations()
					.remove('key', true)
					.done()
				.done());
		});

		it('#12', function() {
			const op1 = string.delta()
				.insert('Hello World')
				.done();

			const op2 = string.delta()
				.retain(6)
				.updateAnnotations()
					.set('key', null, true)
					.done()
				.retain(5)
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.insert('Hello ')
				.updateAnnotations()
					.set('key', null, true)
					.done()
				.insert('World')
				.done());
		});

		it('#14', function() {
			const op1 = string.delta()
				.insert('Hello ')
				.updateAnnotations()
					.set('key', null, true)
					.done()
				.insert('World')
				.done();

			const op2 = string.delta()
				.insert('Hey. ')
				.retain(11)
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.insert('Hey. Hello ')
				.updateAnnotations()
					.set('key', null, true)
					.done()
				.insert('World')
				.done());
		});

		it('#15', function() {
			const op1 = string.delta()
				.retain(4)
				.updateAnnotations()
					.set('key', null, true)
					.done()
				.retain(2)
				.updateAnnotations()
					.remove('key', true)
					.done()
				.retain(14)
				.done();

			const op2 = string.delta()
				.retain(4)
				.updateAnnotations()
					.set('key', null, true)
					.done()
				.retain(2)
				.delete('abc')
				.updateAnnotations()
					.remove('key', true)
					.done()
				.retain(11)
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.retain(4)
				.updateAnnotations()
					.set('key', null, true)
					.done()
				.retain(2)
				.delete('abc')
				.updateAnnotations()
					.remove('key', true)
					.done()
				.retain(11)
				.done());
		});

		it('#16', function() {
			const op1 = string.delta()
				.retain(4)
				.updateAnnotations()
					.set('key', null, true)
					.done()
				.retain(2)
				.updateAnnotations()
					.remove('key', true)
					.done()
				.retain(14)
				.done();

			const op2 = string.delta()
				.retain(6)
				.updateAnnotations()
					.set('key', null, true)
					.done()
				.delete('abc')
				.updateAnnotations()
					.remove('key', true)
					.done()
				.retain(11)
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.retain(4)
				.updateAnnotations()
					.set('key', null, true)
					.done()
				.retain(2)
				.delete('abc')
				.updateAnnotations()
					.remove('key', true)
					.done()
				.retain(11)
				.done());
		});

		it('#17', function() {
			const op1 = string.delta()
				.retain(1)
				.updateAnnotations()
					.set('key', null, 'abc')
					.done()
				.retain(2)
				.updateAnnotations()
					.remove('key', 'abc')
					.done()
				.retain(5)
				.done();

			const op2 = string.delta()
				.retain(3)
				.updateAnnotations()
					.set('key', null, 'def')
					.done()
				.retain(2)
				.updateAnnotations()
					.remove('key', 'def')
					.done()
				.retain(3)
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.retain(1)
				.updateAnnotations()
					.set('key', null, 'abc')
					.done()
				.retain(2)
				.updateAnnotations()
					.set('key', 'abc', 'def')
					.done()
				.retain(2)
				.updateAnnotations()
					.remove('key', 'def')
					.done()
				.retain(3)
				.done());
		});

		it('#18', function() {
			const op1 = string.delta()
				.retain(3)
				.updateAnnotations()
					.set('key', null, 'def')
					.done()
				.retain(2)
				.updateAnnotations()
					.remove('key', 'def')
					.done()
				.retain(3)
				.done();

			const op2 = string.delta()
				.retain(1)
				.updateAnnotations()
					.set('key', null, 'abc')
					.done()
				.retain(2)
				.updateAnnotations()
					.remove('key', 'abc')
					.done()
				.retain(5)
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.retain(1)
				.updateAnnotations()
					.set('key', null, 'abc')
					.done()
				.retain(2)
				.updateAnnotations()
					.set('key', 'abc', 'def')
					.done()
				.retain(2)
				.updateAnnotations()
					.remove('key', 'def')
					.done()
				.retain(3)
				.done());
		});

		it('#19', function() {
			const op1 = string.delta()
				.retain(2)
				.updateAnnotations()
					.set('key', null, 'abc')
					.done()
				.retain(4)
				.updateAnnotations()
					.remove('key', 'abc')
					.done()
				.retain(14)
				.done();

			const op2 = string.delta()
				.retain(5)
				.updateAnnotations()
					.set('key', null, 'def')
					.done()
				.retain(4)
				.updateAnnotations()
					.remove('key', 'def')
					.done()
				.retain(11)
				.done();

			expect(type.compose(op1, op2)).to.deep.equal(string.delta()
				.retain(2)
				.updateAnnotations()
					.set('key', null, 'abc')
					.done()
				.retain(3)
				.updateAnnotations()
					.set('key', 'abc', 'def')
					.done()
				.retain(4)
				.updateAnnotations()
					.remove('key', 'def')
					.done()
				.retain(11)
				.done());
		});
	});

	describe('transform', function() {

		function test(left, right, expectedLeft, expectedRight) {
			// Sanity check that composed items will result in the same op
			const c1 = type.compose(left, expectedRight);
			const c2 = type.compose(right, expectedLeft);
			expect(c1).to.deep.equal(c2, 'composed mismatch');

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

		it('annotation retain #1', function() {
			reversibleTest(
				opAnnotation(20, 4, 6, 'hello', null, 'world'),
				opRetain(20),
				opAnnotation(20, 4, 6, 'hello', null, 'world'),
				opRetain(20)
			);
		});

		it('annotation delete #1', function() {
			// A's annotation spatially before B's deletion
			reversibleTest(
				opAnnotation(20, 4, 6, 'hello', null, 'world'),
				opDelete(20, 7, 'ab'),
				opAnnotation(18, 4, 6, 'hello', null, 'world'),
				opDelete(20, 7, 'ab')
			);
		});

		it('annotation delete #2', function() {
			// A's annotation spatially after B's deletion
			reversibleTest(
				opAnnotation(20, 4, 6, 'hello', null, 'world'),
				opDelete(20, 1, 'ab'),
				opAnnotation(18, 2, 4, 'hello', null, 'world'),
				opDelete(20, 1, 'ab')
			);
		});

		it('annotation delete #3', function() {
			// A's annotation spatially adjacent to and before B's deletion
			reversibleTest(
				opAnnotation(20, 4, 6, 'hello', null, 'world'),
				opDelete(20, 6, 'abc'),
				opAnnotation(17, 4, 6, 'hello', null, 'world'),
				opDelete(20, 6, 'abc')
			);
		});

		it('annotation delete #4', function() {
			// A's annotation spatially adjacent to and after B's deletion
			reversibleTest(
				opAnnotation(20, 4, 6, 'hello', null, 'world'),
				opDelete(20, 1, 'abc'),
				opAnnotation(17, 1, 3, 'hello', null, 'world'),
				opDelete(20, 1, 'abc')
			);
		});

		it('annotation delete #5', function() {
			// A's annotation overlaps B's deletion
			reversibleTest(
				opAnnotation(20, 4, 6, 'hello', null, 'world'),
				opDelete(20, 1, 'abcd'),
				opAnnotation(16, 1, 2, 'hello', null, 'world'),
				opDelete(20, 1, 'abcd')
			);
		});

		it('annotation delete #6', function() {
			// A's annotation fully inside B's deletion
			reversibleTest(
				opAnnotation(20, 2, 3, 'hello', null, 'world'),
				opDelete(20, 1, 'abcd'),
				opRetain(16),
				opDelete(20, 1, 'abcd')
			);
		});

		it('annotation insert #1', function() {
			// A's annotation spatially after B's insertion
			reversibleTest(
				opAnnotation(20, 3, 5, 'hello', null, 'world'),
				opInsert(20, 2, 'abcd'),
				opAnnotation(24, 7, 9, 'hello', null, 'world'),
				opInsert(20, 2, 'abcd')
			);
		});

		it('annotation insert #2', function() {
			// A's annotation encloses B's insertion
			reversibleTest(
				opAnnotation(20, 3, 5, 'hello', null, 'world'),
				opInsert(20, 4, 'abcd'),
				opAnnotation(24, 3, 9, 'hello', null, 'world'),
				opInsert(20, 4, 'abcd')
			);
		});

		it('annotation insert #3', function() {
			// A's annotation spatially adjacent to and after B's insertion
			reversibleTest(
				opAnnotation(20, 3, 5, 'hello', null, 'world'),
				opInsert(20, 3, 'abcd'),
				opAnnotation(24, 3, 9, 'hello', null, 'world'),
				opInsert(20, 3, 'abcd')
			);
		});

		it('annotation insert #4', function() {
			// A's annotation spatially adjacent to and before B's insertion
			reversibleTest(
				opAnnotation(20, 3, 5, 'hello', null, 'world'),
				opInsert(20, 5, 'abcd'),
				opAnnotation(24, 3, 5, 'hello', null, 'world'),
				opInsert(20, 5, 'abcd')
			);
		});

		it('annotation annotation #1', function() {
			// A's annotation overlaps B's annotation and has diffrent key
			reversibleTest(
				opAnnotation(20, 2, 6, 'hello', null, 'world'),
				opAnnotation(20, 5, 9, 'hi', null, 'world'),
				opAnnotation(20, 2, 6, 'hello', null, 'world'),
				opAnnotation(20, 5, 9, 'hi', null, 'world')
			);
		});

		it('annotation annotation #2', function() {
			// A's annotation overlaps B's annotation and has diffrent key
			reversibleTest(
				opAnnotation(20, 2, 6, 'hello', null, 'world'),
				opAnnotation(20, 5, 7, 'hi', null, 'world'),
				opAnnotation(20, 2, 6, 'hello', null, 'world'),
				opAnnotation(20, 5, 7, 'hi', null, 'world')
			);
		});

		it('annotation annotation #3', function() {
			// A's annotation spatially before B's annotation
			reversibleTest(
				opAnnotation(20, 2, 5, 'hello', null, 'world'),
				opAnnotation(20, 6, 9, 'hello', null, 'there'),
				opAnnotation(20, 2, 5, 'hello', null, 'world'),
				opAnnotation(20, 6, 9, 'hello', null, 'there')
			);
		});

		it('annotation annotation #4', function() {
			// A's annotation spatially adjacent to and before B's annotation
			reversibleTest(
				opAnnotation(20, 2, 5, 'hello', null, 'world'),
				opAnnotation(20, 5, 9, 'hello', null, 'there'),
				opAnnotation(20, 2, 5, 'hello', null, 'world'),
				opAnnotation(20, 5, 9, 'hello', null, 'there')
			);
		});

		it('annotation annotation #5', function() {
			// Annotations overlap
			reversibleTest(
				opAnnotation(20, 2, 6, 'hello', null, 'world'),
				opAnnotation(20, 5, 9, 'hello', null, 'there'),
				opAnnotation(20, 2, 6, 'hello', null, 'world'),
				opAnnotation(20, 5, 9, 'hello', null, 'there')
			);
		});

		it('annotation annotation #6', function() {
			// A's annotation is within B's
			reversibleTest(
				opAnnotation(20, 5, 7, 'hello', null, 'world'),
				opAnnotation(20, 2, 9, 'hello', null, 'there'),
				opAnnotation(20, 5, 7, 'hello', null, 'world'),
				opAnnotation(20, 2, 9, 'hello', null, 'there')
			);
		});
	});

	describe('serialization', function() {
		it('#1', function() {

			const op = string.delta()
				.retain(2)
				.insert('\'ello World')
				.delete('Cookie')
				.done();

			expect(type.fromJSON(type.toJSON(op))).to.deep.equal(op);
		});

		it('#2', function() {

			const op = string.delta()
				.retain(2)
				.updateAnnotations()
					.set('key', null, true)
					.done()
				.insert('Hello World')
				.delete('Cookie')
				.updateAnnotations()
					.remove('key', true)
					.done()
				.done();

			expect(type.fromJSON(type.toJSON(op))).to.deep.equal(op);
		});

		it('#3', function() {

			const op = string.delta()
				.retain(2)
				.updateAnnotations()
					.set('key', null, true)
					.done()
				.insert('Hello World')
				.delete('Cookie')
				.done();

			const value = [["retain",2],["annotations",{"key":{"oldValue":null,"newValue":true}}],["insert","Hello World"],["delete","Cookie"]];
			expect(type.fromJSON(value)).to.deep.equal(op);
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

function opAnnotation(size, start, end, key, oldValue, newValue) {
	const delta = string.delta()
		.retain(start);

	if(newValue === null) {
		delta.updateAnnotations()
			.remove(key, oldValue)
			.done();
	} else {
		delta.updateAnnotations()
			.set(key, oldValue, newValue)
			.done();
	}

	delta.retain(end - start);

	if(newValue !== null) {
		delta.updateAnnotations()
			.remove(key, newValue)
			.done();
	}

	return delta.retain(size - end)
		.done();
}
