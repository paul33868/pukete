import { Component } from '@angular/core';
import { Nav, Events, Platform, AlertController } from "ionic-angular";
import { NativeStorage } from "@ionic-native/native-storage";
import { enDictionary } from "../../utils/en-dictionary";
import { esDictionary } from "../../utils/es-dictionary";

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  private dictionary: any;
  private language: string;
  private defaultExpenses: Array<string> = [];
  private newEvent: string = '';
  private newEventErrorDescription: string = '';

  constructor(
    private nav: Nav,
    private nativeStorage: NativeStorage,
    private events: Events,
    private platform: Platform,
    private alertCtrl: AlertController) {
    if (this.platform.is('cordova')) {
      this.setDictionary();
    }
    else {
      this.setLanguage('es');
      this.defaultExpenses = [this.dictionary.settings.defaultLabel1, this.dictionary.settings.defaultLabel2, this.dictionary.settings.defaultLabel3];
    }
  }

  setDictionary() {
    this.nativeStorage.getItem('settings')
      .then(
      data => {
        this.setLanguage(data.language);
        this.defaultExpenses = data.defaultExpenses;
      },
      error => { console.error(`Error getting the dictionary: ${error}`) });
  }

  selectedLanguage(selectedLanguage: string) {
    // Changed the default labels
    let expenses: Array<string> = [];
    this.setLanguage(selectedLanguage);
    expenses = [this.dictionary.settings.defaultLabel1, this.dictionary.settings.defaultLabel2, this.dictionary.settings.defaultLabel3];
    this.save(selectedLanguage, expenses);
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

  removeDefaultExpense(selectedExpense: string) {
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
              }
            });
            console.info('Removed default expense: ' + event);
            this.save(this.language, this.defaultExpenses);
          }
        }
      ]
    });
    alert.present();
  }

  save(selectedLanguage?: string, expenses?: Array<string>) {
    if (this.platform.is('cordova')) {
      this.nativeStorage.setItem('settings', { language: selectedLanguage, defaultExpenses: expenses })
        .then(
        () => {
          console.info('Changed language');
          this.events.publish('language:changed', selectedLanguage);
          this.setLanguage(selectedLanguage);
        },
        (error) => { console.error(`Error storing event: ${JSON.stringify(error)}`) });
    }
    else {
      this.setLanguage(selectedLanguage);
    }
  }

  checkNewEventName(event: any) {
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

  addDefaultExpense() {
    this.defaultExpenses.push(this.newEvent);
    if (this.platform.is('cordova')) {
      this.save(this.language, this.defaultExpenses);
    }
  }
}
