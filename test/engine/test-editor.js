'use strict';

const expect = require('chai').expect;

const OperationSync = require('../../src/engine/sync');
const EditorControl = require('../../src/engine/editor-control');
const InMemoryHistory = require('../../src/engine/in-memory-history');
const Editor = require('../../src/engine/editor');

const string = require('../../src/operations/string');
const type = string.newType();

describe('Editor Control', function() {
	let control;
	let sync;

	function editor(id) {
		return new Editor(id, sync);
	}

	beforeEach(function() {
		control = new EditorControl(
			new InMemoryHistory(
				type,
				string.delta()
					.insert('Hello World')
					.done()
			)
		);

		sync = OperationSync.local(control);
	});

	it('#1', function() {
		const e1 = editor('1');

		return e1.connect()
			.then(() => {
				e1.apply(string.delta()
					.retain(6)
					.delete('World')
					.insert('Cookies')
					.done()
				);
			})
			.then(() => sync.waitForEmpty())
			.then(() => {
				expect(e1.current).to.deep.equal(string.delta()
					.insert('Hello Cookies')
					.done()
				);
			});
	});

	it('multiple #1', function() {
		const e1 = editor('1');
		const e2 = editor('2');

		return e1.connect()
			.then(() => e2.connect())
			.then(() => {
				e1.apply(string.delta()
					.retain(6)
					.delete('World')
					.insert('Cookies')
					.done()
				);
			})
			.then(() => sync.waitForEmpty())
			.then(() => {
				expect(e2.current).to.deep.equal(string.delta()
					.insert('Hello Cookies')
					.done()
				);
			});
	});

	it('multiple #2', function() {
		const e1 = editor('1');
		const e2 = editor('2');

		sync.suspend();
		return e1.connect()
			.then(() => e2.connect())
			.then(() => {
				e1.apply(string.delta()
					.retain(6)
					.delete('World')
					.insert('Cookies')
					.done()
				);

				e2.apply(string.delta()
					.retain(11)
					.insert('!')
					.done()
				);
			})
			.then(() => {
				sync.resume();
				return sync.waitForEmpty();
			})
			.then(() => {
				expect(e1.current).to.deep.equal(string.delta()
					.insert('Hello Cookies!')
					.done()
				);

				expect(e2.current).to.deep.equal(string.delta()
					.insert('Hello Cookies!')
					.done()
				);
			});
	});

	it('multiple #3', function() {
		const e1 = editor('1');
		const e2 = editor('2');

		sync.suspend();
		return e1.connect()
			.then(() => e2.connect())
			.then(() => {
				e1.apply(string.delta()
					.retain(6)
					.delete('World')
					.insert('Cookies')
					.done()
				);

				e2.apply(string.delta()
					.retain(11)
					.insert('!')
					.done()
				);

				e2.apply(string.delta()
					.retain(11)
					.insert('!')
					.retain(1)
					.done()
				);
			})
			.then(() => {
				sync.resume();
				return sync.waitForEmpty();
			})
			.then(() => {
				expect(e1.current).to.deep.equal(string.delta()
					.insert('Hello Cookies!!')
					.done()
				);

				expect(e2.current).to.deep.equal(string.delta()
					.insert('Hello Cookies!!')
					.done()
				);
			});
	});

	it('multiple #4', function() {
		const e1 = editor('1');
		const e2 = editor('2');

		sync.suspend();
		return e1.connect()
			.then(() => e2.connect())
			.then(() => {
				e1.apply(string.delta()
					.retain(6)
					.delete('World')
					.insert('Cookies')
					.done()
				);

				e2.apply(string.delta()
					.retain(11)
					.insert('!')
					.done()
				);

				e1.apply(string.delta()
					.retain(12)
					.delete('s')
					.done()
				);

				e2.apply(string.delta()
					.retain(11)
					.insert('!')
					.retain(1)
					.done()
				);
			})
			.then(() => {
				sync.resume();
				return sync.waitForEmpty();
			})
			.then(() => {
				expect(e1.current).to.deep.equal(string.delta()
					.insert('Hello Cookie!!')
					.done()
				);

				expect(e2.current).to.deep.equal(string.delta()
					.insert('Hello Cookie!!')
					.done()
				);
			});
	});
});
