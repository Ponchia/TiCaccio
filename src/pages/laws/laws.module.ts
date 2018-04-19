import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LawsPage } from './laws';

@NgModule({
  declarations: [
    LawsPage,
  ],
  imports: [
    IonicPageModule.forChild(LawsPage),
  ],
})
export class LawsPageModule {}
