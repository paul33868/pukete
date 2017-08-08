import { PuketeEvent } from "./event";
import { Person } from "./person";

export class Expense {
    public id: number;
    public name: string;
    public persons: number = 0;
    public total: number = 0;
    public totalPerPerson: number = 0;
    public error: string = '';

    constructor(name: string, id: number) {
        this.name = name;
        this.id = id;
    }
}