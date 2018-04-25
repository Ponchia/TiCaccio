import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntroductionSlidesPage } from './introduction-slides';

@NgModule({
  declarations: [
    IntroductionSlidesPage,
  ],
  imports: [
    IonicPageModule.forChild(IntroductionSlidesPage),
  ],
})
export class IntroductionSlidesPageModule {}
