import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Platform, MenuController, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ListPage } from "../pages/list/list";
import { NativeStorage } from "@ionic-native/native-storage";
import { HelpPage } from "../pages/help/help";
import { SettingsPage } from "../pages/settings/settings";
import { DataProvider } from "../providers/data";

@Component({
  templateUrl: 'app.html'
})

export class PuketeApp implements OnDestroy {
  @ViewChild(Nav) nav: Nav;
  private rootPage;
  private pages: Array<{ title: string, component: any, icon: string }>;
  private isFirstTime: boolean = true;
  private dictionary: any;

  constructor(
    private platform: Platform,
    private menu: MenuController,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private nativeStorage: NativeStorage,
    private events: Events,
    private dataProvider: DataProvider) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.init();
      this.updateLanguage();
    });
  }

  init() {
    this.displayHelpPage()
      .then(() => {
        if (this.isFirstTime) {
          this.dataProvider.save('en', ['Drinks', 'Food', 'Others'], '$')
            .then(() => {
              this.setLanguage();
            });
        }
        else {
          this.setLanguage();
        }
      });
  }

  setLanguage() {
    this.dataProvider.getDictionary()
      .then(dictionary => {
        this.dictionary = dictionary;
        this.setPages();
      });
  }

  updateLanguage() {
    this.events.subscribe('language:changed', (language) => {
      console.info('changed to ' + language);
      this.dataProvider.getDictionary()
        .then(dictionary => {
          this.dictionary = dictionary;
          this.setPages();
        });
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('language:changed');
  }

  displayHelpPage() {
    return this.nativeStorage.keys()
      .then(
      data => {
        if (data.length > 0) {
          this.isFirstTime = false;
        }
        if (this.isFirstTime) {
          this.rootPage = HelpPage;
        }
        else {
          this.rootPage = ListPage;
        }
      },
      error => {
        console.error(error);
        this.rootPage = ListPage;
      });
  }

  openPage(page) {
    this.menu.close();
    this.nav.setRoot(page.component);
  }

  setPages() {
    if (this.dictionary) {
      this.pages = [
        { title: this.dictionary.menu.list, component: ListPage, icon: 'list' },
        { title: this.dictionary.menu.help, component: HelpPage, icon: 'help' },
        { title: this.dictionary.menu.settings, component: SettingsPage, icon: 'settings' }
      ];
    }
  }
}
