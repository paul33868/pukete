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

    constructor(id: number, language: string) {
        this.id = id;
        this.persons = [];
        switch (language) {
            case 'en':
                this.expenses.push(new Expense('Drinks', new Date().getTime()));
                this.expenses.push(new Expense('Food', (new Date().getTime() + 1)));
                this.expenses.push(new Expense('Others', (new Date().getTime() + 2)));
                this.name = 'My new event';
                break;
            case 'es':
                this.expenses.push(new Expense('Comida', new Date().getTime()));
                this.expenses.push(new Expense('Bebidas', new Date().getTime() + 1));
                this.expenses.push(new Expense('Otros', new Date().getTime() + 2));
                this.name = 'Mi nuevo evento';
                break;
            default:
                break;
        }
        this.creationDate = new Date().toLocaleString();
    }
}