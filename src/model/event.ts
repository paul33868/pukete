import { Person } from "./person";
import { Expense } from "./expense";

export class PuketeEvent {
    public id: number;
    public name: string;
    public creationDate: string;
    public persons: Array<Person> = [];
    public expenses: Array<Expense> = [];
    public total: number = 0;
    public resultsToShare: string;
    public results: string;

    constructor(id: number, language: string, defaultExpenses: Array<string>) {
        this.id = id;
        this.persons = [];
        defaultExpenses.forEach((expense, i) => {
            this.expenses.push(new Expense(expense, (new Date().getTime() + i)));
        });
        this.creationDate = new Date().toLocaleString();
    }
}