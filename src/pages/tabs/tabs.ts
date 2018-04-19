import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { NewsPage } from '../news/news';
import { MapPage } from '../map/map';
import { SettingsPage } from '../settings/settings';
import { LawsPage } from '../laws/laws';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = NewsPage;
  tab5Root = MapPage;
  tab6Root = SettingsPage;
  tab7Root = LawsPage;

  constructor() {

  }
}
