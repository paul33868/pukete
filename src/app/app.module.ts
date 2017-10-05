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
import { SettingsPage } from "../pages/settings/settings";
import { ResultsPage } from "../pages/results/results";
import { EventDetailsPage } from "../pages/event-details/event-details";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataProvider } from "../providers/data";

@NgModule({
  declarations: [
    PuketeApp,
    IndexPage,
    ListPage,
    HelpPage,
    SettingsPage,
    ResultsPage,
    EventDetailsPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(PuketeApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PuketeApp,
    IndexPage,
    ListPage,
    HelpPage,
    SettingsPage,
    ResultsPage,
    EventDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    NativeStorage,
    DataProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
