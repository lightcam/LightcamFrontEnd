import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {BannerHeadingComponent} from "../banner-heading/banner-heading.component";
import { BannerFooterComponent } from '../banner-footer/banner-footer.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  exports: [
    BannerHeadingComponent,
    BannerFooterComponent
  ],
  declarations: [
    HomePage,
    BannerHeadingComponent,
    BannerFooterComponent
  ]
})
export class HomePageModule {}
