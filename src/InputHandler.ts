import MutationTracker from "./MutationTracker";

export class InputHandler {
    static ctrlPressed = false;

    tracker: MutationTracker;

    constructor(tracker: MutationTracker){
        this.tracker = tracker;
        this.addListeners();
    }

    // Element input handlers.
    addListeners(){
        this.tracker.elem.addEventListener('keydown', this.handleKeyPress)
        this.tracker.elem.addEventListener('keyup', this.handleKeyUp)
    }

    // Handle control-y redo and control-z undo actions.
    handleCtrlCombo(event: KeyboardEvent){                
        switch(event.code){
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
    
    handleKeyPress = (event: KeyboardEvent) => {
        if(InputHandler.ctrlPressed){
            this.handleCtrlCombo(event);
        } else if(event.ctrlKey){
            InputHandler.ctrlPressed = true;
        }
    }
    
    handleKeyUp = (event: KeyboardEvent) => {
        if(event.key=="Control")
            InputHandler.ctrlPressed = false;
    }
}

export default InputHandler;