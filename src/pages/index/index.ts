import { Component } from '@angular/core';
import { NavParams, AlertController, Platform, NavController } from "ionic-angular";
import { NativeStorage } from '@ionic-native/native-storage';
import { PuketeEvent } from "../../model/event";
import { Person } from "../../model/person";
import { enDictionary } from "../../utils/en-dictionary";
import { esDictionary } from "../../utils/es-dictionary";
import { ResultsPage } from "../results/results";
import { EventDetailsPage } from "../event-details/event-details";

@Component({
  selector: 'index-page',
  templateUrl: 'index.html'
})

export class IndexPage {
  private event: PuketeEvent;
  private results: string;
  private dictionary: any;
  private language: string;
  private errorsOnTheEvent: boolean = true;

  constructor(
    private alertCtrl: AlertController,
    private nativeStorage: NativeStorage,
    private navParams: NavParams,
    private platform: Platform,
    private navCtrl: NavController) {
    this.event = this.navParams.get('event');
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

  addPerson() {
    this.errorsOnTheEvent = true;
    let newPerson: Person = new Person(new Date().getTime());
    this.event.expenses.forEach(eventExpense => {
      newPerson.expenses.push({
        amount: 0,
        expense: eventExpense,
        isIn: true
      });
      eventExpense.persons += 1;
    });
    this.event.persons.push(newPerson);
    if (this.platform.is('cordova')) {
      this.save();
    }
  }

  removePerson(person: Person) {
    this.event.persons.forEach((personInEvent, i) => {
      if (person.name.toLowerCase() === personInEvent.name.toLowerCase()) {
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
    });
  }

  save() {
    this.nativeStorage.setItem(this.event.id.toString(), this.event)
      .then(
      () => { console.info('Stored event!') },
      (error) => { console.error(`Error storing event: ${JSON.stringify(error)}`) });
  }

  checkEvent(selectedPerson?: Person) {
    if (this.event.persons.length >= 2 && this.event.name.length > 0) {
      this.errorsOnTheEvent = false;
    }
    else {
      this.errorsOnTheEvent = true;
    }
    this.event.persons.forEach(person => {
      person.error = '';
      person.expenses.forEach(personExpense => {
        if (personExpense.amount === undefined || personExpense.amount.toString() === '' || personExpense.amount < 0) {
          person.error = this.dictionary.index.validAmountError;
          this.errorsOnTheEvent = true;
        }
      });
    });
    for (var index1 = 0; index1 < this.event.persons.length; index1++) {
      if (this.event.persons[index1].name !== undefined && this.event.persons[index1].name !== '') {
        for (var index2 = 1; index2 < this.event.persons.length; index2++) {
          if (this.event.persons[index2].name !== undefined && this.event.persons[index2].name !== '') {
            if (this.event.persons[index1].id !== this.event.persons[index2].id && this.event.persons[index1].name.toLowerCase() === this.event.persons[index2].name.toLowerCase()) {
              this.event.persons[index1].error = this.dictionary.index.alreadyHasNameError;
              this.event.persons[index2].error = this.dictionary.index.alreadyHasNameError;
              this.errorsOnTheEvent = true;
            }
          }
          else {
            this.event.persons[index2].error = this.dictionary.index.noNameError;
            this.errorsOnTheEvent = true;
          }
        }
      }
      else {
        this.event.persons[index1].error = this.dictionary.index.noNameError;
        this.errorsOnTheEvent = true;
      }
    }
    if (this.platform.is('cordova')) {
      this.save();
    }
  }

  editEvent(event: PuketeEvent) {
    this.navCtrl.push(EventDetailsPage, {
      selectedEvent: this.event
    });
  }
}