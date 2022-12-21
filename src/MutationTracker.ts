import { MutationStack } from "./MutationStack";
import { reverse } from "./MutationStackRecord";

const config = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
    attributeOldValue: true,
    characterDataOldValue: true
};

export async function waitForMutation(targetNode: HTMLElement){
    if(targetNode==null){
        throw new Error("Node does not exist!")
    }
    var mutationList: Array<MutationRecord> = await new Promise((resolve) => {
        new MutationObserver((mutationList, observer) => {
            resolve(mutationList);
            observer.disconnect();
        }).observe(targetNode, config);
    });
    return mutationList;
}

export class MutationTracker{
    elem: HTMLElement; // Element upon which to track and undo/redo changes.
    observer: MutationObserver;
    redoStack: MutationStack = new MutationStack();
    undoStack: MutationStack = new MutationStack();

    constructor(elem: HTMLElement){
        this.elem = elem;
        this.observer = new MutationObserver((mutationList, observer) => {
            this.redoStack.clear();
            this.undoStack.push(mutationList);
        });
        this.reverseIt = this.reverseIt.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
    }

    start(){
        this.observer.observe(this.elem, config);
    }

    stop(){
        this.observer.disconnect();
    }

    async reverseIt(undo: boolean){
        this.stop(); // Stop tracking fresh mutations while redoing.

        await new Promise((resolve) => {
            resolve(waitForMutation(this.elem));
            undo ? this.undoStack.pop() : this.redoStack.pop();
        }).then(mutationList =>{
            (undo ? this.redoStack : this.undoStack).push(mutationList as MutationRecord[]);
        });
        
        this.start();
    };

    redo(){
        if(this.redoStack.length()>0)
            this.reverseIt(false);
        else
            throw new Error("Nothing to redo.");
    }
    
    undo(){
        if(this.undoStack.length()>0)
            this.reverseIt(true);
        else
            throw new Error("Nothing to undo.");
    }
}

export default MutationTracker;