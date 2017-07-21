import { Component } from '@angular/core';
import { Nav, Events } from "ionic-angular";
import { IndexPage } from "../index/index";
import { NativeStorage } from "@ionic-native/native-storage";

@Component({
  selector: 'help-page',
  templateUrl: 'help.html'
})
export class HelpPage {
  private language: string;

  constructor(
    private nav: Nav,
    private nativeStorage: NativeStorage,
    private events: Events) {
    this.setDictionary();
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
