import { Component } from '@angular/core';
import { NavParams, AlertController, Platform, NavController } from "ionic-angular";
import { PuketeEvent } from "../../model/event";
import { Person } from "../../model/person";
import { ResultsPage } from "../results/results";
import { EventDetailsPage } from "../event-details/event-details";
import { trigger, style, animate, transition } from "@angular/animations";
import { DataProvider } from "../../providers/data";
declare var document;

@Component({
  selector: 'index-page',
  templateUrl: 'index.html',
  animations: [
    trigger('personCardAnimation', [
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.2s')
      ]),
      transition('* => void', [
        style({ height: '*' }),
        animate('0.4s', style({ height: 0 }))
      ])
    ])
  ]
})

export class IndexPage {
  private event: PuketeEvent;
  private results: string;
  private dictionary: any;
  private errorsOnTheEvent: boolean;
  private defaultCurrency: string;

  constructor(
    private alertCtrl: AlertController,
    private navParams: NavParams,
    private platform: Platform,
    private navCtrl: NavController,
    private dataProvider: DataProvider) {
    this.event = this.navParams.get('event');
    // If there's no person on the event, we add one by default
    if (this.event.persons.length === 0) {
      this.addPerson();
    }

    this.dataProvider.getDictionary()
      .then(dictionary => {
        this.dictionary = dictionary;
      });

    this.dataProvider.getCurrency()
      .then(currency => {
        this.defaultCurrency = currency;
      });

    this.checkEvent();
  }

  addPerson() {
    let newPerson: Person = new Person(new Date().getTime());
    this.event.expenses.forEach(eventExpense => {
      newPerson.expenses.push({
        expense: eventExpense,
        isIn: true
      });
      eventExpense.persons += 1;
    });
    this.event.persons.unshift(newPerson);
    this.save();
  }

  removePerson(person: Person) {
    this.event.persons.forEach((personInEvent, i) => {
      if (person.id === personInEvent.id) {
        let alert = this.alertCtrl.create({
          title: this.dictionary.index.popups.removePerson.title,
          buttons: [
            {
              text: this.dictionary.index.popups.removePerson.noButton,
              handler: () => { }
            },
            {
              text: this.dictionary.index.popups.removePerson.yesButton,
              handler: () => {
                this.event.persons.splice(i, 1)
                this.checkEvent();
                this.save();
              }
            }
          ]
        });
        alert.present();
      }
    });
  }

  calculate() {
    this.results = '';
    // Reset event total
    this.event.total = 0;
    this.event.expenses.forEach(expense => {
      // Reset expense values
      expense.total = 0;
      expense.totalPerPerson = 0;
      expense.persons = 0;
      this.event.persons.forEach(person => {
        // Reset person values
        person.balance = 0;
        person.totalSpent = 0;
        person.expenses.forEach(personExpense => {
          if (personExpense.amount === undefined || personExpense.amount.toString() === '') {
            personExpense.amount = 0;
          }
          if (expense.id === personExpense.expense.id) {
            // Add to the money to the event
            expense.total += +personExpense.amount;
            expense.persons += personExpense.isIn ? 1 : 0;
          }
          // Add the positive things the person bought to the balance
          person.balance += +personExpense.amount;
        });
      });
      expense.totalPerPerson = expense.total / expense.persons;
      this.event.total += expense.total;
    });

    this.event.expenses.forEach(eventExpense => {
      this.event.persons.forEach(person => {
        person.expenses.forEach(personExpense => {
          if (eventExpense.id === personExpense.expense.id) {
            person.balance -= personExpense.isIn ? +eventExpense.totalPerPerson : 0;
            person.totalSpent += personExpense.isIn ? +eventExpense.totalPerPerson : 0
          }
        });
      });
    });

    this.navCtrl.push(ResultsPage, {
      selectedEvent: this.event
    }, { animate: true, animation: 'wp-transition', direction: 'forward' });
  }

  save() {
    if (this.platform.is('cordova')) {
      this.dataProvider.saveEvent(this.event.id.toString(), this.event);
    }
  }

  checkEvent(selectedPerson?: Person, event?: any) {
    if (this.event.persons) {
      // Check event's errors
      if (this.event.persons.length >= 2) {
        this.errorsOnTheEvent = false;
      }
      else {
        this.errorsOnTheEvent = true;
      }
      // Check person's amount errors
      this.event.persons.forEach(person => {
        person.error = '';
        person.expenses.forEach(personExpense => {
          if (personExpense.amount < 0) {
            if (this.dictionary) {
              person.error = this.dictionary.index.validAmountError;
              this.errorsOnTheEvent = true;
            }
          }
        });
      });
    }
    // Check persons's errors
    if (this.event.persons) {
      for (var index1 = 0; index1 < this.event.persons.length; index1++) {
        if (this.event.persons[index1].name !== undefined && this.event.persons[index1].name !== '' && this.event.persons[index1].name.trim().length > 0) {
          for (var index2 = 1; index2 < this.event.persons.length; index2++) {
            if (this.event.persons[index2].name !== undefined && this.event.persons[index2].name !== '' && this.event.persons[index1].name.trim().length > 0) {
              if (this.event.persons[index1].id !== this.event.persons[index2].id && this.event.persons[index1].name.toLowerCase() === this.event.persons[index2].name.toLowerCase()) {
                if (this.dictionary) {
                  this.event.persons[index1].error = this.dictionary.index.alreadyHasNameError;
                  this.event.persons[index2].error = this.dictionary.index.alreadyHasNameError;
                  this.errorsOnTheEvent = true;
                }
              }
            }
            else {
              if (this.dictionary) {
                this.event.persons[index2].error = this.dictionary.index.noNameError;
                this.errorsOnTheEvent = true;
              }
            }
          }
        }
        else {
          if (this.dictionary) {
            this.event.persons[index1].error = this.dictionary.index.noNameError;
            this.errorsOnTheEvent = true;
          }
        }
      }
    }
    this.save();
  }

  editEvent(event: PuketeEvent) {
    this.navCtrl.push(EventDetailsPage, {
      selectedEvent: this.event
    }, { animate: true, animation: 'ios-transition', direction: 'forward' });
  }

  addAmountToExpense(person: Person, expenseID: number) {
    let addAmountToExpenseAlert = this.alertCtrl.create({
      title: this.dictionary.index.popups.addAmountToExpense.title,
      inputs: [
        {
          name: 'extraAmount',
          placeholder: '__.__',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: this.dictionary.index.popups.addAmountToExpense.noButton,
          handler: data => {
            console.info('Cancel adding extra amount to the expense');
          }
        },
        {
          text: this.dictionary.index.popups.addAmountToExpense.yesButton,
          handler: data => {
            person.expenses.forEach(personExpense => {
              if (personExpense.expense.id === expenseID) {
                personExpense.amount = +personExpense.amount + +data.extraAmount;
              }
              this.checkEvent();
            });
          }
        }
      ]
    });
    addAmountToExpenseAlert.present();
  }

  goToFirstExpense(event: any) {
    document.getElementById('expense-input').getElementsByTagName('input')[0].focus();
  }
}