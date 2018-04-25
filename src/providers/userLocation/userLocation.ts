import { Injectable } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Events } from 'ionic-angular';

import { Storage } from '@ionic/storage';

@Injectable()
export class UserLocation {
    lat: number;
    lng: number;

    bgFrequency: number;
    fgFrequency: number;

    hunting: boolean = false;

    current_area: any;

    constructor(private geolocation: Geolocation, private storage: Storage, 
        public backgroundGeolocation: BackgroundGeolocation, public events: Events) {
        this.storage.get('bgFrequency').then((freq) => {
            if (freq) {
                this.bgFrequency = freq;
            } else {
                this.bgFrequency = 10000;
                this.storage.set('bgFrequency', this.bgFrequency);
            }
        });

        this.storage.get('fgFrequency').then((freq) => {
            if (freq) {
                this.fgFrequency = freq;
            } else {
                this.fgFrequency = 500;
                this.storage.set('fgFrequency', this.fgFrequency);
            }
        });

        this.fgFrequency = -1;
        this.bgFrequency = -1;

        this.configBG();
        this.startWatch();
    }


    startWatch(){
        this.backgroundGeolocation.start();
    }

    stopWatch(){
        this.backgroundGeolocation.stop();
    }

    configBG(){
        let config: BackgroundGeolocationConfig = {
            desiredAccuracy: 0,
            stationaryRadius: 0,
            distanceFilter: 0,
            notificationTitle: 'TiCaccio is tracking you',
            notificationText: 'you know it, right?',
            debug: true
          };
    
          this.backgroundGeolocation.configure(config).subscribe((location: BackgroundGeolocationResponse) => {
    
            this.lat = location.latitude;
            this.lng = location.longitude;

            if(this.hunting && !(this.isUserInsidePolygon(this.lat, this.lng, this.current_area))){
                this.events.publish('outside');
                this.hunting = false;
            }  

            this.events.publish('newLocation', location);
          });

    }

    getCurrentPosition() {
        return { lat: this.lat, lng: this.lng }
    }

    setBgFrequency(bgFrequency: number) {
        this.storage.set('bgFrequency', bgFrequency);
        this.bgFrequency = bgFrequency;
    }

    async getBgFrequency() {
        if (this.bgFrequency == -1) {
            const freq = await this.storage.get('bgFrequency');
            if (freq) {
                this.bgFrequency = freq;
            } else {
                this.bgFrequency = 500;
                this.storage.set('bgFrequency', this.bgFrequency);
            }
            return this.bgFrequency;
        } else {
            return this.bgFrequency;
        }
    }

    setFgFrequency(fgFrequency: number) {
        this.storage.set('fgFrequency', fgFrequency);
        this.bgFrequency = fgFrequency;
    }

    async getFgFrequency() {
        if (this.fgFrequency == -1) {
            const freq = await this.storage.get('fgFrequency');
            if (freq) {
                this.fgFrequency = freq;
            } else {
                this.fgFrequency = 500;
                this.storage.set('fgFrequency', this.fgFrequency);
            }
            return this.fgFrequency;
        } else {
            return this.fgFrequency;
        }
    }

    isUserInsidePolygon(lat, lng, poly) {
        let polyPoints = poly._latlngs[0];
        let x = lat, y = lng;
    
        let inside = false;
        for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
          let xi = polyPoints[i].lat, yi = polyPoints[i].lng;
          let xj = polyPoints[j].lat, yj = polyPoints[j].lng;
    
          let intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
        }
    
        return inside;
      };

}