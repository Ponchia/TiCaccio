import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
// import {LocationTrackerProvider} from "../../providers/location-tracker/location-tracker";
import { Vibration } from '@ionic-native/vibration';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
//, public locationTracker: LocationTrackerProvider
public watch: any;
bg: any;

  constructor(public navCtrl: NavController, private backgroundGeolocation: BackgroundGeolocation, 
    public geolocation: Geolocation,private vibration: Vibration ) {
    this.bg= backgroundGeolocation;
  }

  public startTracking() {
    console.log("Yo, starting UP!");

    let config : BackgroundGeolocationConfig = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 2000
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {

      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

      // Update inside of Angular's zone
      this.vibration.vibrate([1000 , 500 , 2000]);

    }, (err) => {
      console.log(err);
      });

    this.backgroundGeolocation.start();

    // Background tracking
    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
      console.log(position);

      // this.zone.run(() => {
      //   this.lat = position.coords.latitude;
      //   this.lng = position.coords.longitude;
      // });
    });
  }

  public stopTracking() {
    console.log('stopTracking');

    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
  }
}
