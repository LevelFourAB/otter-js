'use strict';

const expect = require('chai').expect;

const OperationSync = require('../../engine/sync');
const EditorControl = require('../../engine/editor-control');
const InMemoryHistory = require('../../engine/in-memory-history');
const Editor = require('../../engine/editor');

const string = require('../../operations/string');
const type = string.newType();

describe('Editor', function() {
	let control;
	let sync;

	function editor(id) {
		return new Editor(sync);
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
		const e1 = editor();

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
		const e1 = editor();
		const e2 = editor();

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
		const e1 = editor();
		const e2 = editor();

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
		const e1 = editor();
		const e2 = editor();

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
		const e1 = editor();
		const e2 = editor();

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
