import { Component } from '@angular/core';
import { Nav } from "ionic-angular";
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
    private nativeStorage: NativeStorage) {
    this.setDictionary()
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

  selectedLanguage(language: string) {
    this.nativeStorage.setItem('language', language)
      .then(
      () => { console.info('Changed language') },
      (error) => { console.error(`Error storing event: ${JSON.stringify(error)}`) });
  }
}
