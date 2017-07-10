import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { IndexPage } from "../index/index";
import { PuketeEvent } from "../../model/event";
import { enDictionary } from "../../utils/en-dictionary";
import { esDictionary } from "../../utils/es-dictionary.";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  private events: Array<PuketeEvent> = [];
  private items: Array<PuketeEvent> = [];
  private dictionary: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeStorage: NativeStorage,
    public alertCtrl: AlertController) {
    this.setDictionary();
    this.init();
  }

  setDictionary() {
    this.nativeStorage.getItem('language')
      .then(
      data => {
        switch (data) {
          case 'en':
            this.dictionary = enDictionary
            break;
          case 'es':
            this.dictionary = esDictionary
            break;
        }
      },
      error => { console.error(`Error getting the dictionary: ${error}`) });
  }

  init() {
    this.nativeStorage.keys()
      .then(
      data => {
        data.forEach((event, i) => {
          if (event !== 'language') {
            this.nativeStorage.getItem(data[i])
              .then(
              data => {
                // We contemplate the case the user has deleted the name of the list
                if (data['name'] === '') {
                  // In that case we need to add one
                  data['name'] = this.dictionary.list.noNameList;
                }
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
    this.events = this.items;
  }

  goToPuketePage(eventID) {
    this.navCtrl.setRoot(IndexPage, {
      eventID: eventID
    });
  }

  removeEvents() {
    let confirm = this.alertCtrl.create({
      title: this.dictionary.list.popups.removeEvents.title,
      buttons: [
        {
          text: this.dictionary.list.popups.removeEvents.noButton,
          handler: () => { }
        },
        {
          text: this.dictionary.list.popups.removeEvents.yesButton,
          handler: () => {
            this.nativeStorage.clear()
              .then(
              data => {
                console.info('Removed all events!');
                this.items = [];
                this.initializeItems();
              },
              error => { console.error(`Error deleting the events: ${error}`) });
          }
        }
      ]
    });
    confirm.present();
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
        return (event.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
