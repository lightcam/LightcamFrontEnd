import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommonGroundPageRoutingModule } from './common-ground-routing.module';

import { CommonGroundPage } from './common-ground.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonGroundPageRoutingModule
  ],
  declarations: [CommonGroundPage]
})
export class CommonGroundPageModule {}
