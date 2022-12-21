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
    console.log("reverse");
    switch (record.type) {
        case "attributes":
            console.log("Modifying attribute: " + record.attributeName);
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
                console.log("Removing Node: " + node);
                record.target.removeChild(node);
                // node.remove();
            });
            var removedNodes = record.removedNodes;
            var previousSibling = record.previousSibling;
            var nextSibling = record.nextSibling;
            if (nextSibling) {
                for (var i = removedNodes.length - 1; i >= 0; i--) {
                    console.log("Adding Node: " + removedNodes[i]);
                    record.target.insertBefore(removedNodes[i], nextSibling);
                    nextSibling = removedNodes[i];
                }
            }
            else if (previousSibling) {
                for (var i = 0; i < removedNodes.length; i++) {
                    console.log("Adding Node: " + removedNodes[i]);
                    insertAfter(removedNodes[i], previousSibling);
                    // previousSibling.after(removedNodes[i]);
                    previousSibling = removedNodes[i];
                }
            }
            else {
                for (var i = 0; i < removedNodes.length; i++) {
                    console.log("Adding Node: " + removedNodes[i]);
                    record.target.appendChild(removedNodes[i]);
                }
            }
            break;
        case "characterData":
            if (record.target instanceof CharacterData) {
                if (record.oldValue == null)
                    throw new Error("Invalid operation: Updated attribute value is null.");
                else {
                    console.log(record.target + " changed to " + record.oldValue);
                    record.target.data = record.oldValue;
                }
            }
            else {
                console.log(record.target + " text changed to " + record.oldValue + " failed");
                throw new Error("Invalid operation: target node is not a HTML element.");
            }
    }
}
exports.reverse = reverse;
