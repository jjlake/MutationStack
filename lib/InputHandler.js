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
