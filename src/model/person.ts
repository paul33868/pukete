import { PuketeEvent } from "./event";

export class Person {
    public id: number;
    public name: string;
    public inExpense1: boolean = true;
    public inExpense2: boolean = true;
    public inExpense3: boolean = true;
    public expense1Amount: number = 0;
    public expense2Amount: number = 0;
    public expense3Amount: number = 0;
    public expenses: number = 0;
    public balance: number = 0;
    public error: string = '';

    constructor(createdID: number) {
        this.id = createdID;
    }
}