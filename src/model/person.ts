import { PuketeEvent } from "./event";

export class Person {
    public name: string;
    public inDrink: boolean = true;
    public inFood: boolean = true;
    public inOthers: boolean = true;
    public drinkAmount: number = 0;
    public foodAmount: number = 0;
    public othersAmount: number = 0;
    public expenses: number = 0;
    public balance: number = 0;

    constructor(name: string) {
        this.name = name;
    }
}