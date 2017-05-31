'use strict';

const expect = require('chai').expect;

const UndoRedoManager = require('../../engine/undo-redo');

const string = require('../../operations/string');
const type = string.newType();

describe('Editor: UndoRedoManager', function() {
	let applied;

	function manager() {
		return new UndoRedoManager({
			editor: {
				type: type,

				apply: function(a) {
					applied = a;
				}
			}
		});
	}

	it('Can not undo/redo without op', function() {
		const m = manager();
		expect(m.canUndo).to.be.false;
		expect(m.canRedo).to.be.false;
	});

	it('Can undo after apply', function() {
		const m = manager();

		m.apply(string.delta()
			.retain(6)
			.delete('World')
			.insert('Cookies')
			.done()
		);

		expect(m.canUndo).to.be.true;
		expect(m.canRedo).to.be.false;
	});

	it('Undo without remote', function() {
		const m = manager();

		const op = string.delta()
			.retain(6)
			.delete('World')
			.insert('Cookies')
			.done();
		m.apply(op);

		m.undo();

		expect(m.canUndo).to.be.false;
		expect(m.canRedo).to.be.true;

		expect(applied).to.deep.equal(string.delta()
			.retain(6)
			.insert('World')
			.delete('Cookies')
			.done()
		);
	});

	it('Redo without remote', function() {
		const m = manager();

		const op = string.delta()
			.retain(6)
			.delete('World')
			.insert('Cookies')
			.done();
		m.apply(op);

		m.undo();
		m.redo();

		expect(m.canUndo).to.be.true;
		expect(m.canRedo).to.be.false;

		expect(applied).to.deep.equal(op);
	});

	it('Undo + apply disables redo', function() {
		const m = manager();

		const op = string.delta()
			.retain(6)
			.delete('World')
			.insert('Cookies')
			.done();
		m.apply(op);

		m.undo();

		expect(m.canUndo).to.be.false;
		expect(m.canRedo).to.be.true;

		m.apply(string.delta()
			.retain(13)
			.insert('!')
			.done()
		);

		expect(m.canUndo).to.be.true;
		expect(m.canRedo).to.be.false;
	});

	it('Undo/Redo/Undo without remote', function() {
		const m = manager();

		const op = string.delta()
			.retain(6)
			.delete('World')
			.insert('Cookies')
			.done();
		m.apply(op);

		m.undo();
		m.redo();
		m.undo();

		expect(m.canUndo).to.be.false;
		expect(m.canRedo).to.be.true;

		expect(applied).to.deep.equal(string.delta()
			.retain(6)
			.insert('World')
			.delete('Cookies')
			.done()
		);
	});

	it('Undo with single remote', function() {
		const m = manager();

		const op = string.delta()
			.retain(6)
			.delete('World')
			.insert('Cookies')
			.done();
		m.apply(op);

		m.receive(string.delta()
			.retain(13)
			.insert('!')
			.done()
		);

		m.undo();

		expect(m.canUndo).to.be.false;
		expect(m.canRedo).to.be.true;

		expect(applied).to.deep.equal(string.delta()
			.retain(6)
			.insert('World')
			.delete('Cookies')
			.retain(1)
			.done()
		);
	});

	it('Undo with multiple remote', function() {
		const m = manager();

		const op = string.delta()
			.retain(6)
			.delete('World')
			.insert('Cookies')
			.done();
		m.apply(op);

		m.receive(string.delta()
			.retain(13)
			.insert('!')
			.done()
		);

		m.receive(string.delta()
			.retain(14)
			.insert('?')
			.done()
		);

		m.undo();

		expect(m.canUndo).to.be.false;
		expect(m.canRedo).to.be.true;

		expect(applied).to.deep.equal(string.delta()
			.retain(6)
			.insert('World')
			.delete('Cookies')
			.retain(2)
			.done()
		);
	});

	it('Undo/redo with single remote', function() {
		const m = manager();

		const op = string.delta()
			.retain(6)
			.delete('World')
			.insert('Cookies')
			.done();
		m.apply(op);

		m.receive(string.delta()
			.retain(13)
			.insert('!')
			.done()
		);

		m.undo();
		m.redo();

		expect(m.canUndo).to.be.true;
		expect(m.canRedo).to.be.false;

		expect(applied).to.deep.equal(string.delta()
			.retain(6)
			.delete('World')
			.insert('Cookies')
			.retain(1)
			.done()
		);
	});

	it('Multiple changes', function() {
		const m = manager();

		const op = string.delta()
			.retain(6)
			.delete('World')
			.insert('Cookies')
			.done();
		m.apply(op);

		m.receive(string.delta()
			.retain(13)
			.insert('!')
			.done()
		);

		m.apply(string.delta()
			.retain(14)
			.insert('?')
			.done()
		);

		expect(m.canUndo).to.be.true;
		expect(m.canRedo).to.be.false;

		m.undo();

		expect(applied).to.deep.equal(string.delta()
			.retain(14)
			.delete('?')
			.done()
		);

		m.undo();

		expect(applied).to.deep.equal(string.delta()
			.retain(6)
			.insert('World')
			.delete('Cookies')
			.retain(1)
			.done()
		);
	});
});
