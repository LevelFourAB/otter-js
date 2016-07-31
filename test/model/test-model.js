'use strict';

const expect = require('chai').expect;

const OperationSync = require('../../src/engine/sync');
const EditorControl = require('../../src/engine/editor-control');
const InMemoryHistory = require('../../src/engine/in-memory-history');
const Editor = require('../../src/engine/editor');
const Model = require('../../src/model');

const combined = require('../../src/operations/combined');
const type = combined.newType();

describe('Model', function() {
	let control;
	let sync;

	function editor(id) {
		return new Editor(id, type, sync);
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

	it('#1', function() {

		sync.suspend();

		const m1 = model('1');
		const m2 = model('2');

		return m1.open()
			.then(() => {
				m1.set('key', 'value');
				expect(m1.get('key')).to.equal('value');
			})
			.then(() => {
				sync.resume();

				return sync.waitForEmpty();
			})
			.then(() => m2.open())
			.then(() => {
				expect(m2.get('key')).to.equal('value');
			});
	});
});
