
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FcmProvider } from '../providers/fcm/fcm';
import { UserLocation } from '../providers/userLocation/userLocation';

import { ToastController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';

import { TabsPage } from '../pages/tabs/tabs';
import { IntroductionSlidesPage } from '../pages/introduction-slides/introduction-slides';

import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  loader: any;
  //, private fcm: FCM
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, fcm: FcmProvider,
     toastCtrl: ToastController, public storage: Storage, public UserLocation: UserLocation) {

    platform.ready().then(() => {

      // Get a FCM token
      fcm.getToken()

      fcm.firebaseNative.subscribe('pushNotifications'),  

      // Listen to incoming messages
      fcm.listenToNotifications().pipe(
        tap(msg => {
          // show a toast
          const toast = toastCtrl.create({
            message: msg.body,
            duration: 3000
          });
          toast.present();
        })
      ).subscribe()
      

      this.storage.get('introShown').then((result) => {
 
        if(result){
          this.rootPage = TabsPage;
        } else {
          this.rootPage = IntroductionSlidesPage;
          this.storage.set('introShown', true);
        }

 
      });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }


}
