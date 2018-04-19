import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { LawDetailsPage } from '../law-details/law-details';

// import { ItemDetailsPage } from '../pages/law/law';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { DomSanitizer } from '@angular/platform-browser';

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
  selector: 'page-laws',
  templateUrl: 'laws.html',
})
export class LawsPage {


  articles: Array<Article> = [];
  files: Array<string>;

  test: any;
  data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient,
  private sanitizer: DomSanitizer) {
    this.httpClient.get('assets/html/articlesName.txt', {responseType: 'text'}).subscribe(res =>{
      this.files = res.split("\n");
      
      for (let i of this.files) {
        this.httpClient.get('assets/html/'+i, {responseType: 'text'}).subscribe(res_article =>{
          let temp_article = new Article(i, this.sanitizer.bypassSecurityTrustHtml(res_article));
          this.articles.push(temp_article);
        });
      }
     
    });
  }

  openNavDetailsPage(article) {
    this.navCtrl.push(LawDetailsPage, { article: article });
  }
}
