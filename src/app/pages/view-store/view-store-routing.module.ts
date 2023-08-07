import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewStorePage } from './view-store.page';

const routes: Routes = [
  {
    path: '',
    component: ViewStorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewStorePageRoutingModule {}
