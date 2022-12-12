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
    }

    start(){
        this.observer.observe(this.elem, config);
    }

    stop(){
        this.observer.disconnect();
    }

    async reverse(undo: boolean){
        this.stop(); // Stop tracking fresh mutations while redoing.
        await new Promise((resolve) => {
            resolve(waitForMutation(this.elem));
            var records = (undo ? this.undoStack.pop() : this.redoStack.pop());
            records.reverse().forEach( record => {
                reverse(record);
            })
        }).then( record => {
            (undo ? this.redoStack : this.undoStack).push(record as Array<MutationRecord>);
        })
        this.start();
    }

    redo(){ this.reverse(false) }
    
    undo(){ this.reverse(true) }

}

export default MutationTracker;