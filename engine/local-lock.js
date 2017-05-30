'use strict';

const doLater = typeof setImmediate === 'undefined' ? setTimeout : setImmediate;

/**
 * This is an implementation of a lock that queues up requests to acquire
 * the lock.
 */
class LocalLock {
	constructor() {
		this.queue = [];
		this.acquired = false;
	}

	acquire(cb) {
		return new Promise((resolve, reject) => {
			if(this.acquired) {
				this.queue.push({
					callback: cb,
					resolve: resolve,
					reject: reject
				});
				return;
			}

			this.acquired = true;

			cb(this._createdDoneCallback(resolve, reject));
		});
	}

	_createdDoneCallback(resolve, reject) {
		let used = false;
		return (err, result) => {
			if(used) return;

			if(err !== null) {
				reject(err);
			} else {
				resolve(result);
			}

			used = true;
			if(this.queue.length === 0) {
				this.acquired = false;
			} else {
				let next = this._queue[0];
				this.queue.splice(0, 1);

				doLater(function() {
					const done = this._createdDoneCallback(next.resolve, next.reject);
					next.callback(done);
				});
			}
		};
	}
}

module.exports = function() {
	const lock = new LocalLock();

	return function(cb) {
		return lock.acquire(cb);
	};
};
