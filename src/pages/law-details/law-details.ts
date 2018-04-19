import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

class Article {
  title: string;
  content: any;

  constructor(title: string, content: any) {
    this.title = title;
    this.content = content;
  }
}

@IonicPage()
@Component({
  selector: 'page-law-details',
  templateUrl: 'law-details.html',
})
export class LawDetailsPage {
  article: Article;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.article = navParams.data.article;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LawDetailsPage');
  }

}
