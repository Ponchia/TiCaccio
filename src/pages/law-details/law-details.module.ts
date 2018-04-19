import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LawDetailsPage } from './law-details';

@NgModule({
  declarations: [
    LawDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(LawDetailsPage),
  ],
})
export class LawDetailsPageModule {}
