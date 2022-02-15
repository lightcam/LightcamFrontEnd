import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimelinePageRoutingModule } from './timeline-routing.module';

import { TimelinePage } from './timeline.page';
import { DirectivesModule } from '../directives/directives.module';
import { SelectionButtonsComponent } from './selection-buttons/selection-buttons.component';
import { EventCardComponent } from './event-card/event-card.component';
import {HomePageModule} from "../home/home.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimelinePageRoutingModule,
    DirectivesModule,
    HomePageModule,
  ],
  declarations: [
    TimelinePage,
    SelectionButtonsComponent,
    EventCardComponent,
  ]
})
export class TimelinePageModule {}
