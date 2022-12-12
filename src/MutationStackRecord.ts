function insertAfter(newNode: Node, existingNode: Node){
    if(existingNode.parentNode)
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    else
        throw new Error("Error: Existing node has no parent node.")
}

export function reverse(record: MutationRecord){
    console.log(record)
    switch(record.type){
        case "attributes":
            if(record.target instanceof HTMLElement){
                if(record.attributeName == null)
                    throw new Error("Invalid operation: Provided attribute name is null.")
                else if(record.oldValue == null)
                    throw new Error("Invalid operation: Updated attribute value is null.")
                else
                    record.target.setAttribute(record.attributeName, record.oldValue);
            } else
                throw new Error("Invalid operation: target node is not a HTML element.");
            break;

        case "childList":
            var addedNodes = record.addedNodes;
            addedNodes.forEach(node => {
                record.target.removeChild(node);
                // node.remove();
            })
            var removedNodes = record.removedNodes;
            var previousSibling = record.previousSibling;
            var nextSibling = record.nextSibling;
            if(nextSibling){
                for(var i=removedNodes.length-1; i>=0; i--){
                    record.target.insertBefore(removedNodes[i], nextSibling);
                    nextSibling = removedNodes[i];
                }
            } else if(previousSibling){
                for(var i=0; i<removedNodes.length; i++){
                    insertAfter(removedNodes[i], previousSibling);
                    // previousSibling.after(removedNodes[i]);
                    previousSibling = removedNodes[i];
                }
            } else {
                for(var i=0; i<removedNodes.length; i++){
                    record.target.appendChild(removedNodes[i]);
                }
            }
            break;

        case "characterData":
            if(record.target instanceof CharacterData){
                if(record.oldValue == null)
                    throw new Error("Invalid operation: Updated attribute value is null.")
                else
                    record.target.data = record.oldValue;
            } else
                throw new Error("Invalid operation: target node is not a HTML element.");
    }
}