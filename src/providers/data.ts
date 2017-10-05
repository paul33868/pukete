import { Injectable } from '@angular/core';
import { enDictionary } from "../utils/en-dictionary";
import { esDictionary } from "../utils/es-dictionary";
import { NativeStorage } from "@ionic-native/native-storage";
import { PuketeEvent } from "../model/event";
import { frDictionary } from "../utils/fr-dictionary";

@Injectable()
export class DataProvider {
  private dictionary: any;

  constructor(
    private nativeStorage: NativeStorage) { }

  getLanguage(): any {
    return this.nativeStorage.getItem('settings')
      .then(
      data => {
        return data.language;
      },
      error => {
        console.error(`Error getting the dictionary: ${error}`);
        // If there's an error, we return english language or the platform is not cordova...
        return 'en';
      })
  }

  getDictionary(): any {
    return this.getLanguage()
      .then(language => {
        switch (language) {
          case 'en':
            this.dictionary = enDictionary;
            break;
          case 'es':
            this.dictionary = esDictionary;
            break;
          case 'fr':
            this.dictionary = frDictionary;
            break;
        }
        return this.dictionary
      })
  }

  getCurrency(): any {
    return this.nativeStorage.getItem('settings')
      .then(
      data => {
        return data.defaultCurrencySymbol;
      },
      error => {
        console.error(`Error getting the dictionary: ${error}`);
        // If there's an error, we return $ sing or the platform is not cordova...
        return '$';
      })
  }

  getDefaultExpenses(): any {
    return this.nativeStorage.getItem('settings')
      .then(
      data => {
        return data.defaultExpenses;
      },
      error => {
        console.error(`Error getting the dictionary: ${error}`);
        // If there's an error, we return $ sing or the platform is not cordova...
        return ['Drinks', 'Food', 'Others'];
      })
  }

  save(selectedLanguage?: string, expenses?: Array<string>, currencySymbol?: string) {
    return this.nativeStorage.setItem('settings', { language: selectedLanguage, defaultExpenses: expenses, defaultCurrencySymbol: currencySymbol })
      .then(
      () => {
        console.info('Changed language');
      },
      (error) => {
        console.error(`Error storing event: ${JSON.stringify(error)}`);
      });
  }

  saveEvent(eventID: string, event: PuketeEvent) {
    this.nativeStorage.setItem(eventID, event)
      .then(
      () => { console.info('Stored event!') },
      (error) => { console.error(`Error storing event: ${JSON.stringify(error)}`) });
  }

  getEvent(eventID: string) {
    return this.nativeStorage.getItem(eventID)
      .then(
      data => {
        return data;
      },
      error => { console.error(`Error getting the event: ${error}`) });
  }
}
