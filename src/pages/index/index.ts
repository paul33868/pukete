import { Component } from '@angular/core';
import { NavParams, AlertController, Platform, ToastController } from "ionic-angular";
import { NativeStorage } from '@ionic-native/native-storage';
import { PuketeEvent } from "../../model/event";
import { Person } from "../../model/person";
import { SocialSharing } from "@ionic-native/social-sharing";
import { enDictionary } from "../../utils/en-dictionary";
import { esDictionary } from "../../utils/es-dictionary.";

@Component({
  selector: 'index-page',
  templateUrl: 'index.html'
})

export class IndexPage {
  private errorsOnTheEventsName: boolean;
  private event: PuketeEvent;
  private resultsToShare: string;
  private results: string;
  private dictionary: any;
  private language: string;
  private errorsOnTheEvent: boolean = true;

  constructor(
    private alertCtrl: AlertController,
    private nativeStorage: NativeStorage,
    private navParams: NavParams,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private toastCtrl: ToastController) {
    if (this.platform.is('cordova')) {
      this.setDictionary();
      this.init();
    }
    else {
      this.dictionary = enDictionary;
      this.language = 'en';
      this.addNewEvent();
    }
  }

  setDictionary() {
    this.nativeStorage.getItem('language')
      .then(
      data => {
        switch (data) {
          case 'en':
            this.dictionary = enDictionary;
            this.language = 'en';
            break;
          case 'es':
            this.dictionary = esDictionary;
            this.language = 'es';
            break;
        }
      },
      error => { console.error(`Error getting the dictionary: ${error}`) });
  }

  init() {
    // Check that we're coming from a selected list
    if (this.navParams.get('eventID') !== undefined) {
      this.nativeStorage.getItem(this.navParams.get('eventID'))
        .then(
        data => { this.event = data; },
        error => { console.error(`Error getting the event: ${error}`) });
    }

    // If we're not coming from a list, then retrieve the last event
    else {
      this.nativeStorage.keys()
        .then(
        data => {
          // Here we ask if it's greater than 1 becasue the language occupies the last place, and it'll always be the last item on the array of the local storage
          if (data.length > 1) {
            // If the last item is not the language
            let wantedData;
            if (data[data.length - 1] !== 'language') {
              wantedData = data[data.length - 1];
            }
            // If the last item is the language, we grab the one before
            else {
              wantedData = data[data.length - 2];
            }
            this.nativeStorage.getItem(wantedData)
              .then(
              data => { this.event = data },
              error => { console.error(`Error getting the last event: ${error}`) });
          }
          else {
            // If we don't have a last item, then, create the event
            this.addNewEvent();
          }
        },
        error => { console.error(`Error getting the events: ${error}`) });
    }

  }

  addNewEvent() {
    this.event = new PuketeEvent(new Date().getTime(), this.language);
    this.addPerson();
    console.info(`New event created`);
  }

  addEvent() {
    let alert = this.alertCtrl.create({
      title: this.dictionary.index.popups.addEvent.title,
      buttons: [
        {
          text: this.dictionary.index.popups.addEvent.noButton,
          handler: () => { return }
        },
        {
          text: this.dictionary.index.popups.addEvent.yesButton,
          handler: () => {
            this.addNewEvent();
          }
        }
      ]
    });
    alert.present();
  }

  addPerson() {
    this.errorsOnTheEvent = true;
    let person: Person = new Person(new Date().getTime());
    this.event.persons.push(person);
    if (this.platform.is('cordova')) {
      this.save();
    }
  }

  showAddPersonErrorAlert(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000
    });
    toast.present();
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
    this.resultsToShare = '';
    this.results = '';

    // Reset all values
    this.event.personsForExpense1 = 0;
    this.event.personsForExpense2 = 0;
    this.event.personsForExpense3 = 0;
    this.event.expense1Amount = 0;
    this.event.expense2Amount = 0;
    this.event.expense3Amount = 0;

    // Loop throug the event to get the final values
    this.event.persons.forEach(person => {
      this.event.personsForExpense1 += person.inExpense1 ? 1 : 0;
      this.event.personsForExpense2 += person.inExpense2 ? 1 : 0;
      this.event.personsForExpense3 += person.inExpense3 ? 1 : 0;

      // Add to the event
      this.event.expense1Amount += +person.expense1Amount;
      this.event.expense2Amount += +person.expense2Amount;
      this.event.expense3Amount += +person.expense3Amount;
    });

    // Calculate final values of the event
    this.event.totalAmount = this.event.expense1Amount + this.event.expense2Amount + this.event.expense3Amount;
    this.event.expense1AmountPerPerson = this.event.expense1Amount / this.event.personsForExpense1;
    this.event.expense2AmountPerPerson = this.event.expense2Amount / this.event.personsForExpense2;
    this.event.expense3AmountPerPerson = this.event.expense3Amount / this.event.personsForExpense3;

    this.event.persons.forEach(person => {
      // Reset expenses
      person.expenses = 0;
      // Add the expenses
      person.expenses += person.inExpense1 ? this.event.expense1AmountPerPerson : 0;
      person.expenses += person.inExpense2 ? this.event.expense2AmountPerPerson : 0;
      person.expenses += person.inExpense3 ? this.event.expense3AmountPerPerson : 0;

      person.balance = +person.expense1Amount + +person.expense2Amount + +person.expense3Amount - person.expenses;

      this.results += `<div><h6 class='person-${(person.balance >= 0) ? 'gets' : 'gives'}'>
                      ${person.name} ${(person.balance >= 0) ?
          this.dictionary.index.popups.calculate.gets :
          this.dictionary.index.popups.calculate.gives}:
                      $${Math.abs(person.balance).toFixed(2)}
                      <small class='person-details'>
                      (${this.dictionary.index.popups.calculate.spent}:
                      $${(Math.abs(+person.expenses)).toFixed(2)})</small>
                      </h6>`;

      this.resultsToShare += `${person.name} ${(person.balance >= 0) ?
        this.dictionary.index.popups.calculate.gets :
        this.dictionary.index.popups.calculate.gives}: $${Math.abs(person.balance).toFixed(2)} (${this.dictionary.index.popups.calculate.spent}: $${(Math.abs(+person.expenses)).toFixed(2)})\n`;
    });

    let alert = this.alertCtrl.create({
      title: `<small><strong>${this.dictionary.index.popups.calculate.totalFor}
             ${this.event.name ? this.event.name : this.dictionary.index.popups.calculate.theEvent}:
             $${this.event.totalAmount.toFixed(2)}<small><strong>`,
      subTitle: `<small>${this.event.expense1Label}:
                        $${this.event.expense1Amount.toFixed(2)}
                        ${this.event.personsForExpense1 === 0 ? "<span class='person-gives'>" + this.dictionary.index.popups.calculate.noConsumption + '</span>' : ''} </br>
                        ${this.event.expense2Label}:
                        $${this.event.expense2Amount.toFixed(2)}
                        ${this.event.personsForExpense2 === 0 ? "<span class='person-gives'>" + this.dictionary.index.popups.calculate.noConsumption + '</span>' : ''} </br>
                        ${this.event.expense3Label}:
                        $${this.event.expense3Amount.toFixed(2)}
                        ${this.event.personsForExpense3 === 0 ? "<span class='person-gives'>" + this.dictionary.index.popups.calculate.noConsumption + '</span>' : ''}
                </small>`,
      message: `${this.results}</div>`,
      cssClass: 'resume-alert',
      buttons: [
        {
          text: this.dictionary.index.popups.calculate.buttons.cancel,
          handler: () => { }
        },
        {
          text: this.dictionary.index.popups.calculate.buttons.share,
          handler: () => {
            if (this.platform.is('cordova')) {
              this.share()
            }
          }
        },
      ]
    });
    alert.present();
  }

  share() {
    let options = {
      message: `${this.dictionary.index.popups.share.totalFor} ${this.event.name ? this.event.name : this.dictionary.index.popups.share.theEvent}: $${this.event.totalAmount.toFixed(2)} \n` + this.resultsToShare,
      subject: `${this.dictionary.index.popups.share.totalFor} ${this.event.name ? this.event.name : this.dictionary.index.popups.share.theEvent}: $${this.event.totalAmount.toFixed(2)}`,
      files: null,
      url: null,
      chooserTitle: `${this.dictionary.index.popups.share.totalFor} ${this.event.name ? this.event.name : this.dictionary.index.popups.share.theEvent}: $${this.event.totalAmount.toFixed(2)}`,
    }

    this.socialSharing.shareWithOptions(options)
      .then(
      () => { console.info("Shared successfully") },
      (error) => { console.error(`Error sharing item: ${error}`) });
  }

  save() {
    this.nativeStorage.setItem(this.event.id.toString(), this.event)
      .then(
      () => { console.info('Stored event!') },
      (error) => { console.error(`Error storing event: ${JSON.stringify(error)}`) });
  }

  finishEditingName() {
    if (this.platform.is('cordova')) {
      this.save();
    }
  }

  checkPersonsName(selectedPerson: Person) {
    if (this.event.persons.length >= 2) {
      this.errorsOnTheEvent = false;
    }
    this.event.persons.forEach(person => {
      person.error = '';
    });
    for (var index1 = 0; index1 < this.event.persons.length; index1++) {
      for (var index2 = 1; index2 < this.event.persons.length; index2++) {
        if (this.event.persons[index1].name !== undefined && this.event.persons[index1].name !== '') {
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
        else {
          this.event.persons[index1].error = this.dictionary.index.noNameError;
          this.errorsOnTheEvent = true;
        }
      }
    }
  }

  checkEventName() {
    if (this.event.expense1Label === '' || this.event.expense2Label === '' || this.event.expense3Label === '') {
      this.errorsOnTheEventsName = true;
    }
    else {
      this.errorsOnTheEventsName = false;
    }
  }
}