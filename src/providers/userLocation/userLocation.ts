import { Injectable } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

import { Storage } from '@ionic/storage';

@Injectable()
export class UserLocation {

    // public geolocation: Geolocation;
    lat: number;
    lng: number;

    bgFrequency: number;
    fgFrequency: number;

    constructor(private geolocation: Geolocation, private storage: Storage) {
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
    }

    async getCurrentPosition() {
        const resp = await this.geolocation.getCurrentPosition()
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
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
}