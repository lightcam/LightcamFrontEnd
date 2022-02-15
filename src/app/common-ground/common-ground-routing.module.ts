import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommonGroundPage } from './common-ground.page';

const routes: Routes = [
  {
    path: '',
    component: CommonGroundPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommonGroundPageRoutingModule {}
