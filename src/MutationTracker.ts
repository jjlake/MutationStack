import { ctrlPressed, setCtrlPressed, handleKeyUp } from "./input";
import { MutationStack } from "./MutationStack";

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

/* This class is attached to an element to maintain a record of all changes
   via undo and redo stacks. */
export class MutationTracker{
    elem: HTMLElement; // Element upon which to track and undo/redo changes.
    observer: MutationObserver;
    redoStack: MutationStack = new MutationStack();
    undoStack: MutationStack = new MutationStack();
    
    // Element input handlers.
    addListeners(){
        console.log("TEST")
        this.elem.addEventListener('keydown', this.handleKeyPress)
        this.elem.addEventListener('keyup', handleKeyUp)
    }

    constructor(elem: HTMLElement){
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
    start(){
        this.observer.observe(this.elem, config);
    }

    // Stop observing for changes via mutation observer API.
    stop(){
        this.observer.disconnect();
    }

    // Reverse a change passed from the undo or redo stacks.
    async reverse(undo: boolean){
        this.stop(); // Stop tracking fresh mutations while redoing.

        await new Promise((resolve) => {
            resolve(waitForMutation(this.elem));
            undo ? this.undoStack.pop() : this.redoStack.pop();
        }).then(mutationList =>{
            /* Add the last undone change to the redo stack 
               or the last redone change to the undo stack. */
            (undo ? this.redoStack : this.undoStack).push(mutationList as MutationRecord[]);
        });
        
        this.start();
    };

    // Pop and reverse the last change from the redo stack.
    redo(){
        if(this.redoStack.length()>0)
            this.reverse(false);
        else
            throw new Error("Nothing to redo.");
    }
    
    // Pop and reverse the last change from the undo stack.
    undo(){
        if(this.undoStack.length()>0)
            this.reverse(true);
        else
            throw new Error("Nothing to undo.");
    }

    // Handle control-y redo and control-z undo actions.
    handleCtrlCombo(event: KeyboardEvent){
        switch(event.code){
            case 'KeyY':
                event.preventDefault();
                this.redo();
                break;
            case 'KeyZ':
                event.preventDefault();
                this.undo();
                break;
        }
    };

    handleKeyPress(event: KeyboardEvent){
        if(ctrlPressed){
            this.handleCtrlCombo(event);
        } else if(event.ctrlKey){
            setCtrlPressed(true);
        }
    }




}

export default MutationTracker;