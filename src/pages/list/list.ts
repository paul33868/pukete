import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { IndexPage } from "../index/index";
import { PuketeEvent } from "../../model/event";
import { enDictionary } from "../../utils/en-dictionary";
import { esDictionary } from "../../utils/es-dictionary";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  private events: Array<PuketeEvent> = [];
  private items: Array<PuketeEvent> = [];
  private dictionary: any;
  private language: string;
  private defaultExpenses: Array<string>;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private nativeStorage: NativeStorage,
    private alertCtrl: AlertController,
    private platform: Platform) {
  }

  ionViewWillEnter() {
    if (this.platform.is('cordova')) {
      this.setDictionary();
      this.init();
    }
    else {
      this.setLanguage('es');
      this.defaultExpenses = [this.dictionary.settings.defaultLabel1, this.dictionary.settings.defaultLabel2, this.dictionary.settings.defaultLabel3];
    }
  }

  setDictionary() {
    this.nativeStorage.getItem('settings')
      .then(
      data => {
        this.setLanguage(data.language);
        this.defaultExpenses = data.defaultExpenses;
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

  init() {
    this.nativeStorage.keys()
      .then(
      data => {
        data.forEach((event, i) => {
          if (event !== 'settings' && event !== 'language') {
            this.items = [];
            this.nativeStorage.getItem(data[i])
              .then(
              data => {
                this.items.push(data);
                this.initializeItems();
              },
              error => { console.error(`Error getting the event: ${error}`) });
          }
        });
      },
      error => console.error(error)
      );
  }

  initializeItems() {
    this.events = [];
    this.events = this.items;
  }

  goToPage(selectedEvent: PuketeEvent) {
    this.navCtrl.push(IndexPage, {
      event: selectedEvent
    });
  }

  addEvent() {
    let event = new PuketeEvent(new Date().getTime(), this.language, this.defaultExpenses);
    console.info(`New event created`);
    if (this.platform.is('cordova')) {
      this.nativeStorage.setItem(event.id.toString(), event)
        .then(
        () => { console.info('Stored event!') },
        (error) => { console.error(`Error storing event: ${JSON.stringify(error)}`) });
    }
    this.goToPage(event);
  }

  removeEvent(event: PuketeEvent) {
    let alert = this.alertCtrl.create({
      title: this.dictionary.list.popups.removeEvent.title,
      buttons: [
        {
          text: this.dictionary.list.popups.removeEvent.noButton,
          handler: () => { }
        },
        {
          text: this.dictionary.list.popups.removeEvent.yesButton,
          handler: () => {
            this.nativeStorage.remove(event.id.toString())
              .then(
              data => {
                this.items.forEach((PuketeEvent, i) => {
                  if (event.id === PuketeEvent.id) {
                    this.items.splice(i, 1)
                  }
                });
                console.info('Removed event ID: ' + event);
                this.initializeItems();
              },
              (error) => { console.error(`Error deleting event: ${error}`) });
          }
        }
      ]
    });
    alert.present();
  }

  getEvents(ev: any) {
    this.initializeItems();
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.events = this.events.filter((event) => {
        return (event.name.toLowerCase().indexOf(val.toLowerCase()) > -1 || event.creationDate.indexOf(val) > -1);
      })
    }
  }
}
