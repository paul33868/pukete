import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { IndexPage } from "../index/index";
import { PuketeEvent } from "../../model/event";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  private events: Array<PuketeEvent> = [];
  private items: Array<PuketeEvent> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeStorage: NativeStorage,
    public alertCtrl: AlertController) {
    this.init();
  }

  init() {
    this.nativeStorage.keys()
      .then(
      data => {
        data.forEach((event, i) => {
          this.nativeStorage.getItem(data[i])
            .then(
            data => { this.items.push(data); this.initializeItems(); },
            error => { console.error(`Error getting the event: ${error}`) });
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
      title: 'Remove all events?',
      buttons: [
        {
          text: 'No',
          handler: () => { }
        },
        {
          text: 'Yes',
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
      title: 'Remove list?',
      buttons: [
        {
          text: 'No',
          handler: () => { }
        },
        {
          text: 'Yes',
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
