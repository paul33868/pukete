import { Component } from '@angular/core';
import { AlertController, ModalController, NavParams } from "ionic-angular";
import { SocialSharing } from '@ionic-native/social-sharing';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'index-page',
  templateUrl: 'index.html'
})
export class IndexPage {
  private persons: Array<Object> = [];
  private results;
  private resultsToShare;
  private eventName: string;

  constructor(
    public alertCtrl: AlertController,
    public socialSharing: SocialSharing,
    public modalCtrl: ModalController,
    private nativeStorage: NativeStorage,
    public navParams: NavParams
  ) {
    if (navParams.get('list') !== undefined) {
      this.eventName = navParams.get('list');
      this.nativeStorage.getItem(navParams.get('list'))
        .then(
        data => {
          this.persons = data;
        },
        error => console.error(error)
        );
    }
    else {
      this.nativeStorage.keys()
        .then(
        data => {
          if (data.length > 0) {
            this.eventName = data[data.length - 1];
            this.nativeStorage.getItem(data[data.length - 1])
              .then(
              data => {
                this.persons = data;
              },
              error => console.error(error)
              );
          }
        },
        error => console.error(error)
        );
    }
  }

  removePerson(person) {
    let confirm;
    for (let i = 0; i < this.persons.length; i++) {
      if (this.persons[i] == person) {
        confirm = this.alertCtrl.create({
          title: 'Remove person?',
          buttons: [
            {
              text: 'No',
              handler: () => {
                console.log('No clicked');
              }
            },
            {
              text: 'Yes',
              handler: () => {
                this.persons.splice(i, 1);
              }
            }
          ]
        });
      }
    }
    confirm.present();
  }

  editPerson(person) {
    for (let i = 0; i < this.persons.length; i++) {
      if (this.persons[i] == person) {
        let prompt = this.alertCtrl.create({
          title: 'Edit person',
          subTitle: 'Edit ' + person.person + "'s expenses",
          inputs: [
            {
              name: 'drinksMoney',
              placeholder: 'Drinks',
              type: 'number',
              id: 'drinks-input',
              value: person.drinksMoney,
              min: 0
            },
            {
              name: 'foodMoney',
              placeholder: 'Food',
              type: 'number',
              id: 'food-input',
              value: person.foodMoney,
              min: 0
            },
            {
              name: 'othersMoney',
              placeholder: 'Others',
              type: 'number',
              id: 'others-input',
              value: person.othersMoney,
              min: 0
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Save',
              handler: data => {
                if (data.drinksMoney === '' || data.drinksMoney < 0) {
                  data.drinksMoney = 0;
                }
                if (data.foodsMoney === '' || data.foodsMoney < 0) {
                  data.foodsMoney = 0;
                }
                if (data.othersMoney === '' || data.othersMoney < 0) {
                  data.othersMoney = 0;
                }

                this.persons[i]['person'] = person['person'];
                this.persons[i]['drinksMoney'] = +data.drinksMoney;
                this.persons[i]['foodMoney'] = +data.foodMoney;
                this.persons[i]['othersMoney'] = +data.othersMoney;
                this.persons[i]['balance'] = +data.drinksMoney + +data.foodMoney + +data.othersMoney;
              }
            }
          ]
        });
        prompt.present();
      }
    }

  }

  addPerson() {
    let prompt = this.alertCtrl.create({
      title: 'Add person',
      subTitle: 'Add name and expenses',
      inputs: [
        {
          name: 'person',
          placeholder: 'Person',
          type: 'text'
        },
        {
          name: 'drinksMoney',
          placeholder: 'Drinks',
          id: 'drinks-input',
          type: 'number',
          min: 0
        },
        {
          name: 'foodMoney',
          placeholder: 'Food',
          id: 'food-input',
          type: 'number',
          min: 0
        },
        {
          name: 'othersMoney',
          placeholder: 'Others',
          id: 'others-input',
          type: 'number',
          min: 0
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            let personAlreadyExist: boolean = false;
            for (let i = 0; i < this.persons.length; i++) {
              if (this.persons[i]['person'].toLowerCase() !== data.person.toLowerCase()) {
                personAlreadyExist = false;
              }
              else {
                personAlreadyExist = true;
                return;
              }
            }
            if (data.drinksMoney === '' || data.drinksMoney < 0) {
              data.drinksMoney = 0;
            }
            if (data.foodsMoney === '' || data.foodsMoney < 0) {
              data.foodsMoney = 0;
            }
            if (data.othersMoney === '' || data.othersMoney < 0) {
              data.othersMoney = 0;
            }
            if (!personAlreadyExist) {
              data.drinksMoney = +data.drinksMoney;
              data.foodMoney = +data.foodMoney;
              data.othersMoney = +data.othersMoney;
              data.drinks = true;
              data.food = true;
              data.others = true;
              data.balance = +data.drinksMoney + +data.foodMoney + +data.othersMoney
              this.persons.push(data);
            }
            else {
              console.log('Person already exist!');
            }
          }
        }
      ]
    });
    prompt.present();
  }

  calculate() {
    let totalDrinks = 0;
    let peopleDrinks = 0;
    let totalFood = 0;
    let peopleFood = 0;
    let totalOthers = 0;
    let peopleOthers = 0;
    this.results = '<div>';
    this.resultsToShare = '';
    for (let i = 0; i < this.persons.length; i++) {
      totalDrinks = totalDrinks + +this.persons[i]['drinksMoney'];
      totalFood = totalFood + +this.persons[i]['foodMoney'];
      totalOthers = totalOthers + +this.persons[i]['othersMoney'];
      if (this.persons[i]['drinks']) {
        peopleDrinks = peopleDrinks + 1;
      }
      if (this.persons[i]['food']) {
        peopleFood = peopleFood + 1;
      }
      if (this.persons[i]['others']) {
        peopleOthers = peopleOthers + 1;
      }
    }
    let peopleDrinksPerPerson = (totalDrinks / peopleDrinks);
    let peopleFoodPerPerson = (totalFood / peopleFood);
    let peopleOthersPerPerson = (totalOthers / peopleOthers);
    this.persons.forEach(person => {
      let personalBalance = +person['balance'];
      if (person['drinks']) {
        personalBalance = personalBalance - peopleDrinksPerPerson;
      }
      if (person['food']) {
        personalBalance = personalBalance - peopleFoodPerPerson;
      }
      if (person['others']) {
        personalBalance = personalBalance - peopleOthersPerPerson;
      }
      if (personalBalance > 0) {
        this.results += "<h6 class='person-gets'>" + person['person'] + ' gets $ ' + Math.abs(personalBalance).toFixed(2)
          + "<small class='person-details'> (Spent: $" + (Math.abs(+person['balance'] - personalBalance)).toFixed(2) + ')</small>' + '</h6>';
        this.resultsToShare += person['person'] + ' gets $' + Math.abs(personalBalance).toFixed(2) + '\n'
      }
      else {
        this.results += "<h6 class='person-gives'>" + person['person'] + ' gives $ ' + Math.abs(personalBalance).toFixed(2)
          + "<small class='person-details'> (Spent: $" + (Math.abs(+person['balance'] - personalBalance)).toFixed(2) + ')</small>' + '</h6>';
        this.resultsToShare += person['person'] + ' gives $' + Math.abs(personalBalance).toFixed(2) + '\n'
      }
    });

    let finalMessage = this.eventName !== '' ? ' for ' + this.eventName : '';
    let final = this.alertCtrl.create({
      title: '<small><strong>' + 'Total: $' + (totalDrinks + totalFood + totalOthers).toFixed(2) + finalMessage + '<small><strong>',
      subTitle: '<small>' + 'Drinks: $' + totalDrinks.toFixed(2) + ' - ' + 'Food: $' + totalFood.toFixed(2) + ' - ' + 'Others: $' + totalOthers.toFixed(2) + '</small>',
      message: this.results + '</div>',
      cssClass: 'resume-alert',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Share',
          handler: () => {
            this.share();
          }
        }
      ]
    });
    final.present();
    this.saveList();
  }

  share() {
    var options = {
      message: this.resultsToShare,
      subject: this.eventName,
      files: null,
      url: null,
      chooserTitle: this.eventName
    }

    this.socialSharing.shareWithOptions(options)
      .then(() => {
        console.log("done")
      },
      (err) => {
        console.log(err);
        console.log("not done")
      });
  }

  editExpenses(person) {
    let alert = this.alertCtrl.create();
    alert.setTitle('I am in for:');

    alert.addInput({
      type: 'checkbox',
      label: 'Drinks',
      value: 'drinks',
      checked: person.drinks
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Food',
      value: 'food',
      checked: person.food
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Others',
      value: 'others',
      checked: person.others
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        for (let i = 0; i < this.persons.length; i++) {
          if (this.persons[i] == person) {
            this.persons[i]['drinks'] = data.includes("drinks");
            this.persons[i]['food'] = data.includes("food");
            this.persons[i]['others'] = data.includes("others");
          }
        }
      }
    });
    alert.present();
  }

  saveList() {
    let listName = this.eventName !== undefined ? this.eventName : 'List ' + '(' + new Date().toLocaleString() + ')';
    this.nativeStorage.setItem(listName, this.persons)
      .then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
      );
  }

  clearList() {
    this.persons = [];
  }
}
