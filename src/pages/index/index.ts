import { Component } from '@angular/core';
import { NavParams, AlertController } from "ionic-angular";
import { NativeStorage } from '@ionic-native/native-storage';
import { PuketeEvent } from "../../model/event";
import { Person } from "../../model/person";
import { SocialSharing } from "@ionic-native/social-sharing";

@Component({
  selector: 'index-page',
  templateUrl: 'index.html'
})

export class IndexPage {
  private event: PuketeEvent;
  private resultsToShare: string;
  private results: string;

  constructor(
    private alertCtrl: AlertController,
    private nativeStorage: NativeStorage,
    private navParams: NavParams,
    private socialSharing: SocialSharing) {
    this.init();
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
          if (data.length > 0) {
            this.nativeStorage.getItem(data[data.length - 1])
              .then(
              data => { this.event = data },
              error => { console.error(`Error getting the last event: ${error}`) });
          }
          else {
            // If we don't have a last item, then, create the event
            this.event = new PuketeEvent(new Date().getTime());
          }
        },
        error => { console.error(`Error getting the events: ${error}`) });
    }

  }

  addEvent() {
    let alert = this.alertCtrl.create({
      title: 'Add new event?',
      buttons: [
        {
          text: 'No',
          handler: () => { return }
        },
        {
          text: 'Yes',
          handler: () => {
            this.event = new PuketeEvent(new Date().getTime());
          }
        }
      ]
    });
    alert.present();
  }

  addPerson() {
    let alert = this.alertCtrl.create({
      title: 'Add person',
      subTitle: 'Add name and expenses',
      inputs: [
        {
          name: 'name',
          placeholder: 'Person',
          type: 'text'
        },
        {
          name: 'drinkAmount',
          placeholder: 'Drinks',
          id: 'drinks-input',
          type: 'number',
          min: 0
        },
        {
          name: 'foodAmount',
          placeholder: 'Food',
          id: 'food-input',
          type: 'number',
          min: 0
        },
        {
          name: 'othersAmount',
          placeholder: 'Others',
          id: 'others-input',
          type: 'number',
          min: 0
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let personAlreadyExist: boolean = false;
            // First we need to check there's somebody in the event
            if (this.event.persons) {
              this.event.persons.forEach(person => {
                if (person.name.toLowerCase() !== data.name.toLowerCase()) {
                  personAlreadyExist = false;
                }
                else {
                  personAlreadyExist = true;
                }
              });
            }

            // If the person's name doesn't exist on array
            if (!personAlreadyExist) {
              let person: Person = new Person(data.name);
              person.drinkAmount = (data.drinkAmount === '' || data.drinkAmount < 0) ? 0 : +data.drinkAmount;
              person.foodAmount = (data.foodAmount === '' || data.foodAmount < 0) ? 0 : +data.foodAmount;
              person.othersAmount = (data.othersAmount === '' || data.othersAmount < 0) ? 0 : +data.othersAmount;
              this.event.persons.push(person);
              this.save();
            }
            else {
              console.log('Person already exist!');
              return;
            }
          }
        }
      ]
    });
    alert.present();
  }

  removePerson(person: Person) {
    this.event.persons.forEach((personInEvent, i) => {
      if (person.name.toLowerCase() === personInEvent.name.toLowerCase()) {
        let alert = this.alertCtrl.create({
          title: 'Remove person?',
          buttons: [
            {
              text: 'No',
              handler: () => { }
            },
            {
              text: 'Yes',
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

  editPerson(person: Person) {
    let alert = this.alertCtrl.create({
      title: 'Edit person',
      subTitle: 'Edit ' + person.name + "'s expenses",
      inputs: [
        {
          name: 'drinkAmount',
          placeholder: 'Drinks',
          type: 'number',
          id: 'drinks-input',
          value: person.drinkAmount.toString(),
          min: 0
        },
        {
          name: 'foodAmount',
          placeholder: 'Food',
          type: 'number',
          id: 'food-input',
          value: person.foodAmount.toString(),
          min: 0
        },
        {
          name: 'othersAmount',
          placeholder: 'Others',
          type: 'number',
          id: 'others-input',
          value: person.othersAmount.toString(),
          min: 0
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            person.drinkAmount = (data.drinkAmount === '' || data.drinkAmount < 0) ? 0 : +data.drinkAmount;
            person.foodAmount = (data.foodAmount === '' || data.foodAmount < 0) ? 0 : +data.foodAmount;
            person.othersAmount = (data.othersAmount === '' || data.othersAmount < 0) ? 0 : +data.othersAmount;
            this.save();
          }
        }
      ]
    });
    alert.present();
  }

  editPersonExpenses(person: Person) {
    let alert = this.alertCtrl.create({
      title: 'I am in for:',
      subTitle: 'Edit ' + person.name + "'s consumptions",
      inputs: [
        {
          type: 'checkbox',
          label: 'Drinks',
          value: 'inDrink',
          checked: person.inDrink
        },
        {
          type: 'checkbox',
          label: 'Food',
          value: 'inFood',
          checked: person.inFood
        },
        {
          type: 'checkbox',
          label: 'Others',
          value: 'inOthers',
          checked: person.inOthers
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            person.inDrink = data.includes("inDrink")
            person.inFood = data.includes("inFood")
            person.inOthers = data.includes("inOthers")
            this.save();
          }
        }
      ]
    });
    alert.present();
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

      person.balance = person.drinkAmount + person.foodAmount + person.othersAmount - person.expenses;

      this.results += `<div><h6 class='person-${(person.balance > 0) ? 'gets' : 'gives'}'> ${person.name} ${(person.balance > 0) ? ' gets ' : ' gives '} $${Math.abs(person.balance).toFixed(2)} <small class='person-details'> (Spent: $${(Math.abs(+person.expenses)).toFixed(2)})</small></h6>`;
      this.resultsToShare += `${person.name} ${(person.balance > 0) ? ' gets ' : ' gives '} $${Math.abs(person.balance).toFixed(2)} '\n'`;
    });

    let alert = this.alertCtrl.create({
      title: `<small><strong>Total for ${this.event.name ? this.event.name : 'the event'} : $${this.event.totalAmount.toFixed(2)}<small><strong>`,
      subTitle: `<small>Drinks: $${this.event.drinkAmount.toFixed(2)} ${this.event.personsForDrink === 0 ? "<span class='person-gives'>NO CONSUMPTION!</span>" : ''} - Food: $${this.event.foodAmount.toFixed(2)} ${this.event.personsForFood === 0 ? "<span class='person-gives'>NO CONSUMPTION!</span>" : ''} - Others: $${this.event.othersAmount.toFixed(2)} ${this.event.personsForOthers === 0 ? "<span class='person-gives'>NO CONSUMPTION!</span>" : ''}</small>`,
      message: `${this.results}</div>`,
      cssClass: 'resume-alert',
      buttons: [
        {
          text: 'Cancel',
          handler: () => { }
        },
        {
          text: 'Share',
          handler: () => { this.share() }
        },
      ]
    });
    alert.present();
  }

  share() {
    let options = {
      message: `'Total for ' ${this.event.name ? this.event.name : 'the event'} ': ' ${this.event.totalAmount.toFixed(2)} '\n' ${this.resultsToShare}`,
      subject: `'Total for ' ${this.event.name ? this.event.name : 'the event'} ': ' ${this.event.totalAmount.toFixed(2)}`,
      files: null,
      url: null,
      chooserTitle: `'Total for ' ${this.event.name ? this.event.name : 'the event'} ': ' ${this.event.totalAmount.toFixed(2)}`,
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
