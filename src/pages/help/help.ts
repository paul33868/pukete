import { Component } from '@angular/core';
import { Nav, Events } from "ionic-angular";
import { ListPage } from "../list/list";
import { DataProvider } from "../../providers/data";
import { enDictionary } from "../../utils/en-dictionary";

@Component({
  selector: 'help-page',
  templateUrl: 'help.html'
})
export class HelpPage {
  private dictionary: any;
  private language: string = 'en';

  constructor(
    private nav: Nav,
    private dataProvider: DataProvider,
    private events: Events) {
    // Fix to show the initial values on the select
    this.dictionary = enDictionary;
    this.setData();
  }

  setData() {
    this.dataProvider.getLanguage()
      .then(language => {
        this.language = language;
      });

    this.dataProvider.getDictionary()
      .then(dictionary => {
        this.dictionary = dictionary;
      });
  }

  skip() {
    this.nav.setRoot(ListPage);
  }

  selectedLanguage(language: string) {
    this.language = language;
    this.dataProvider.save(language)
      .then(() => {
        this.dataProvider.getDictionary()
          .then(dictionary => {
            this.dictionary = dictionary;
            this.events.publish('language:changed', language);
          });
      });
  }
}
