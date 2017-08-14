
import { Expense } from "./expense";

export class Person {
    public id: number;
    public name: string;
    public expenses: Array<{ amount?: number, expense: Expense, isIn: boolean }> = [];
    public totalSpent: number = 0;
    public balance: number = 0;
    public error: string = '';
    public arrowToDisplayed: string = 'arrow-dropdown-circle';

    constructor(createdID: number) {
        this.id = createdID;
    }
}