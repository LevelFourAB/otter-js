'use strict';

const NONE = 0;
const UNDOING = 1;
const REDOING = 2;

/**
 * Manager for keeping track of local operations and supporting undoing and
 * redoing those events regardless of remote operations.
 */
class UndoRedoManager {
	/**
	 * Create a new editor
	 */
	constructor(options) {
		this.maxSize = options.size || 100;
		this.type = options.editor.type;
		this.editor = options.editor;

		this._state = NONE;

		this._undoStack = [];
		this._redoStack = [];

		this._ignore = false;
		this._remoteOp = null;
	}

	_shouldCompose(previous, op) {
		// TODO: Add support to types for checking edit composing
		return false;
	}

	/**
	 * Apply a local operation to this manager.
	 */
	apply(op) {
		if(this._ignore) return;

		if(this._remoteOp) {
			this._transformUndo();
		}

		let shouldCompose = false;
		if(this._state == NONE) {
			/*
			 * If we are not currently undoing or redoing we might be able to
			 * merge this edit into the previous one.
			 */
			shouldCompose = this._undoStack.length > 0
				&& this._shouldCompose(this._undoStack[this._undoStack.length - 1], op);
		}

		const inverted = this.type.invert(op);
		if(shouldCompose) {
			let lastOp = this._undoStack.pop();
			this._undoStack.push(this.type.compose(lastOp, inverted));
		} else {
			this._undoStack.push(inverted);
		}
		this._redoStack.length = 0;

		this._state = NONE;
	}

	/**
	 * Receive a remote operation.
	 */
	receive(op) {
		// TODO: Transform both undo and redo operations against this
		if(this._remoteOp) {
			this._remoteOp = this.type.compose(this._remoteOp, op);
		} else {
			this._remoteOp = op;
		}
	}

	_transformUndo() {
		if(! this._remoteOp) return;

		this._undoStack = this._transform(this._undoStack, this._remoteOp);
		this._remoteOp = null;
	}

	_transformBoth() {
		if(! this._remoteOp) return;
		this._undoStack = this._transform(this._undoStack, this._remoteOp);
		this._redoStack = this._transform(this._redoStack, this._remoteOp);
		this._remoteOp = null;
	}

	_transform(stack, op) {
		/*
		 * Go through the stack backwards and transform operations so they
		 * are as performed on top of the last remote operation.
		 */
		for(let i=stack.length-1; i>=0; i--) {
			let transformed = this.type.transform(stack[i], op);
			stack[i] = transformed.left;
			op = transformed.right;
		}

		// TODO: Do we need to handle cases where an operation is now empty?

		return stack;
	}

	/**
	 * Get if it's possible to perform an undo.
	 */
	get canUndo() {
		return this._undoStack.length > 0;
	}

	/**
	 * Get if it's possible to perform a redo.
	 */
	get canRedo() {
		return this._redoStack.length > 0;
	}

	/**
	 * Undo the last operation.
	 */
	undo() {
		if(this._undoStack.length === 0) return;

		this._state = UNDOING;
		this._transformBoth();

		let op = this._undoStack.pop();
		const inverted = this.type.invert(op);
		this._redoStack.push(inverted);

		this._ignore = true;
		try {
			this.editor.apply(op, true);
		} finally {
			this._ignore = false;
		}
	}

	/**
	 * Redo the last operation.
	 */
	redo() {
		if(this._redoStack.length === 0) return;

		this._state = REDOING;
		this._transformBoth();

		let op = this._redoStack.pop();
		const inverted = this.type.invert(op);
		this._undoStack.push(inverted);

		this._ignore = true;
		try {
			this.editor.apply(op, true);
		} finally {
			this._ignore = false;
		}
	}
}

module.exports = UndoRedoManager;
