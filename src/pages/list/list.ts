import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { IndexPage } from "../index/index";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  items: any = [];
  itemsList: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeStorage: NativeStorage,
    public alertCtrl: AlertController
  ) {
    this.initItems();
  }

  initItems() {
    this.nativeStorage.keys()
      .then(
      data => {
        this.items = data;
        this.initializeItems();
      },
      error => console.error(error)
      );
  }

  initializeItems() {
    this.itemsList = this.items;
  }

  itemTapped(event, list) {
    this.navCtrl.setRoot(IndexPage, {
      list: list
    });
  }

  clearList() {
    let confirm = this.alertCtrl.create({
      title: 'Remove all lists?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.nativeStorage.clear()
              .then(
              data => {
                console.error('Removed all items!');
                this.initItems();
                this.initializeItems();
              },
              error => console.error(error)
              );
          }
        }
      ]
    });
    confirm.present();
  }

  removeList(list) {
    let confirm = this.alertCtrl.create({
      title: 'Remove list?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.nativeStorage.remove(list)
              .then(
              data => {
                console.error('Removed ' + list);
                this.initItems();
                this.initializeItems();
              },
              error => console.error(error)
              );
          }
        }
      ]
    });
    confirm.present();
  }

  getItems(ev: any) {
    this.initializeItems();
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.itemsList = this.itemsList.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
