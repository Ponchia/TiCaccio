import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from '@firebase/util';


interface News {
  title: string;
  content: string;
  image: string;
}

@Injectable()
export class FcmProvider {

  public newsCol: AngularFirestoreCollection<News>;
  public news: any;

  constructor(
    public firebaseNative: Firebase,
    public afs: AngularFirestore,
    private platform: Platform
  ) {}

  token: string;
  // Get permission from the user
  async getToken() {
  
    if (this.platform.is('android')) {
      this.token = await this.firebaseNative.getToken()
    } 
  
    if (this.platform.is('ios')) {
      this.token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    } 

    return this.saveTokenToFirestore(this.token)
  }

  // Save the token to firestore
  private saveTokenToFirestore(token) {
    if (!token) return;
    
    const devicesRef = this.afs.collection('devices')
  
    const docData = { 
      token,
      userId: 'testUser',
    }
  
    return devicesRef.doc(token).set(docData)
  }

  // async savePintPointToFirestore(pinpoint){
  //   if (!pinpoint) return;

  //   const devicesRef = await this.afs.collection('PinPoint');

  //   const resp = await devicesRef.doc(this.token).set(pinpoint);
  //   return resp;
  // }

  // Listen to incoming FCM messages
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen()
  }

}