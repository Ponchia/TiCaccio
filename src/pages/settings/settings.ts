// import { UserLocation } from './../../providers/userLocation/userLocation';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { UserLocation } from '../../providers/userLocation/userLocation';

import { SMS } from '@ionic-native/sms';

import { LocalNotifications } from '@ionic-native/local-notifications';

// import { AngularFireModule } from 'angularfire2';
// import { AngularFireDatabase } from 'angularfire2/database';
import { FcmProvider } from '../../providers/fcm/fcm';

class SMS_class {
  message: string;
  number: string;
  enableGPS: boolean;
}


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  public showMsgOptions: boolean;
  public showFreqOptions: boolean;
  public export_id: string = "";
  public import_marker: string = "";

  fgFreq: any;
  bgFreq: any;
  emergencySMS: SMS_class;



  constructor(public navCtrl: NavController, public navParams: NavParams, platform: Platform, private storage: Storage,
    public userLocation: UserLocation, private localNotifications: LocalNotifications, private sms: SMS, public fcm: FcmProvider) {
    //Set options to false waiting to be checked
    this.showMsgOptions = false;
    this.showFreqOptions = false;
    this.export_id = "";

    //Get already saved emergencySMS
    this.storage.get('emergencySMS').then((val) => {
      if (val) {
        this.emergencySMS = val;
      } else {
        this.emergencySMS = {
          message: "",
          number: "",
          enableGPS: true
        };
      }
    });

    // this.localNotifications.on('yes', function (notification, eopts) { this.sms.send(this.emergencySMS.number, this.emergencySMS.message); });
    // this.localNotifications.on('no', function (notification, eopts) { this.localNotifications.clearAll(); });
    // console.log(this.userLocation.getCurrentPosition());
    // this.userLocation.getCurrentPosition.then(response => console.log(response));

    console.log(this.fgFreq);
  }

  async ionViewDidLoad() {
    this.userLocation.getFgFrequency().then((e) => {
      this.fgFreq = e;
      console.log("Foreground frequency");
      console.log(e);
    });
    this.userLocation.getBgFrequency().then((e) => {
      this.bgFreq = e;
      console.log("Bsckground Frequency");
      console.log(e);
    });
  }

  showMessageOptions() {
    //Check if the checkButton is checked
    if (!this.showMsgOptions) {
      this.localNotifications.clearAll();
      console.log("clear all, but why?");
      return;
    }

    //Load notification with new data (showNotification for example?)
    this.localNotifications.schedule({
      id: 1,
      text: this.emergencySMS.message,
      // sticky: true,
      actions: [
        { id: 'yes', title: 'Invia il messaggio' },
        // { id: 'no', title: 'Cencella la notifica' }
      ],
    });

    
    this.sendMessage();
  }

  importMarkers(){

    // // let test = this.fcm.afs.collection('markers').doc(this.import_marker);
    
    // console.log(this.export_id);
    let docRef = this.fcm.afs.collection("Markers").doc(this.import_marker);

    docRef.ref.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
          let temp = [];
          // for (var i = 0; i < doc.length(); i++) {
          //   temp.push(doc[1]);
          //   console.log(doc[1]);
          // }


        Object.keys(doc.data()).map(function(objectKey, index) {
            var value = doc.data()[objectKey];
            // console.log(value);
            temp.push(value);
        });

          this.storage.get('markers').then((val) => {

            if(val){
              temp = val.concat(temp);
            }

            console.log(temp);
            this.storage.set('markers', temp);
          });

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    // usersRef.orderByChild(‘email’).equalTo(‘user-i-need-to-find@gmail.com’).once(‘value’).then(…)
  }

  bgChange(){
    this.userLocation.setBgFrequency(this.bgFreq);
  }

  fgChange(){
    this.userLocation.setFgFrequency(this.fgFreq);
  }
  
  exportPinPoint(){
    this.storage.get('markers').then((val) => {
        this.fcm.afs.collection('Markers').add({...val}).then((res) => {
          this.export_id = res.id;
        }).catch(err => {
          console.log("error");
        });
    });
  }

  sendMessage(){
    //Check if message is already set
    if(this.emergencySMS.enableGPS){
      this.userLocation.getCurrentPosition().then((e) => {
        console.log(e);
        this.localNotifications.on('yes', (notification, eopts) => { 
          // console.log("GPS enabled!");
          this.sms.send(this.emergencySMS.number, this.emergencySMS.message + ".\nLatitude: " + e.lat + "\nLongitude: " + e.lng); 
        });
      });
    } else {
      this.localNotifications.on('yes', (notification, eopts) => { 
        // console.log("GPS not enabled");
        this.sms.send(this.emergencySMS.number, this.emergencySMS.message ); 
      });
    }
  }
  
  showNotification() {
  }

  loadNotification() {
    //check is the notification is already active, if so disable it
    this.localNotifications.clearAll();

    //Save data to database
    this.storage.set('emergencySMS', this.emergencySMS);

    //Load notification with new data (showNotification for example?)
    this.localNotifications.schedule({
      id: 1,
      text: this.emergencySMS.message,
      sticky: true,
      actions: [
        { id: 'yes', title: 'Invia il messaggio' },
        // { id: 'no', title: 'Cencella la notifica' }
      ],
    });

    this.sendMessage();
  }

  showFrequenciesOptions() {
    console.log("Frequence: ");
    console.log(this.fgFreq);
  }
}
