import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { FcmProvider } from '../../providers/fcm/fcm';

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private fcm: FcmProvider) {
  }

  ionViewDidLoad() {
    this.fcm.newsCol = this.fcm.afs.collection('News');
    this.fcm.news = this.fcm.newsCol.valueChanges();
  }

}
