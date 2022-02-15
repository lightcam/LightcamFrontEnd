import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'timeline',
        loadChildren: () => import('../timeline/timeline.module').then( m => m.TimelinePageModule)
      },
      {
        path: 'workflow',
        loadChildren: () => import('../workflow/workflow.module').then( m => m.WorkflowPageModule)
      },
      {
        path: 'dictionary',
        loadChildren: () => import('../dictionary/dictionary.module').then( m => m.DictionaryPageModule)
      },
      {
        path: 'resources',
        loadChildren: () => import('../resources/resources.module').then( m => m.ResourcesPageModule)
      },
      {
        path: 'common-ground',
        loadChildren: () => import('../common-ground/common-ground.module').then( m => m.CommonGroundPageModule)
      },
      {
        path: 'about',
        loadChildren: () => import('../about/about.module').then( m => m.AboutPageModule)
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
