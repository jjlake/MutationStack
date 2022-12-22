import MutationTracker from "./MutationTracker";

export var ctrlPressed = false;

export function setCtrlPressed(pressed: boolean){
    ctrlPressed = pressed;
}

export const handleKeyUp = (event: KeyboardEvent) => {
    if(event.key=="Control")
        ctrlPressed = false;
}

