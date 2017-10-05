import { Component } from '@angular/core';
import { Platform, NavParams } from "ionic-angular";
import { PuketeEvent } from "../../model/event";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Person } from "../../model/person";
import { trigger, style, animate, transition } from "@angular/animations";
import { DataProvider } from "../../providers/data";

@Component({
  selector: 'results-page',
  templateUrl: 'results.html',
  animations: [
    trigger('personCardAnimation', [
      transition('void => *', [
        style({ height: 0 }),
        animate('0.3s 0.1s ease-in', style({ height: '*' }))
      ]),
      transition('* => void', [
        style({ height: '*' }),
        animate('0.3s 0.1s ease-out', style({ height: 0 }))
      ])
    ])
  ]
})

export class ResultsPage {
  private dictionary: any;
  private event: PuketeEvent;
  private resultsToShare: string = '';
  private eventSing: string;
  private personIDToDisplay: number;
  private defaultCurrency: string;

  constructor(
    private navParams: NavParams,
    private platform: Platform,
    private socialSharing: SocialSharing,
    private dataProvider: DataProvider) {
    this.event = this.navParams.get('selectedEvent');
    this.eventSing = '+';

    this.dataProvider.getDictionary()
      .then(dictionary => {
        this.dictionary = dictionary;
        if (this.event.name === '' || this.event.name === undefined || this.event.name.trim().length === 0) {
          this.event.name = this.dictionary.results.noNameEvent;
        }
      });

    this.dataProvider.getCurrency()
      .then(currency => {
        this.defaultCurrency = currency;
      });
  }

  showHideEventDetails() {
    this.event.expenses[0].total
    this.eventSing = this.eventSing === '-' ? '+' : '-';
  }

  showHideExpenseDetails(person: Person) {
    this.event.persons.forEach(personInEvent => {
      if (personInEvent.id === person.id) {
        this.personIDToDisplay = person.id;
        personInEvent.arrowToDisplayed = personInEvent.arrowToDisplayed === '-' ? '+' : '-';
      }
      else {
        personInEvent.arrowToDisplayed = '+';
      }
    });
  }

  share() {
    let separator: string;
    if (this.platform.is('cordova')) {
      this.event.persons.forEach(person => {
        this.resultsToShare += `*${person.name}* ${(person.balance >= 0) ?
          this.dictionary.results.gets :
          this.dictionary.results.gives}: *${this.defaultCurrency}${Math.abs(person.balance).toFixed(2)}* (${this.dictionary.results.spentInTotal} *${this.defaultCurrency}${(Math.abs(+person.totalSpent)).toFixed(2)}*)\n`;
        separator = new Array(50).join('-');
        this.resultsToShare += `${separator}\n`;
      });

      let options = {
        message: `${this.dictionary.results.totalFor} *${this.event.name}*: *${this.defaultCurrency}${this.event.total.toFixed(2)}* \n ${separator}\n` + this.resultsToShare,
        subject: `${this.dictionary.results.totalFor} ${this.event.name}: ${this.defaultCurrency}${this.event.total.toFixed(2)}`,
        files: null,
        url: null,
        chooserTitle: `${this.dictionary.results.totalFor} ${this.event.name}: ${this.defaultCurrency}${this.event.total.toFixed(2)}`,
      }

      this.socialSharing.shareWithOptions(options)
        .then(
        () => { console.info("Shared successfully") },
        (error) => { console.error(`Error sharing item: ${error}`) });
    }
  }
}
