require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

const mutationStack = require('mutationstack');

var tracker;

function redo(){
    tracker.redo();
}

function undo(){
    tracker.undo();
}

addEventListener("load", function(){
    var targetElem = document.getElementById("inputarea");
    tracker = new mutationStack.MutationTracker(targetElem);
    tracker.start();
});
document.getElementById("redoBtn").addEventListener("click", redo);
document.getElementById("undoBtn").addEventListener("click", undo);
},{"mutationstack":9}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputHandler = void 0;
class InputHandler {
    constructor(tracker) {
        this.handleKeyPress = (event) => {
            if (InputHandler.ctrlPressed) {
                this.handleCtrlCombo(event);
            }
            else if (event.ctrlKey) {
                InputHandler.ctrlPressed = true;
            }
        };
        this.handleKeyUp = (event) => {
            if (event.key == "Control")
                InputHandler.ctrlPressed = false;
        };
        this.tracker = tracker;
        this.addListeners();
    }
    // Element input handlers.
    addListeners() {
        this.tracker.elem.addEventListener('keydown', this.handleKeyPress);
        this.tracker.elem.addEventListener('keyup', this.handleKeyUp);
    }
    // Handle control-y redo and control-z undo actions.
    handleCtrlCombo(event) {
        switch (event.code) {
            case 'KeyY':
                event.preventDefault();
                this.tracker.redo();
                break;
            case 'KeyZ':
                event.preventDefault();
                this.tracker.undo();
                break;
        }
    }
}
exports.InputHandler = InputHandler;
InputHandler.ctrlPressed = false;
exports.default = InputHandler;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationStack = void 0;
const MutationStackRecord_1 = require("./MutationStackRecord");
class MutationStack {
    constructor() {
        this.stack = new Array();
    }
    clear() {
        this.stack = [];
    }
    push(mutationList) {
        console.log(mutationList);
        var mutationStackRecords = new Array();
        mutationList.forEach(mutationRecord => {
            mutationStackRecords.push(mutationRecord);
        });
        this.stack.push(mutationStackRecords);
    }
    pop() {
        var record = this.stack.pop();
        if (record) {
            record.reverse().forEach(mutation => (0, MutationStackRecord_1.reverse)(mutation));
            return record;
        }
        else
            throw new Error("Action to undo is undefined.");
    }
    length() {
        return this.stack.length;
    }
}
exports.MutationStack = MutationStack;
exports.default = MutationStack;

},{"./MutationStackRecord":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverse = void 0;
// A helper function to insert a node after an existing node.
function insertAfter(newNode, existingNode) {
    if (existingNode.parentNode)
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    else
        throw new Error("Error: Existing node has no parent node.");
}
function reverse(record) {
    switch (record.type) {
        // Reverse an attribute change recorded in a MutationRecord object.
        case "attributes":
            if (record.target instanceof HTMLElement) {
                if (record.attributeName == null)
                    throw new Error("Invalid operation: Provided attribute name is null.");
                else if (record.oldValue == null)
                    throw new Error("Invalid operation: Updated attribute value is null.");
                else
                    record.target.setAttribute(record.attributeName, record.oldValue);
            }
            else
                throw new Error("Invalid operation: target node is not a HTML element.");
            break;
        // Reverse a childList (DOM tree) change recorded in a MutationRecord object.
        case "childList":
            var addedNodes = record.addedNodes;
            addedNodes.forEach(node => {
                record.target.removeChild(node);
            });
            var removedNodes = record.removedNodes;
            var previousSibling = record.previousSibling;
            var nextSibling = record.nextSibling;
            // If sibling after then just use built-in insertBefore DOM 
            // modification function.
            if (nextSibling) {
                for (var i = removedNodes.length - 1; i >= 0; i--) {
                    record.target.insertBefore(removedNodes[i], nextSibling);
                    nextSibling = removedNodes[i];
                }
            } // Otherwise, child will have to be added after via helper function
            // or, failing that. as a child of the parent node.
            else if (previousSibling) {
                for (var i = 0; i < removedNodes.length; i++) {
                    insertAfter(removedNodes[i], previousSibling);
                    previousSibling = removedNodes[i];
                }
            }
            else {
                for (var i = 0; i < removedNodes.length; i++) {
                    record.target.appendChild(removedNodes[i]);
                }
            }
            break;
        // Reverse a text content changed recorded in a mutation record.
        case "characterData":
            if (record.target instanceof CharacterData) {
                if (record.oldValue == null)
                    throw new Error("Invalid operation: Updated attribute value is null.");
                else {
                    record.target.data = record.oldValue;
                }
            }
            else {
                throw new Error("Invalid operation: target node is not a HTML element.");
            }
    }
}
exports.reverse = reverse;

},{}],5:[function(require,module,exports){
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationTracker = exports.waitForMutation = void 0;
const InputHandler_1 = __importDefault(require("./InputHandler"));
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
    constructor(elem) {
        this.redoStack = new MutationStack_1.MutationStack();
        this.undoStack = new MutationStack_1.MutationStack();
        this.elem = elem;
        this.observer = new MutationObserver((mutationList, observer) => {
            this.redoStack.clear();
            this.undoStack.push(mutationList);
        });
        this.reverseIt = this.reverseIt.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.inputHandler = new InputHandler_1.default(this);
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
    reverseIt(undo) {
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
            this.reverseIt(false);
        else
            throw new Error("Nothing to redo.");
    }
    // Pop and reverse the last change from the undo stack.
    undo() {
        if (this.undoStack.length() > 0)
            this.reverseIt(true);
        else
            throw new Error("Nothing to undo.");
    }
}
exports.MutationTracker = MutationTracker;
exports.default = MutationTracker;

},{"./InputHandler":2,"./MutationStack":3}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationStack = void 0;
const MutationStackRecord_1 = require("./MutationStackRecord");
class MutationStack {
    constructor() {
        this.stack = new Array();
    }
    clear() {
        this.stack = [];
    }
    push(mutationList) {
        var mutationStackRecords = new Array();
        mutationList.forEach(mutationRecord => {
            mutationStackRecords.push(mutationRecord);
        });
        this.stack.push(mutationStackRecords);
    }
    pop() {
        var record = this.stack.pop();
        if (record) {
            record.forEach(mutation => (0, MutationStackRecord_1.reverse)(mutation));
            return record;
        }
        else
            throw new Error("Error: action to undo is undefined.");
    }
}
exports.MutationStack = MutationStack;
exports.default = MutationStack;

},{"./MutationStackRecord":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverse = void 0;
function insertAfter(newNode, existingNode) {
    if (existingNode.parentNode)
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    else
        throw new Error("Error: Existing node has no parent node.");
}
function reverse(record) {
    console.log(record);
    switch (record.type) {
        case "attributes":
            if (record.target instanceof HTMLElement) {
                if (record.attributeName == null)
                    throw new Error("Invalid operation: Provided attribute name is null.");
                else if (record.oldValue == null)
                    throw new Error("Invalid operation: Updated attribute value is null.");
                else
                    record.target.setAttribute(record.attributeName, record.oldValue);
            }
            else
                throw new Error("Invalid operation: target node is not a HTML element.");
            break;
        case "childList":
            var addedNodes = record.addedNodes;
            addedNodes.forEach(node => {
                record.target.removeChild(node);
                // node.remove();
            });
            var removedNodes = record.removedNodes;
            var previousSibling = record.previousSibling;
            var nextSibling = record.nextSibling;
            if (nextSibling) {
                for (var i = removedNodes.length - 1; i >= 0; i--) {
                    record.target.insertBefore(removedNodes[i], nextSibling);
                    nextSibling = removedNodes[i];
                }
            }
            else if (previousSibling) {
                for (var i = 0; i < removedNodes.length; i++) {
                    insertAfter(removedNodes[i], previousSibling);
                    // previousSibling.after(removedNodes[i]);
                    previousSibling = removedNodes[i];
                }
            }
            else {
                for (var i = 0; i < removedNodes.length; i++) {
                    record.target.appendChild(removedNodes[i]);
                }
            }
            break;
        case "characterData":
            if (record.target instanceof CharacterData) {
                if (record.oldValue == null)
                    throw new Error("Invalid operation: Updated attribute value is null.");
                else
                    record.target.data = record.oldValue;
            }
            else
                throw new Error("Invalid operation: target node is not a HTML element.");
    }
}
exports.reverse = reverse;

},{}],8:[function(require,module,exports){
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
const MutationStack_1 = require("./MutationStack");
const MutationStackRecord_1 = require("./MutationStackRecord");
const config = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
    attributeOldValue: true,
    characterDataOldValue: true
};
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
class MutationTracker {
    constructor(elem) {
        this.redoStack = new MutationStack_1.MutationStack();
        this.undoStack = new MutationStack_1.MutationStack();
        this.elem = elem;
        this.observer = new MutationObserver((mutationList, observer) => {
            this.redoStack.clear();
            this.undoStack.push(mutationList);
        });
    }
    start() {
        this.observer.observe(this.elem, config);
    }
    stop() {
        this.observer.disconnect();
    }
    reverse(undo) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stop(); // Stop tracking fresh mutations while redoing.
            yield new Promise((resolve) => {
                resolve(waitForMutation(this.elem));
                var records = (undo ? this.undoStack.pop() : this.redoStack.pop());
                records.reverse().forEach(record => {
                    (0, MutationStackRecord_1.reverse)(record);
                });
            }).then(record => {
                (undo ? this.redoStack : this.undoStack).push(record);
            });
            this.start();
        });
    }
    redo() { this.reverse(false); }
    undo() { this.reverse(true); }
}
exports.MutationTracker = MutationTracker;
exports.default = MutationTracker;

},{"./MutationStack":6,"./MutationStackRecord":7}],9:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./MutationTracker"), exports);

},{"./MutationTracker":8}],"diffex":[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"./MutationTracker":5,"dup":9}]},{},[1]);
