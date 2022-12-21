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
