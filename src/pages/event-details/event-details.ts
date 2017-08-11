import { Component } from '@angular/core';
import { Nav, Events, Platform, NavParams, AlertController } from "ionic-angular";
import { NativeStorage } from "@ionic-native/native-storage";
import { enDictionary } from "../../utils/en-dictionary";
import { esDictionary } from "../../utils/es-dictionary";
import { PuketeEvent } from "../../model/event";
import { Expense } from "../../model/expense";

@Component({
  selector: 'event-details-page',
  templateUrl: 'event-details.html'
})
export class EventDetailsPage {
  private dictionary: any;
  private language: string;
  private event: PuketeEvent;
  private newEvent: string = '';
  private newEventErrorDescription: string = '';

  constructor(
    private nav: Nav,
    private nativeStorage: NativeStorage,
    private events: Events,
    private platform: Platform,
    private navParams: NavParams,
    private alertCtrl: AlertController) {
    this.event = this.navParams.get('selectedEvent');
    if (this.platform.is('cordova')) {
      this.setDictionary();
    }
    else {
      this.setLanguage('es');
    }
  }

  setDictionary() {
    this.nativeStorage.getItem('settings')
      .then(
      data => {
        this.setLanguage(data.language);
      },
      error => { console.error(`Error getting the dictionary: ${error}`) });
  }

  setLanguage(data) {
    switch (data) {
      case 'en':
        this.dictionary = enDictionary
        this.language = 'en';
        break;
      case 'es':
        this.dictionary = esDictionary
        this.language = 'es';
        break;
    }
  }

  removeExpense(expense: Expense) {
    if (this.event.expenses.length > 1) {
      this.event.expenses.forEach((expenseInEvent, i) => {
        if (expenseInEvent.id === expense.id) {
          let alert = this.alertCtrl.create({
            title: this.dictionary.eventDetails.popups.removeExpense.title,
            subTitle: this.dictionary.eventDetails.popups.removeExpense.subtitle,
            buttons: [
              {
                text: this.dictionary.eventDetails.popups.removeExpense.noButton,
                handler: () => { }
              },
              {
                text: this.dictionary.eventDetails.popups.removeExpense.yesButton,
                handler: () => {
                  this.event.expenses.splice(i, 1);
                  this.event.persons.forEach((personInEvent, i) => {
                    personInEvent.expenses.forEach((expenseInPerson, i) => {
                      if (expenseInPerson.expense.id === expense.id) {
                        personInEvent.expenses.splice(i, 1);
                      }
                    });
                  });
                  this.editEventExpenseName(this.event.expenses[0]);
                  if (this.platform.is('cordova')) {
                    this.save();
                  }
                }
              }
            ]
          });
          alert.present();
        }
      });
    }
    else {
      let alert = this.alertCtrl.create({
        title: this.dictionary.eventDetails.popups.expenseError.title,
        subTitle: this.dictionary.eventDetails.popups.expenseError.subtitle,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  addExpense() {
    let newExpense: Expense = new Expense(this.newEvent, new Date().getTime());
    this.event.expenses.push(newExpense);
    this.event.persons.forEach((personInEvent, i) => {
      personInEvent.expenses.push({
        amount: 0,
        expense: newExpense,
        isIn: true
      })
    });
    if (this.platform.is('cordova')) {
      this.save();
    }
  }

  checkNewEventName(event: any) {
    // Clear expense error
    this.newEventErrorDescription = '';
    if (event.target.value === undefined || event.target.value === '') {
      this.newEventErrorDescription = this.dictionary.eventDetails.noNameExpenseError;
    }
    this.event.expenses.forEach((expenseInEvent, i) => {
      if (expenseInEvent.name.toLowerCase() === event.target.value.toLowerCase()) {
        this.newEventErrorDescription = this.dictionary.eventDetails.alredyExpenseError;
      }
    });
  }

  editEventExpenseName(expense: Expense) {
    this.event.expenses.forEach(expense => {
      expense.error = '';
      if (expense.name === undefined || expense.name === '') {
        expense.error = this.dictionary.eventDetails.noNameExpenseError;
      }
    });
    for (var index1 = 0; index1 < this.event.expenses.length; index1++) {
      for (var index2 = 1; index2 < this.event.expenses.length; index2++) {
        if (this.event.expenses[index1].name !== undefined && this.event.expenses[index1].name !== '') {
          if (this.event.expenses[index2].name !== undefined && this.event.expenses[index2].name !== '') {
            if (this.event.expenses[index1].id !== this.event.expenses[index2].id && this.event.expenses[index1].name.toLowerCase() === this.event.expenses[index2].name.toLowerCase()) {
              this.event.expenses[index1].error = this.dictionary.eventDetails.alredyExpenseError;
              this.event.expenses[index2].error = this.dictionary.eventDetails.alredyExpenseError;
            }
          }
          else {
            this.event.expenses[index2].error = '';
          }
        }
        else {
          this.event.expenses[index1].error = '';
        }
      }
    }
    if (expense.error === '') {
      this.event.expenses.forEach((expenseInEvent, i) => {
        this.event.persons.forEach((personInEvent, i) => {
          personInEvent.expenses.forEach((expenseInPerson, i) => {
            if (expenseInPerson.expense.id === expense.id) {
              expenseInPerson.expense = expense;
            }
          });
        });
      });
      if (this.platform.is('cordova')) {
        this.save();
      }
    }
  }

  save() {
    this.nativeStorage.setItem(this.event.id.toString(), this.event)
      .then(
      () => { console.info('Stored event!') },
      (error) => { console.error(`Error storing event: ${JSON.stringify(error)}`) });
  }
}
