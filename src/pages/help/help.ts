import { Component } from '@angular/core';
import { Nav, Events, Platform } from "ionic-angular";
import { IndexPage } from "../index/index";
import { NativeStorage } from "@ionic-native/native-storage";
import { enDictionary } from "../../utils/en-dictionary";

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
      this.language = 'en';
      this.dictionary = enDictionary;
    }
  }

  setDictionary() {
    this.nativeStorage.getItem('language')
      .then(
      data => { this.language = data; },
      error => { console.error(`Error getting the language: ${error}`) });
  }

  skip() {
    this.nav.setRoot(IndexPage);
  }
}
