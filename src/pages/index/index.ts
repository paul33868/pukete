import { Component } from '@angular/core';
import { NavParams, AlertController, Platform } from "ionic-angular";
import { NativeStorage } from '@ionic-native/native-storage';
import { PuketeEvent } from "../../model/event";
import { Person } from "../../model/person";
import { SocialSharing } from "@ionic-native/social-sharing";
import { enDictionary } from "../../utils/en-dictionary";
import { esDictionary } from "../../utils/es-dictionary.";
import { Masks } from "../../utils/masks";

@Component({
  selector: 'index-page',
  templateUrl: 'index.html'
})

export class IndexPage {
  private event: PuketeEvent;
  private resultsToShare: string;
  private results: string;
  private dictionary: any;
  private currencyMask = Masks.currency;

  constructor(
    private alertCtrl: AlertController,
    private nativeStorage: NativeStorage,
    private navParams: NavParams,
    private socialSharing: SocialSharing,
    private platform: Platform) {
    this.init();
    this.setDictionary();
  }

  setDictionary() {
    this.nativeStorage.getItem('language')
      .then(
      data => {
        switch (data) {
          case 'en':
            this.dictionary = enDictionary
            break;
          case 'es':
            this.dictionary = esDictionary
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
            this.event = new PuketeEvent(new Date().getTime());
            this.addPerson();
            console.info(`New event created`);
          }
        },
        error => { console.error(`Error getting the events: ${error}`) });
    }

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
            this.event = new PuketeEvent(new Date().getTime());
          }
        }
      ]
    });
    alert.present();
  }

  addPerson() {
    let person: Person = new Person();
    this.event.persons.push(person);
    this.save();
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
    this.resultsToShare = '';
    this.results = '';

    // Reset all values
    this.event.personsForDrink = 0;
    this.event.personsForFood = 0;
    this.event.personsForOthers = 0;
    this.event.drinkAmount = 0;
    this.event.foodAmount = 0;
    this.event.othersAmount = 0;

    // Loop throug the event to get the final values
    this.event.persons.forEach(person => {
      this.event.personsForDrink += person.inDrink ? 1 : 0;
      this.event.personsForFood += person.inFood ? 1 : 0;
      this.event.personsForOthers += person.inOthers ? 1 : 0;

      // Add to the event
      this.event.drinkAmount += +person.drinkAmount;
      this.event.foodAmount += +person.foodAmount;
      this.event.othersAmount += +person.othersAmount;
    });

    // Calculate final values of the event
    this.event.totalAmount = this.event.drinkAmount + this.event.foodAmount + this.event.othersAmount;
    this.event.drinkAmountPerPerson = this.event.drinkAmount / this.event.personsForDrink;
    this.event.foodAmountPerPerson = this.event.foodAmount / this.event.personsForFood;
    this.event.othersAmountPerPerson = this.event.othersAmount / this.event.personsForOthers;

    this.event.persons.forEach(person => {
      // Reset expenses
      person.expenses = 0;
      // Add the expenses
      person.expenses += person.inDrink ? this.event.drinkAmountPerPerson : 0;
      person.expenses += person.inFood ? this.event.foodAmountPerPerson : 0;
      person.expenses += person.inOthers ? this.event.othersAmountPerPerson : 0;

      person.balance = +person.drinkAmount + +person.foodAmount + +person.othersAmount - person.expenses;

      this.results += `<div><h6 class='person-${(person.balance >= 0) ? 'gets' : 'gives'}'>
                      ${person.name} ${(person.balance >= 0) ?
          this.dictionary.index.popups.calculate.gets :
          this.dictionary.index.popups.calculate.gives}
                      : $${Math.abs(person.balance).toFixed(2)}
                      <small class='person-details'> (${this.dictionary.index.popups.calculate.spent}
                      : $${(Math.abs(+person.expenses)).toFixed(2)})</small>
                      </h6>`;

      this.resultsToShare += `${person.name} ${(person.balance >= 0) ?
        this.dictionary.index.popups.calculate.gets :
        this.dictionary.index.popups.calculate.gives}: $${Math.abs(person.balance).toFixed(2)} (${this.dictionary.index.popups.calculate.spent}: $${(Math.abs(+person.expenses)).toFixed(2)})\n`;
    });

    let alert = this.alertCtrl.create({
      title: `<small><strong>${this.dictionary.index.popups.calculate.totalFor}
             ${this.event.name ? this.event.name : this.dictionary.index.popups.calculate.theEvent}:
             $${this.event.totalAmount.toFixed(2)}<small><strong>`,
      subTitle: `<small>${this.dictionary.index.popups.calculate.drinks}:
                        $${this.event.drinkAmount.toFixed(2)}
                        ${this.event.personsForDrink === 0 ? "<span class='person-gives'>" + this.dictionary.index.popups.calculate.noConsumption + '</span>' : ''} </br>
                        ${this.dictionary.index.popups.calculate.food}:
                        $${this.event.foodAmount.toFixed(2)}
                        ${this.event.personsForFood === 0 ? "<span class='person-gives'>" + this.dictionary.index.popups.calculate.noConsumption + '</span>' : ''} </br>
                        ${this.dictionary.index.popups.calculate.others}:
                        $${this.event.othersAmount.toFixed(2)}
                        ${this.event.personsForOthers === 0 ? "<span class='person-gives'>" + this.dictionary.index.popups.calculate.noConsumption + '</span>' : ''}
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
          handler: () => { this.share() }
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
    this.save();
  }
}