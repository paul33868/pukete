import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { PuketeApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IndexPage } from "../pages/index/index";
import { SocialSharing } from "@ionic-native/social-sharing";
import { ListPage } from "../pages/list/list";
import { NativeStorage } from "@ionic-native/native-storage";
import { HelpPage } from "../pages/help/help";

@NgModule({
  declarations: [
    PuketeApp,
    IndexPage,
    ListPage,
    HelpPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(PuketeApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PuketeApp,
    IndexPage,
    ListPage,
    HelpPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    NativeStorage,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
