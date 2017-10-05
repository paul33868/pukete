import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { IndexPage } from "../index/index";
import { PuketeEvent } from "../../model/event";
import { trigger, style, animate, transition } from "@angular/animations";
import { DataProvider } from "../../providers/data";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  animations: [
    trigger('eventItemAnimation', [
      transition('void => *', [
        style({ transform: 'scale(0)' }),
        animate('0.2s', style({ transform: 'scale(1)' }))
      ]),
      transition('* => void', [
        style({ transform: 'scale(1)' }),
        animate('0.2s', style({ transform: 'scale(0)' }))
      ])
    ]),
    trigger('noPersonImageAnimation', [
      transition('void => *', [
        style({ transform: 'translateY(150%)' }),
        animate('0.5s 0.5s')
      ])
    ])
  ]
})
export class ListPage {
  private events: Array<PuketeEvent> = [];
  private items: Array<PuketeEvent> = [];
  private dictionary: any;
  private language: string;
  private defaultExpenses: Array<string>;

  constructor(
    private navCtrl: NavController,
    private nativeStorage: NativeStorage,
    private alertCtrl: AlertController,
    private platform: Platform,
    private dataProvider: DataProvider) { }

  ionViewWillEnter() {
    this.setData();
  }

  setData() {
    this.dataProvider.getDictionary()
      .then(dictionary => {
        this.dictionary = dictionary;
        this.dataProvider.getDefaultExpenses()
          .then(expenses => {
            this.defaultExpenses = expenses;
            this.init();
          });
      });
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
                if (data['name'] === '' || data['name'] === undefined || data['name'].trim().length === 0) {
                  data['name'] = this.dictionary.list.noNameEvent;
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
    this.events = [];
    this.events = this.items;
  }

  goToPage(selectedEvent: PuketeEvent) {
    this.navCtrl.push(IndexPage, {
      event: selectedEvent
    }, { animate: true, animation: 'ios-transition', direction: 'forward' });
  }

  addEvent() {
    console.log(this.defaultExpenses);
    let event = new PuketeEvent(new Date().getTime(), this.language, this.defaultExpenses);
    console.info(`New event created`);
    if (this.platform.is('cordova')) {
      this.dataProvider.saveEvent(event.id.toString(), event);
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
