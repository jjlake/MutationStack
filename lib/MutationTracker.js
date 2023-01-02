"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationTracker = exports.waitForMutation = void 0;
const input_1 = require("./input");
const MutationStack_1 = require("./MutationStack");
const config = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
    attributeOldValue: true,
    characterDataOldValue: true
};
/* Asynchronous function that listens for mutations via the MutationObserver API
   then stops and returns the list of mutations when the callback is first invoked. */
function waitForMutation(targetNode) {
    return __awaiter(this, void 0, void 0, function* () {
        if (targetNode == null) {
            throw new Error("Node does not exist!");
        }
        var mutationList = yield new Promise((resolve) => {
            new MutationObserver((mutationList, observer) => {
                resolve(mutationList);
                observer.disconnect();
            }).observe(targetNode, config);
        });
        return mutationList;
    });
}
exports.waitForMutation = waitForMutation;
/* This class is attached to an element to maintain a record of all changes
   via undo and redo stacks. */
class MutationTracker {
    // Element input handlers.
    addListeners() {
        this.elem.addEventListener('keydown', this.handleKeyPress);
        this.elem.addEventListener('keyup', input_1.handleKeyUp);
    }
    constructor(elem) {
        this.redoStack = new MutationStack_1.MutationStack();
        this.undoStack = new MutationStack_1.MutationStack();
        this.elem = elem;
        this.observer = new MutationObserver((mutationList, observer) => {
            this.redoStack.clear();
            this.undoStack.push(mutationList);
        });
        this.reverse = this.reverse.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.addListeners = this.addListeners.bind(this);
        this.handleCtrlCombo = this.handleCtrlCombo.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.addListeners();
    }
    // Start observing for changes via mutation observer API.
    start() {
        this.observer.observe(this.elem, config);
    }
    // Stop observing for changes via mutation observer API.
    stop() {
        this.observer.disconnect();
    }
    // Reverse a change passed from the undo or redo stacks.
    reverse(undo) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stop(); // Stop tracking fresh mutations while redoing.
            yield new Promise((resolve) => {
                resolve(waitForMutation(this.elem));
                undo ? this.undoStack.pop() : this.redoStack.pop();
            }).then(mutationList => {
                /* Add the last undone change to the redo stack
                   or the last redone change to the undo stack. */
                (undo ? this.redoStack : this.undoStack).push(mutationList);
            });
            this.start();
        });
    }
    ;
    // Pop and reverse the last change from the redo stack.
    redo() {
        if (this.redoStack.length() > 0)
            this.reverse(false);
        else
            throw new Error("Nothing to redo.");
    }
    // Pop and reverse the last change from the undo stack.
    undo() {
        if (this.undoStack.length() > 0)
            this.reverse(true);
        else
            throw new Error("Nothing to undo.");
    }
    // Handle control-y redo and control-z undo actions.
    handleCtrlCombo(event) {
        switch (event.code) {
            case 'KeyY':
                event.preventDefault();
                this.redo();
                break;
            case 'KeyZ':
                event.preventDefault();
                this.undo();
                break;
        }
    }
    ;
    handleKeyPress(event) {
        if (input_1.ctrlPressed) {
            this.handleCtrlCombo(event);
        }
        else if (event.ctrlKey) {
            (0, input_1.setCtrlPressed)(true);
        }
    }
}
exports.MutationTracker = MutationTracker;
exports.default = MutationTracker;
