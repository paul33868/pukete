import { Component } from '@angular/core';
import { Nav, Events, Platform } from "ionic-angular";
import { NativeStorage } from "@ionic-native/native-storage";
import { enDictionary } from "../../utils/en-dictionary";
import { esDictionary } from "../../utils/es-dictionary";
import { ListPage } from "../list/list";

@Component({
  selector: 'help-page',
  templateUrl: 'help.html'
})
export class HelpPage {
  private language: string;
  private dictionary: any;

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
    this.nativeStorage.getItem('settings')
      .then(
      data => {
        this.setLanguage(data.language);
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

  skip() {
    this.nav.setRoot(ListPage);
  }
}
