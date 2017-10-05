import { Component } from '@angular/core';
import { Platform, NavParams, AlertController } from "ionic-angular";
import { PuketeEvent } from "../../model/event";
import { Expense } from "../../model/expense";
import { trigger, style, animate, transition } from "@angular/animations";
import { DataProvider } from "../../providers/data";

@Component({
  selector: 'event-details-page',
  templateUrl: 'event-details.html',
  animations: [
    trigger('eventItemAnimation', [
      transition('void => *', [
        style({ transform: 'scale(0)' }),
        animate('0.4s', style({ transform: 'scale(1)' }))
      ]),
      transition('* => void', [
        style({ transform: 'scale(1)' }),
        animate('0.4s', style({ transform: 'scale(0)' }))
      ])

    ])
  ]
})
export class EventDetailsPage {
  private dictionary: any;
  private event: PuketeEvent;
  private newEvent: string = '';
  private newEventErrorDescription: string = '';

  constructor(
    private platform: Platform,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private dataProvider: DataProvider) {
    this.event = this.navParams.get('selectedEvent');
    this.dataProvider.getDictionary()
      .then(dictionary => {
        this.dictionary = dictionary;
      });
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
                  this.checkNewEventName(this.event.expenses[0]);
                  this.save();
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
    if (this.newEvent.length > 0) {
      let newExpense: Expense = new Expense(this.newEvent, new Date().getTime());
      this.event.expenses.push(newExpense);
      this.newEvent = '';
      this.newEventErrorDescription = '';
      this.event.persons.forEach((personInEvent, i) => {
        personInEvent.expenses.push({
          amount: 0,
          expense: newExpense,
          isIn: true
        })
      });
      this.save();
    }
  }

  checkNewEventName(event: any) {
    // Clear expense error
    this.newEventErrorDescription = '';
    if (event.target) {
      if (event.target.value === undefined || event.target.value === '') {
        this.newEventErrorDescription = this.dictionary.eventDetails.noNameExpenseError;
      }
      this.event.expenses.forEach((expenseInEvent, i) => {
        if (expenseInEvent.name.toLowerCase() === event.target.value.toLowerCase()) {
          this.newEventErrorDescription = this.dictionary.eventDetails.alredyExpenseError;
        }
      });
    }
  }

  save() {
    if (this.platform.is('cordova')) {
      this.dataProvider.saveEvent(this.event.id.toString(), this.event);
    }
  }
}
