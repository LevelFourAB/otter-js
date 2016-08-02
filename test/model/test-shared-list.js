'use strict';

const expect = require('chai').expect;

const OperationSync = require('../../src/engine/sync');
const EditorControl = require('../../src/engine/editor-control');
const InMemoryHistory = require('../../src/engine/in-memory-history');
const Editor = require('../../src/engine/editor');
const Model = require('../../src/model');

const combined = require('../../src/operations/combined');
const type = combined.newType();

describe('SharedList', function() {
	let control;
	let sync;

	function editor(id) {
		return new Editor(id, sync);
	}

	function model(id) {
		return new Model(editor(id));
	}

	beforeEach(function() {
		control = new EditorControl(
			new InMemoryHistory(
				type,
				combined.delta().done()
			)
		);

		sync = OperationSync.local(control);
	});

	it('add', function() {
		const m1 = model('1');
		const list1 = m1.newList();

		return m1.open()
			.then(() => {
				list1.add('value');

				expect(list1.length).to.equal(1);
				expect(list1.get(0)).to.equal('value');
			});
	});

	it('addAll', function() {
		const m1 = model('1');
		const list1 = m1.newList();

		return m1.open()
			.then(() => {
				list1.addAll([ 'v1', 'v2', 'v3' ]);

				expect(list1.length).to.equal(3);
				expect(list1.get(0)).to.equal('v1');
				expect(list1.get(1)).to.equal('v2');
				expect(list1.get(2)).to.equal('v3');
			});
	});

	it('insert #1', function() {
		const m1 = model('1');
		const list1 = m1.newList();

		return m1.open()
			.then(() => {
				list1.addAll([ 'v1', 'v2', 'v3' ]);
				list1.insert(0, 'v0');

				expect(list1.length).to.equal(4);
				expect(list1.get(0)).to.equal('v0');
				expect(list1.get(1)).to.equal('v1');
				expect(list1.get(2)).to.equal('v2');
				expect(list1.get(3)).to.equal('v3');
			});
	});

	it('insert #2', function() {
		const m1 = model('1');
		const list1 = m1.newList();

		return m1.open()
			.then(() => {
				list1.addAll([ 'v1', 'v2', 'v3' ]);
				list1.insert(3, 'v4');

				expect(list1.length).to.equal(4);
				expect(list1.get(0)).to.equal('v1');
				expect(list1.get(1)).to.equal('v2');
				expect(list1.get(2)).to.equal('v3');
				expect(list1.get(3)).to.equal('v4');
			});
	});

	it('insertAll', function() {
		const m1 = model('1');
		const list1 = m1.newList();

		return m1.open()
			.then(() => {
				list1.addAll([ 'v1', 'v2', 'v3' ]);
				list1.insertAll(0, [ 'a', 'b', 'c' ]);

				expect(list1.length).to.equal(6);
				expect(list1.get(0)).to.equal('a');
				expect(list1.get(1)).to.equal('b');
				expect(list1.get(2)).to.equal('c');
				expect(list1.get(3)).to.equal('v1');
				expect(list1.get(4)).to.equal('v2');
				expect(list1.get(5)).to.equal('v3');
			});
	});


	it('remove', function() {
		const m1 = model('1');
		const list1 = m1.newList();

		return m1.open()
			.then(() => {
				list1.addAll([ 'v1', 'v2', 'v3' ]);
				list1.remove(1);

				expect(list1.length).to.equal(2);
				expect(list1.get(0)).to.equal('v1');
				expect(list1.get(1)).to.equal('v3');
			});
	});

	it('removeRange #1', function() {
		const m1 = model('1');
		const list1 = m1.newList();

		return m1.open()
			.then(() => {
				list1.addAll([ 'v1', 'v2', 'v3', 'v4', 'v5' ]);
				list1.removeRange(1, 4);

				expect(list1.length).to.equal(2);
				expect(list1.get(0)).to.equal('v1');
				expect(list1.get(1)).to.equal('v5');
			});
	});

	it('removeRange #2', function() {
		const m1 = model('1');
		const list1 = m1.newList();

		return m1.open()
			.then(() => {
				list1.addAll([ 'v1', 'v2', 'v3', 'v4', 'v5' ]);
				list1.removeRange(0, 1);

				expect(list1.length).to.equal(4);
				expect(list1.get(0)).to.equal('v2');
				expect(list1.get(1)).to.equal('v3');
				expect(list1.get(2)).to.equal('v4');
				expect(list1.get(3)).to.equal('v5');
			});
	});

	it('set', function() {
		const m1 = model('1');
		const list1 = m1.newList();

		return m1.open()
			.then(() => {
				list1.addAll([ 'v1', 'v2', 'v3' ]);
				list1.set(1, 'a');

				expect(list1.length).to.equal(3);
				expect(list1.get(0)).to.equal('v1');
				expect(list1.get(1)).to.equal('a');
				expect(list1.get(2)).to.equal('v3');
			});
	});
});
