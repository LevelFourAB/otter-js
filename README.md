# Otter

Otter is a library to support collaborative realtime editing using
[Operational Transformation](https://en.wikipedia.org/wiki/Operational_transformation).
This repository contains the JavaScript-implementation.

## Using Otter

Otter consists of three parts, the operations library, the editing engine and
a high level model. The high level model is what you usually want to use
unless you are implementing something special.

### Operations

The lowest level of Otter is the operational transformation algorithms. Otter
supports transformations on maps, lists and strings. There is also a combined
type that can be used to combine several other types based on unique
identifiers. All of these transformations are used together to create the
higher level model.

### Engine

The engine contains editing control. It provides support for creating
editors on top of any supported operational transformation.


```javascript
const string = require('otter-js/operations/string');
const Editor = require('otter-js/engine/editor');

const sync = new YourOperationSync(string.newType(), ...);
const editor = new Editor(sync);

// Connect and do something with the current version
editor.connect()
	.then(() => {
		editor.current.apply(...);
		editor.on('change', function(e) {
			// This will receive all operations that occur on the editor
		});
	});


// Perform an operation
editor.apply(string.delta()
	.retain(currentStringLength)
	.insert('abc')
	.done()
);
```

Editors require a synchronization helper for sending and receiving operations
from a server. There is intentionally no default implementation of such a sync
as different applications will have different requirements here.

In the end all operations performed by an editor will end up being handled by
an instance of `EditorControl`.

```javascript
const EditorControl = require('otter-js/engine/editor-control');

const control = new EditorControl(historyStorage);

control.latest()
	.then(latestVersion => {
		// Do something with the latest version
	});


// When an operation is received from a client it needs to be stored and
// the result needs to be sent back to all clients
control.store(taggedOperation)
	.then(op => {
		// Op should be sent back to all clients
	});
```

### Model

This is the high level API that makes it easier to work with shared editing.
The model provides shared objects of different types that are synchronized
between all editors of the model.

Here is a tiny example of working with the model:

```javascript
const combined = require('otter-js/operations/combined');
const Editor = require('otter-js/engine/editor');
const Model = require('otter-js/model');

const sync = new YourOperationSync(combined.newType(), ...);
const editor = new Editor(sync);
const model = new Model(editor);

model.open()
	.then(function() {
		// Create a new string and store it in the root map
		const title = model.newString();
		title.set('Cookies are tasty');
		model.set('title', title);

		// Set a primitive value in the map
		model.set('priority', 10);
	});
```
