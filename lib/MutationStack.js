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
