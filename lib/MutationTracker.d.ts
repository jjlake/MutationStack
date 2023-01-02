import { MutationStack } from "./MutationStack";
export declare function waitForMutation(targetNode: HTMLElement): Promise<MutationRecord[]>;
export declare class MutationTracker {
    elem: HTMLElement;
    observer: MutationObserver;
    redoStack: MutationStack;
    undoStack: MutationStack;
    addListeners(): void;
    constructor(elem: HTMLElement);
    start(): void;
    stop(): void;
    reverse(undo: boolean): Promise<void>;
    redo(): void;
    undo(): void;
    handleCtrlCombo(event: KeyboardEvent): void;
    handleKeyPress(event: KeyboardEvent): void;
}
export default MutationTracker;
