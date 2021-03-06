'use strict';

const expect = require('chai').expect;

const OperationSync = require('../../engine/sync');
const EditorControl = require('../../engine/editor-control');
const InMemoryHistory = require('../../engine/in-memory-history');
const Editor = require('../../engine/editor');
const Model = require('../../model');

const combined = require('../../operations/combined');
const type = combined.newType();

describe('Model', function() {
	let control;
	let sync;

	function editor() {
		return new Editor(sync);
	}

	function model(id) {
		return new Model(editor());
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

	it('rootMap', function() {

		sync.suspend();

		const m1 = model('1');
		let m2;

		return m1.open()
			.then(() => {
				m1.set('key', 'value');
				expect(m1.get('key')).to.equal('value');
			})
			.then(() => {
				sync.resume();

				return sync.waitForEmpty();
			})
			.then(() => {
				m2 = model('2');
				return m2.open();
			})
			.then(() => {
				expect(m2.get('key')).to.equal('value');
			});
	});

	it('rootMapEvents', function() {
		const m1 = model('1');
		const m2 = model('1');

		let b;
		m2.addEventListener('valueChanged', function(e) {
			b = e.newValue;
		});

		return m1.open()
			.then(() => m2.open())
			.then(() => {
				m1.set('key', 'value');
				return sync.waitForEmpty();
			})
			.then(() => {
				expect(b).to.equal('value');
			});
	});
});
