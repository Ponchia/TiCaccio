import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';


import { Vibration } from '@ionic-native/vibration';
import { BackgroundGeolocation} from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeAudio } from '@ionic-native/native-audio';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SMS } from '@ionic-native/sms';


import { Firebase } from '@ionic-native/firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';


import { IonicStorageModule } from '@ionic/storage';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { NewsPage } from '../pages/news/news';
import { MapPage } from '../pages/map/map';
import { SettingsPage } from '../pages/settings/settings';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

const firebase = {
    apiKey: "AIzaSyAa6J57Y_YlxObfkgRqxynGIxPSmN2pvKw",
    authDomain: "ticaccio-60260.firebaseapp.com",
    databaseURL: "https://ticaccio-60260.firebaseio.com",
    projectId: "ticaccio-60260",
    storageBucket: "ticaccio-60260.appspot.com",
    messagingSenderId: "689788917717"
}

import { UserLocation } from '../providers/userLocation/userLocation';
import { FcmProvider } from '../providers/fcm/fcm';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    NewsPage,
    MapPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebase), 
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    NewsPage,
    MapPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Vibration,
    Geolocation,
    NativeAudio,
    SMS,
    LocalNotifications,
    BackgroundGeolocation,
    UserLocation,
    Firebase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FcmProvider
  ]
})
export class AppModule {}