import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';


@IonicPage()
@Component({
  selector: 'page-introduction-slides',
  templateUrl: 'introduction-slides.html',
})
export class IntroductionSlidesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroductionSlidesPage');
  }

  goToHome(){
    this.navCtrl.setRoot(TabsPage);
  }
}
