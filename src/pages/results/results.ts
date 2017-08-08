import { Component } from '@angular/core';
import { Nav, Events, Platform, NavParams } from "ionic-angular";
import { IndexPage } from "../index/index";
import { NativeStorage } from "@ionic-native/native-storage";
import { enDictionary } from "../../utils/en-dictionary";
import { esDictionary } from "../../utils/es-dictionary";
import { PuketeEvent } from "../../model/event";
import { SocialSharing } from "@ionic-native/social-sharing";

@Component({
  selector: 'results-page',
  templateUrl: 'results.html'
})
export class ResultsPage {
  private dictionary: any;
  private language: string;
  private event: PuketeEvent;
  private resultsToShare: string;
  private no

  constructor(
    private nav: Nav,
    private navParams: NavParams,
    private nativeStorage: NativeStorage,
    private events: Events,
    private platform: Platform,
    private socialSharing: SocialSharing) {
    this.event = this.navParams.get('selectedEvent');
    if (this.platform.is('cordova')) {
      this.setDictionary();
    }
    else {
      this.setLanguage('es');
    }
  }

  checkNoCunsumption() {
    this.event.expenses.forEach(expense => {
      if (expense.persons === 0) {

      }
    });
  }

  setDictionary() {
    this.nativeStorage.getItem('language')
      .then(
      data => {
        this.setLanguage(data);
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

  share() {
    if (this.platform.is('cordova')) {
      this.event.persons.forEach(person => {
        this.resultsToShare += `${person.name} ${(person.balance >= 0) ?
          this.dictionary.results.gets :
          this.dictionary.results.gives}: $${Math.abs(person.balance).toFixed(2)} (${this.dictionary.results.spentInTotal}: $${(Math.abs(+person.totalSpent)).toFixed(2)})\n`;
      });

      let options = {
        message: `${this.dictionary.results.totalFor} ${this.event.name}: $${this.event.total.toFixed(2)} \n` + this.resultsToShare,
        subject: `${this.dictionary.results.totalFor} ${this.event.name}: $${this.event.total.toFixed(2)}`,
        files: null,
        url: null,
        chooserTitle: `${this.dictionary.results.totalFor} ${this.event.name}: $${this.event.total.toFixed(2)}`,
      }

      this.socialSharing.shareWithOptions(options)
        .then(
        () => { console.info("Shared successfully") },
        (error) => { console.error(`Error sharing item: ${error}`) });
    }
  }
}
