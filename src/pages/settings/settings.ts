import { Component } from '@angular/core';
import { Nav, Events, Platform } from "ionic-angular";
import { IndexPage } from "../index/index";
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

  constructor(
    private nav: Nav,
    private nativeStorage: NativeStorage,
    private events: Events,
    private platform: Platform) {
    if (this.platform.is('cordova')) {
      this.setDictionary();
    }
    else {
      this.setLanguage('es');
    }
  }

  setDictionary() {
    this.nativeStorage.getItem('language')
      .then(
      data => {
        this.setLanguage(data);
      },
      error => { console.error(`Error getting the dictionary: ${error}`) });
  }

  selectedLanguage(language: string) {
    if (this.platform.is('cordova')) {
      this.nativeStorage.setItem('language', language)
        .then(
        () => {
          console.info('Changed language');
          this.events.publish('language:changed', language);
          this.setLanguage(language);
        },
        (error) => { console.error(`Error storing event: ${JSON.stringify(error)}`) });
    }
    else {
      this.setLanguage(language);
    }
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
}
