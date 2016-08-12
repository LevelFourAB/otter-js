'use strict';

const locallock = require('./local-lock');
const TaggedOperation = require('./tagged-operation');

/**
 * Helper for keeping several editors in sync.
 */
class EditorControl {
	/**
	 * Create a new editor control using the specified history storage.
	 *
	 * @param history
	 *   the history implementation to use for storing information
	 * @param [lock]
	 *   optional lock function, see {@link LocalLock} for details about
	 *   how to implement locks.
	 * @param [idGenerator]
	 *   optional function that returns a unique session id. The default
	 *   function uses the current timestamp and a random number as the
	 *   id.
	 */
	constructor(history, lock, idGenerator) {
		this.history = history;
		this.type = history.type;

		this.lock = lock || locallock();
		this.idGenerator = idGenerator || function() {
			const now = Date.now();
			const random = Math.floor(Math.random() * 50000);

			return now.toString(36) + '-' + random.toString(36);
		};
	}

	/**
	 * Get the operation that describes the document that a new client should
	 * start with.
	 *
	 * @return {Promise}
	 *   Promise that will resolve to the latest tagged operation.
	 */
	latest() {
		return this.history.latest()
			.then(id => {
				return this.history.until(id + 1)
					.then(items => {
						const sessionId = this.idGenerator();

						const composer = this.history.type.newComposer();
						items.forEach(function(item) {
							composer.add(item);
						});

						const composed = composer.done();
						return new TaggedOperation(id, sessionId, composed);
					});
			});
	}

	/**
	 * Store a new operation taking information from the given
	 * {@link TaggedOperation} to determine the history id the change occured
	 * on.
	 *
	 * @return {Promise}
	 *   Promise that will resolve to a tagged operation that is suitable
	 *   for applying to other editors.
	 */
	store(historyId, token, op) {
		return this.lock(done => {
			/*
			 * While holding the lock, compose everything that other editors
			 * have done after the given history id. Then transform the result
			 * over this before storing and then finally resolving the promise.
			 */
			let toStore;
			this.history.from(historyId + 1)
				.then(items => {
					const type = this.history.type;

					const composer = type.newComposer();
					items.forEach(function(item) {
						composer.add(item);
					});
					const composed = composer.done();

					if(composed) {
						const transformed = type.transform(composed, op);
						toStore = transformed.right;
					} else {
						toStore = op;
					}

					return this.history.store(toStore);
				})
				.then(historyId => {
					done(null, new TaggedOperation(historyId, token, toStore));
				})
				.catch(err => done(err));
		});
	}
}

module.exports = EditorControl;
