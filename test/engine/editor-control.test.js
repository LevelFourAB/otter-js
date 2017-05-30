'use strict';

const expect = require('chai').expect;

const EditorControl = require('../../engine/editor-control');
const InMemoryHistory = require('../../engine/in-memory-history');
const string = require('../../operations/string');

describe('Editor Control', function() {
	let control;

	beforeEach(function() {
		control = new EditorControl(
			new InMemoryHistory(
				string.newType(),
				string.delta()
					.insert('Hello World')
					.done()
			)
		);
	});

	it('getLatest', function() {
		return control.latest()
			.then(latest => {
				expect(latest.operation).to.deep.equal(string.delta()
					.insert('Hello World')
					.done()
				);
			});
	});

	it('edit', function() {
		return control.latest()
			.then(latest => {
				return control.store(latest.historyId, 'test', string.delta()
					.retain(6)
					.delete('World')
					.insert('Cookie')
					.done()
				);
			})
			.then(op => {
				expect(op.token).to.equal('test');

				return control.latest();
			})
			.then(latest => {
				expect(latest.operation).to.deep.equal(string.delta()
					.insert('Hello Cookie')
					.done()
				);
			});
	});

	it('editsFromSameHistoryId', function() {
		let latestHistoryId;
		return control.latest()
			.then(latest => {
				latestHistoryId = latest.historyId;
			})
			.then(() => {
				return control.store(latestHistoryId, 'test', string.delta()
					.retain(6)
					.delete('World')
					.insert('Cookie')
					.done()
				);
			})
			.then(() => {
				return control.store(latestHistoryId, 'test', string.delta()
					.retain(11)
					.insert('!')
					.done()
				);
			})
			.then(op => {
				return control.latest();
			})
			.then(latest => {
				expect(latest.operation).to.deep.equal(string.delta()
					.insert('Hello Cookie!')
					.done()
				);
			});
	});

});
