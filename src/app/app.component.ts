import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IndexPage } from "../pages/index/index";
import { ListPage } from "../pages/list/list";
import { NativeStorage } from "@ionic-native/native-storage";
import { HelpPage } from "../pages/help/help";

@Component({
  templateUrl: 'app.html'
})
export class PuketeApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage;
  pages: Array<{ title: string, component: any, icon: string }>;
  isFirstTime: boolean = true;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private nativeStorage: NativeStorage
  ) {

    this.initializeApp();
    this.displayHelpPage();

    this.pages = [
      { title: 'Pukete', component: IndexPage, icon: 'calculator' },
      { title: 'My lists', component: ListPage, icon: 'list' },
      { title: 'Help', component: HelpPage, icon: 'help' }

    ];
  }

  displayHelpPage() {
    this.nativeStorage.keys()
      .then(
      data => {
        if (data.length > 0) {
          this.isFirstTime = false;
        }
        if (this.isFirstTime) {
          console.log('first');
          this.rootPage = HelpPage;
        }
        else {
          console.log('dasdsa');
          this.rootPage = IndexPage;
        }
      },
      error => console.error(error)
      );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.menu.close();
    this.nav.setRoot(page.component);
  }
}
