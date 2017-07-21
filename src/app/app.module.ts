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
import { TextMaskModule } from 'angular2-text-mask';
import { SettingsPage } from "../pages/settings/settings";

@NgModule({
  declarations: [
    PuketeApp,
    IndexPage,
    ListPage,
    HelpPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(PuketeApp),
    TextMaskModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PuketeApp,
    IndexPage,
    ListPage,
    HelpPage,
    SettingsPage
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
