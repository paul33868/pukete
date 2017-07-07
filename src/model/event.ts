import { Person } from "./person";

export class PuketeEvent {
    public id: number;
    public name: string;
    public persons: Array<Person> = [];
    public personsForDrink: number = 0;
    public personsForFood: number = 0;
    public personsForOthers: number = 0;
    public drinkAmount: number = 0;
    public foodAmount: number = 0;
    public othersAmount: number = 0;
    public totalAmount: number = 0;
    public drinkAmountPerPerson: number = 0;
    public foodAmountPerPerson: number = 0;
    public othersAmountPerPerson: number = 0;

    public resultsToShare: string;
    public results: string;

    constructor(id: number) {
        this.id = id;
        this.persons = [];
        this.name = `List (${new Date().toLocaleString()})`;
    }
}