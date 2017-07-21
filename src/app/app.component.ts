import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Platform, MenuController, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IndexPage } from "../pages/index/index";
import { ListPage } from "../pages/list/list";
import { NativeStorage } from "@ionic-native/native-storage";
import { HelpPage } from "../pages/help/help";
import { enDictionary } from "../utils/en-dictionary";
import { esDictionary } from "../utils/es-dictionary.";

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
    private events: Events) {
    this.initializeApp();
    this.setLanguage();
    this.displayHelpPage();
    this.updateLanguage();
  }

  updateLanguage() {
    this.events.subscribe('language:changed', (language) => {
      console.info('changed' + language);
      this.setDictionary(language);
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('language:changed');
  }

  setLanguage() {
    // Set language
    this.nativeStorage.getItem('language')
      .then(
      data => {
        this.setDictionary(data);
        console.info('There is a language already set');
        this.setPages();
      },
      error => {
        this.nativeStorage.setItem('language', 'en')
          .then(
          () => {
            console.info('Changed language');
            this.dictionary = enDictionary
            this.setPages();
          },
          (error) => { console.error(`Error storing event: ${JSON.stringify(error)}`) });
      });
  }

  displayHelpPage() {
    this.nativeStorage.keys()
      .then(
      data => {
        if (data.length > 0) {
          this.isFirstTime = false;
        }
        if (this.isFirstTime) {
          this.rootPage = HelpPage;
        }
        else {
          this.rootPage = IndexPage;
        }
      },
      error => console.error(error)
      );


  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.menu.close();
    this.nav.setRoot(page.component);
  }

  setPages() {
    this.pages = [
      { title: this.dictionary.menu.calculator, component: IndexPage, icon: 'calculator' },
      { title: this.dictionary.menu.list, component: ListPage, icon: 'list' },
      { title: this.dictionary.menu.help, component: HelpPage, icon: 'help' }
    ];
  }

  setDictionary(language: string) {
    switch (language) {
      case 'en':
        this.dictionary = enDictionary
        break;
      case 'es':
        this.dictionary = esDictionary
        break;
    }
    this.setPages();
  }
}
