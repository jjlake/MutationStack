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
        this.reverseIt = this.reverseIt.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
    }
    start() {
        this.observer.observe(this.elem, config);
    }
    stop() {
        this.observer.disconnect();
    }
    reverseIt(undo) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stop(); // Stop tracking fresh mutations while redoing.
            var mutations = [];
            yield new Promise((resolve) => {
                resolve(waitForMutation(this.elem));
                undo ? this.undoStack.pop() : this.redoStack.pop();
            }).then(mutationList => {
                (undo ? this.redoStack : this.undoStack).push(mutationList);
            });
            this.start();
        });
    }
    ;
    redo() {
        if (this.redoStack.length() > 0)
            this.reverseIt(false);
        else
            throw new Error("Nothing to redo.");
    }
    undo() {
        if (this.undoStack.length() > 0)
            this.reverseIt(true);
        else
            throw new Error("Nothing to undo.");
    }
}
exports.MutationTracker = MutationTracker;
exports.default = MutationTracker;
