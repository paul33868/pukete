import { Component } from '@angular/core';
import { Nav, Events } from "ionic-angular";
import { IndexPage } from "../index/index";
import { NativeStorage } from "@ionic-native/native-storage";
import { enDictionary } from "../../utils/en-dictionary";
import { esDictionary } from "../../utils/es-dictionary.";

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  private dictionary: any;
  private language: string;

  constructor(
    private nav: Nav,
    private nativeStorage: NativeStorage,
    private events: Events) {
    this.setDictionary();
  }

  private setDictionary() {
    this.nativeStorage.getItem('language')
      .then(
      data => {
        this.setLanguage(data);
      },
      error => { console.error(`Error getting the dictionary: ${error}`) });
  }

  private selectedLanguage(language: string) {
    this.nativeStorage.setItem('language', language)
      .then(
      () => {
        console.info('Changed language');
        this.events.publish('language:changed', language);
        this.setLanguage(language);
      },
      (error) => { console.error(`Error storing event: ${JSON.stringify(error)}`) });
  }

  private setLanguage(data) {
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
}
