export declare class MutationStack {
    stack: Array<Array<MutationRecord>>;
    clear(): void;
    push(mutationList: Array<MutationRecord>): void;
    pop(): Array<MutationRecord>;
    length(): number;
}
export default MutationStack;
