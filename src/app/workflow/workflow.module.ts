import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkflowPageRoutingModule } from './workflow-routing.module';

import { WorkflowPage } from './workflow.page';
import {HomePageModule} from "../home/home.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WorkflowPageRoutingModule,
        HomePageModule
    ],
  declarations: [WorkflowPage]
})
export class WorkflowPageModule {}
