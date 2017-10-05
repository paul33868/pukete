import { Component } from '@angular/core';
import { AlertController, Events } from "ionic-angular";
import { trigger, style, animate, transition } from "@angular/animations";
import { DataProvider } from "../../providers/data";
import { enDictionary } from "../../utils/en-dictionary";
import { esDictionary } from "../../utils/es-dictionary";
import { NativeStorage } from "@ionic-native/native-storage";
import { frDictionary } from "../../utils/fr-dictionary";

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html',
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
export class SettingsPage {
  private dictionary: any;
  private language: string;
  private defaultCurrencySymbol: string;
  private defaultExpenses: Array<string> = [];
  private newEvent: string = '';
  private newEventErrorDescription: string = '';

  constructor(
    private alertCtrl: AlertController,
    private dataProvider: DataProvider,
    private nativeStorage: NativeStorage,
    private events: Events) {
    // Fix to show the initial values on the select
    this.nativeStorage.getItem('settings')
      .then(
      data => {
        switch (data.language) {
          case 'en':
            this.dictionary = enDictionary
            break;
          case 'es':
            this.dictionary = esDictionary
            break;
          case 'fr':
            this.dictionary = frDictionary;
            break;
        }
        this.language = data.language;
        this.defaultExpenses = [this.dictionary.settings.defaultLabel1, this.dictionary.settings.defaultLabel2, this.dictionary.settings.defaultLabel3];
        this.defaultCurrencySymbol = this.dictionary.settings.currencies.default;
        this.dataProvider.save(this.language, this.defaultExpenses, this.defaultCurrencySymbol);
      },
      error => {
        console.error(`Error getting the dictionary: ${error}`);
        this.language = 'en';
        this.dictionary = enDictionary;
        this.defaultExpenses = ['Drinks', 'Food', 'Others'];
        this.defaultCurrencySymbol = '$';
      })
  }

  setData() {
    this.dataProvider.getLanguage()
      .then(language => {
        this.language = language;
        this.dataProvider.getDictionary()
          .then(dictionary => {
            this.dictionary = dictionary;
            this.dataProvider.getCurrency()
              .then(currency => {
                this.defaultCurrencySymbol = currency;
                this.dataProvider.getDefaultExpenses()
                  .then(expenses => {
                    this.defaultExpenses = expenses;
                  });
              });
          });
      });
  }

  selectedLanguage(selectedLanguage: string) {
    this.language = selectedLanguage;
    // Fix to be able to save the default expenses
    switch (this.language) {
      case 'en':
        this.defaultExpenses = [enDictionary.settings.defaultLabel1, enDictionary.settings.defaultLabel2, enDictionary.settings.defaultLabel3];
        break;
      case 'es':
        this.defaultExpenses = [esDictionary.settings.defaultLabel1, esDictionary.settings.defaultLabel2, esDictionary.settings.defaultLabel3];
        break;
      case 'fr':
        this.defaultExpenses = [frDictionary.settings.defaultLabel1, frDictionary.settings.defaultLabel2, frDictionary.settings.defaultLabel3];
        break;
    }
    this.dataProvider.save(selectedLanguage, this.defaultExpenses, this.defaultCurrencySymbol)
      .then(() => {
        this.setData();
        this.events.publish('language:changed', selectedLanguage);
      });
  }

  selectedCurrency(selectedCurrency: string) {
    this.dataProvider.save(this.language, this.defaultExpenses, selectedCurrency)
      .then(() => {
        this.setData();
      });
  }

  removeDefaultExpense(selectedExpense: string) {
    if (this.defaultExpenses.length > 1) {
      let alert = this.alertCtrl.create({
        title: this.dictionary.settings.popups.removeExpense.title,
        buttons: [
          {
            text: this.dictionary.settings.popups.removeExpense.noButton,
            handler: () => { }
          },
          {
            text: this.dictionary.settings.popups.removeExpense.yesButton,
            handler: () => {
              this.defaultExpenses.forEach((expense, i) => {
                if (selectedExpense.toLowerCase() === expense.toLowerCase()) {
                  this.defaultExpenses.splice(i, 1)
                  this.dataProvider.save(this.language, this.defaultExpenses, this.defaultCurrencySymbol)
                    .then(() => {
                      this.setData();
                    });
                }
              });
              console.info('Removed default expense: ' + event);
            }
          }
        ]
      });
      alert.present();
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

  checkNewExpenseName(event: any) {
    if (event.target) {
      // Clear expense error
      this.newEventErrorDescription = '';
      if (event.target.value === undefined || event.target.value === '') {
        this.newEventErrorDescription = this.dictionary.settings.noNameExpenseError;
      }
      this.defaultExpenses.forEach((defaultExpense, i) => {
        if (defaultExpense.toLowerCase() === event.target.value.toLowerCase()) {
          this.newEventErrorDescription = this.dictionary.settings.alredyExpenseError;
        }
      });
    }
  }

  addDefaultExpense() {
    if (this.newEvent.length > 0) {
      this.defaultExpenses.push(this.newEvent);
      this.newEvent = '';
      this.newEventErrorDescription = '';
      this.dataProvider.save(this.language, this.defaultExpenses, this.defaultCurrencySymbol)
        .then(() => {
          this.setData();
        });
    }
  }

  sendEmail() {
    window.open(`mailto:${'gil.a.pablo@gmail.com'}`, '_system');
  }
}
