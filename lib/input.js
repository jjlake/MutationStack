"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleKeyUp = exports.setCtrlPressed = exports.ctrlPressed = void 0;
exports.ctrlPressed = false;
function setCtrlPressed(pressed) {
    exports.ctrlPressed = pressed;
}
exports.setCtrlPressed = setCtrlPressed;
const handleKeyUp = (event) => {
    if (event.key == "Control")
        exports.ctrlPressed = false;
};
exports.handleKeyUp = handleKeyUp;
