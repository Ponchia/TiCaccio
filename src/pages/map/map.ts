import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';

import { ActionSheetController } from 'ionic-angular'

import { AlertController } from 'ionic-angular';

import { NativeAudio } from '@ionic-native/native-audio';

import { Vibration } from '@ionic-native/vibration';

import { Storage } from '@ionic/storage';

import { UserLocation } from '../../providers/userLocation/userLocation';

import * as leaflet from 'leaflet';
import 'leaflet-offline';

import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';

class Marker {
  lat: number;
  lng: number;
  animal: any;

  constructor(id: number, lat: number, lng: number, animal: string) {
    this.lat = lat;
    this.lng = lng;
    this.animal = animal;
  }
}

class iconMarker{
  name: string;
  color: string;

  constructor(name: string, color: string) {
    this.name = name;
    this.color = color;
  }
}

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  alert: any;
  lat: any;
  lng: any;

  hunting_area: any;

  deer: any;
  boar: any;
  currentIcon: any;

  selected: any;

  markers: any;
  markerClass: Array<Marker> = [];

  lastClick: any;

  base: any;

  current: any;

  hunting: boolean = false;
  iconMarker: iconMarker;

  public watch: any;
  bg: any;

  currentPosition: any;

  direction: any = "";

  constructor(public navCtrl: NavController,
    public navParams: NavParams, private geolocation: Geolocation,
    public actionSheetCtrl: ActionSheetController, platform: Platform,
    private backgroundGeolocation: BackgroundGeolocation,
    private alertCtrl: AlertController,
    private nativeAudio: NativeAudio,
    private vibration: Vibration,
    private storage: Storage,
    private userLocation: UserLocation,
    private deviceOrientation: DeviceOrientation) {
    this.deer = leaflet.icon({
      // iconUrl: '../../assets/icon/Marker/Deer.ico',
      iconUrl: 'assets/icon/Marker/Deer.ico',
      iconSize: [20, 20], // size of the icon
      iconAnchor: [0, 15], // point of the icon which will correspond to marker's location
      popupAnchor: [10, -10] // point from which the popup should open relative to the iconAnchor
    });

    this.boar = leaflet.icon({
      iconUrl: 'assets/icon/Marker/Boar.svg',

      iconSize: [20, 20], // size of the icon
      iconAnchor: [0, 15], // point of the icon which will correspond to marker's location
      popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    this.currentIcon = leaflet.divIcon({
      iconUrl: 'assets/icon/Marker/currentPosition.png',
      className: 'css-icon',
      html: '<div class="gps_ring" id="currentPosition"></div>',
      iconSize: [40, 40], // size of the icon
      iconAnchor: [0, 15], // point of the icon which will correspond to marker's location
      popupAnchor: [10, -10] // point from which the popup should open relative to the iconAnchor
    });

    this.selected = this.deer;


    platform.ready().then(() => {
      let subscription = this.deviceOrientation.watchHeading().subscribe(
        (data: DeviceOrientationCompassHeading) => {
          this.direction = "rotate(" + data.trueHeading + "deg)";
        }
      );
    });

    this.markers = new Array();
    this.hunting_area = new Array();

    this.iconMarker = new iconMarker("eye", "light");

    this.current = "";

    this.bg = backgroundGeolocation;
  }

  startTracking() {

    if (this.current !== "") {
      this.backgroundGeolocation.stop();
      // this.watch = null;
      // this.watch.unsubscribe();
      this.current = "";
      document.getElementById("currentPosition").style.border = "3px solid #b3ff00";
      console.log("stop");
      return;
    }


    // console.log(this.hunting_area);
    let flag = true;
    this.hunting_area.forEach(element => {
      console.log("Element: " + element);
      if (this.isUserInsidePolygon(this.lat, this.lng, element)) {
        flag = false;
        this.current = element;
        console.log("Current: " + this.current);
      }

      // this.current = element;
    });

    // console.log(this.current);
    // return;
    if (flag || this.current == "") {
      this.presentAlert();
      this.iconMarker.name = "eye";
      this.iconMarker.color = "light";
      return;
    }

    this.iconMarker.name = "eye-off";
    this.iconMarker.color = "danger";

    this.hunting = true;

    document.getElementById("currentPosition").style.border = "3px solid #0000ff";
    this.userLocation.getFgFrequency().then((e) => {

      let config: BackgroundGeolocationConfig = {
        desiredAccuracy: 0,
        stationaryRadius: 1,
        distanceFilter: 1,
        notificationTitle: 'TiCaccio is tracking you',
        notificationText: 'you know it, right?',
        // stopOnTerminate: true,
        debug: true,
        interval: 200,
        fastestInterval: 120000,
        activitiesInterval: 200,
      };

      this.backgroundGeolocation.configure(config).subscribe((location: BackgroundGeolocationResponse) => {

        console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
        // this.vibration.vibrate(10000);
        // this.nativeAudio.play('uniqueId1', () => console.log('uniqueId1 is done playing', (e) => console.log("Error", e)));
        this.lat = location.latitude;
        this.lng = location.longitude;

        this.currentPosition.setLatLng(leaflet.latLng(location.latitude, location.longitude));

        if (!this.isUserInsidePolygon(this.lat, this.lng, this.current)) {
          this.vibration.vibrate(10000);
          this.nativeAudio.play('uniqueId1', () => console.log('uniqueId1 is done playing', (e) => console.log("Error", e)));
          console.log("played!");
          // this.backgroundGeolocation.stop();
        }

      }, (err) => {
        console.log(err);
      });

      this.backgroundGeolocation.start();
    });
  }

  startWatch() {
    this.userLocation.getFgFrequency().then((e) => {
      let options = {
        timeout: e,
        enableHighAccuracy: true
      };
      this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.currentPosition.setLatLng(leaflet.latLng(position.coords.latitude, position.coords.longitude));

        if (this.hunting && !this.isUserInsidePolygon(this.lat, this.lng, this.current)) {
          this.vibration.vibrate(10000);
          this.nativeAudio.play('uniqueId1', () => console.log('uniqueId1 is done playing'));
        }
      });
    });
  }

  ionViewDidLoad(): void {
    let input_file = [
      {
        "type": "Feature",
        "properties": { "animal": "Deer" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [45.8693487210426, 8.985974192619326],
            [45.86894157975579, 8.986462354660036],
            [45.868635288014715, 8.985968828201296],
            [45.86912460694178, 8.985405564308168]
          ]]
        }
      },
      {
        "type": "Feature",
        "properties": { "animal": "Deer" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [45.86701789022418, 8.985453844070436],
            [45.86674147111245, 8.985807895660402],
            [45.86658458397811, 8.985464572906496],
            [45.86686100386997, 8.985056877136232]
          ]]
        }
      },
      {
        "type": "Feature",
        "properties": { "animal": "Deer" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [45.870080820807914, 8.966474533081056],
            [45.8695130708089, 8.966732025146486],
            [45.86943463120833, 8.966040015220644],
            [45.86991647272039, 8.965927362442018]
          ]]
        }
      },
      {
        "type": "Feature",
        "properties": { "animal": "Deer" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [45.8683700828268, 8.987063169479372],
            [45.86785460996842, 8.987696170806887],
            [45.867637960528725, 8.986794948577883],
            [45.868123552925724, 8.9863657951355]
          ]]
        }
      },
      {
        "type": "Feature",
        "properties": { "animal": "Deer" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [45.86861287635765, 8.985180258750917],
            [45.86826922981759, 8.985775709152223],
            [45.86808246450255, 8.98535192012787],
            [45.86842611219728, 8.98486912250519]
          ]]
        }
      },
      {
        "type": "Feature",
        "properties": { "animal": "Deer" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [45.86880711041877, 8.98737967014313],
            [45.86872866982197, 8.987787365913393],
            [45.86901254955251, 8.987900018692018],
            [45.8690760487675, 8.987084627151491]
          ]]
        }
      }
      , {
        "type": "Feature",
        "properties": { "animal": "Boar" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [45.869692360908786, 8.986687660217287],
            [45.86944583687232, 8.986794948577883],
            [45.86966994967794, 8.987524509429933]
          ]]
        }
      }
    ];

    this.geolocation.getCurrentPosition().then((resp) => {
      this.map = leaflet.map("map").fitWorld();
      this.loadmap(resp.coords.latitude, resp.coords.longitude);
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    this.loadareas(input_file);
    // this.loadmarkers();
    this.current = "";

  }

  loadmap(lat, lon) {
    this.map.setView(leaflet.latLng(lat, lon), 20);

    // leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    //   subdomains: ['a', 'b', 'c']
    // }).addTo(this.map);
    let tilesDb = {
        getItem: function (key) {
            // return Promise that has the image Blob/File/Stream.
        },
    
        saveTiles: function (tileUrls) {
            // return Promise.
        },
    
        clear: function () {
            // return Promise.
        }
    };

    leaflet.tileLayer.offline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', tilesDb, {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abc',
        minZoom: 13,
        maxZoom: 19,
        crossOrigin: true
    });

    var cssIcon = leaflet.divIcon({
      // Specify a class name we can refer to in CSS.
      className: 'css-icon',
      html: '<div class="gps_ring" id="currentPosition"></div>'
      // Set marker width and height
      , iconSize: [22, 22]
      // ,iconAnchor: [11,11]
    });

    this.currentPosition = leaflet.marker(leaflet.latLng(lat, lon), { icon: this.currentIcon }).addTo(this.map);

    this.hunting_area.forEach((e) => {
      leaflet.polygon(e.getLatLngs()[0], e.options).addTo(this.map);
    });

    /* VERY FRICKING IMPORTANT */
    this.map.on('click', (e) => { console.log(e.latlng) });
    this.map.on('contextmenu', (e) => { this.onMapClick(e) });
    let btn_marker = '<a class="leaflet-control-zoom-in" href="#" title="Zoom in" role="button" aria-label="Zoom in">+</a>'

    this.storage.get('markers').then((val) => {
      if (val !== null) {
        this.markerClass = val;
        this.markerClass.forEach((marker) => {
          let temp_marker = leaflet.marker([marker.lat, marker.lng], { icon: this.markerIcon(marker.animal) }).addTo(this.map);
          temp_marker.bindPopup('<button ion-button id="deleteMe" class="deletePopUp" color="danger">Delete</button>');
          temp_marker.on("popupopen", (e) => { this.onPopupOpen(temp_marker, this.map, this.markers, this.markerClass, this.storage) });
          this.markers.push(temp_marker);
        });
      }
    });

    this.startWatch();
  }

  loadareas(input_geoJSON) {
    let areas = new Array();
    input_geoJSON.forEach(function (state) {
      let polygon = leaflet.polygon(state.geometry.coordinates, {
        weight: 1,
        fillOpacity: 0.7,
        color: 'red',
        dashArray: '3'
      });
      areas.push(polygon);
    });

    this.hunting_area = areas;

    // this.loadmarkers();
  }

  setToCurrentLocation(){
    // this.userLocation.getCurrentPosition().then((e) => {

    //   this.currentPosition.setLatLng(leaflet.latLng(e.lat, e.lng));
    //   this.map.setView(leaflet.latLng(e.lat, e.lng), 20);
    //   this.lat = e.lat;
    //   this.lng = e.lng;
    // });
  }

  isMarkerInsidePolygon(marker, poly) {
    let polyPoints = poly.getLatLngs()[0];
    let x = marker.getLatLng().lat, y = marker.getLatLng().lng;

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

  isUserInsidePolygon(lat, lng, poly) {
    // console.log("current: ");
    // console.log(this.current);
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


  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your marker',
      buttons: [
        {
          text: 'Deer',
          handler: () => {
            this.selected = this.deer;
          }
        },
        {
          text: 'Boar',
          handler: () => {
            this.selected = this.boar;
          }
        },
        {
          text: 'Normal',
          handler: () => {
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    actionSheet.present();
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Not inside an hunting area',
      subTitle: 'Go inside one before activating the monitoring',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  markerIcon(type): leaflet.Icon<leaflet.IconOptions> | leaflet.DivIcon {

    return leaflet.icon(type.options);
  }

  onMapClick(e) {
    let marker = leaflet.marker(e.latlng, { icon: this.selected }).addTo(this.map);
    // console.log("onMapClick");
    // if (this.markers.length == 0) {
    //   this.markers.push(marker);
    //   // console.log(this.markers);
    //   console.log("primo");
    // } else if (this.markers[this.markers.length - 1]._latlng.lat != e.latlng.lat &&
    //   this.markers[this.markers.length - 1]._latlng.lng != e.latlng.lng) { //instead of using the exact point use the area of a circle big as the icon

    //   // console.log("secondo");

    marker.bindPopup('<button ion-button id="deleteMe" class="deletePopUp" color="danger">Delete</button>');
    marker.on("popupopen", (e) => { this.onPopupOpen(marker, this.map, this.markers) });
    this.markers.push(marker);
    // console.log(this.isMarkerInsidePolygon(marker, this.hunting_area[0]));
    // }
    /**
     * Marker class add
     */
    let temp_id = +Math.random().toString(36).substr(2, 9);
    let temp_marker = new Marker(temp_id, e.latlng.lat, e.latlng.lng, this.selected);
    this.markerClass.push(temp_marker);

    this.storage.set('markers', this.markerClass);

    console.log("Marker coords");
    console.log(e.latlng);
  };

  onPopupOpen(marker, map, markers, markersClass?, storage?) {
    document.getElementById("deleteMe").onclick = function () {
      map.removeLayer(marker);
      let markerIndex = markers.indexOf(marker);
      if (markerIndex > -1) {
        markers.splice(markerIndex, 1);
        if (markersClass) {
          markersClass.splice(markerIndex, 1);
          storage.set('markers', markersClass);
        }
      }
    };
  }
}