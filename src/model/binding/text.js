'use strict';

const events = [ 'input' ];

/**
 * Bind a text input or a textarea to the given {@link SharedString}.
 */
function bind(string, element) {

	let ignore = false;
	function snapshot() {
		if(ignore) return;

		string.set(element.value);
	}

	events.forEach(event => {
		ignore = true;
		try {
			element.addEventListener(event, snapshot);
		} finally {
			ignore = false;
		}
	});

	// TODO: Smarter way to track selection movememt
	string.on('insert', function(e) {
		if(e.local) return;

		let start = element.selectionStart;
		let end = element.selectionEnd;

		const length = e.value.length;

		element.value = element.value.substring(0, e.index) +
			e.value +
			element.value.substring(e.index);

		// Transform the selection
		if(start > e.index) start += length;
		if(end > e.index) end += length;

		element.selectionStart = start;
		element.selectionEnd = end;
	});

	string.on('delete', function(e) {
		if(e.local) return;

		let start = element.selectionStart;
		let end = element.selectionEnd;

		const length = e.value.length;

		element.value = element.value.substring(0, e.fromIndex) +
			element.value.substring(e.toIndex);

		// Transform the selection
		if(start > e.fromIndex) start = Math.max(e.fromIndex, start - length);
		if(end > e.fromIndex) end = Math.max(e.fromIndex, end - length);

		element.selectionStart = start;
		element.selectionEnd = end;
	});

	element.value = string.get();
}

module.exports = bind;
