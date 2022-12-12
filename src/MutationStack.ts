import { reverse } from "./MutationStackRecord";

export class MutationStack{
    stack: Array<Array<MutationRecord>> = new Array<Array<MutationRecord>>();

    clear(){
        this.stack = [];
    }

    push(mutationList: Array<MutationRecord>){
        var mutationStackRecords = new Array<MutationRecord>();
        mutationList.forEach(mutationRecord => {
            mutationStackRecords.push(mutationRecord);
        });
        this.stack.push(mutationStackRecords);
    }

    pop(): Array<MutationRecord>{
        var record = this.stack.pop();
        if(record){
            record.forEach(mutation => reverse(mutation));
            return record;
        } else
            throw new Error("Error: action to undo is undefined.");

    }
}

export default MutationStack;