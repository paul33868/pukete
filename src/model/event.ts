import { Person } from "./person";

export class PuketeEvent {
    public id: number;
    public name: string;
    public persons: Array<Person> = [];
    public personsForExpense1: number = 0;
    public personsForExpense2: number = 0;
    public personsForExpense3: number = 0;
    public expense1Amount: number = 0;
    public expense2Amount: number = 0;
    public expense3Amount: number = 0;
    public totalAmount: number = 0;
    public expense1AmountPerPerson: number = 0;
    public expense2AmountPerPerson: number = 0;
    public expense3AmountPerPerson: number = 0;
    public expense1Label: string;
    public expense2Label: string;
    public expense3Label: string;

    public resultsToShare: string;
    public results: string;

    constructor(id: number, language: string) {
        this.id = id;
        this.persons = [];
        switch (language) {
            case 'en':
                this.expense1Label = 'Drinks';
                this.expense2Label = 'Food';
                this.expense3Label = 'Others';
                this.name = `List (${new Date().toLocaleString()})`;
                break;
            case 'es':
                this.expense1Label = 'Comida';
                this.expense2Label = 'Bebidas';
                this.expense3Label = 'Otros';
                this.name = `Lista (${new Date().toLocaleString()})`;
                break;
            default:
                break;
        }
    }
}