import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { ActionSheetController } from 'ionic-angular';

import { SMS } from '@ionic-native/sms';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController, private vibration: Vibration, private actionSheetCtrl: ActionSheetController,
    private localNotifications: LocalNotifications, private sms: SMS) {
      this.localNotifications.on('yes', function (notification, eopts) { this.sms.send('+41797805942', 'It works biatch!'); });
      this.localNotifications.on('no', function (notification, eopts) { this.localNotifications.clear(1); });
  }

  vibrate(){
    this.vibration.vibrate([1000 , 500 , 2000]);
  }

  presentNotification(){
    // this.localNotifications.

    this.localNotifications.schedule({
      id: 1,
      text: 'Emergenza, manda messaggio',
      // sticky: true,
      actions: [
        { id: 'yes', title: 'Invia il messaggio' },
        { id: 'no',  title: 'Cencella la notifica' }
      ],
      
      // sound: isAndroid? 'file://sound.mp3': 'file://beep.caf',
      // data: { secret: key }
    });
    
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'Destructive',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
 
    actionSheet.present();
  }
}
