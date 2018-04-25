import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { UserLocation } from '../../providers/userLocation/userLocation';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public userLocation : UserLocation,
     platform: Platform, public events: Events) {
    platform.ready().then(() => {
      this.userLocation.startWatch();
      events.subscribe('newLocation', (e) => {
        console.log("todos", e);
      });
    });
  }
}
