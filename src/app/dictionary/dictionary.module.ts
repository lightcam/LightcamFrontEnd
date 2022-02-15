import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DictionaryPageRoutingModule } from './dictionary-routing.module';

import { DictionaryPage } from './dictionary.page';
import { DictionaryCardComponent } from './dictionary-card/dictionary-card.component';
import {HomePageModule} from "../home/home.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DictionaryPageRoutingModule,
        HomePageModule,
    ],
  declarations: [
    DictionaryPage,
    DictionaryCardComponent,
  ]
})
export class DictionaryPageModule {}
