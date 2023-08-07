import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StandardsPage } from './standards.page';

const routes: Routes = [
  {
    path: '',
    component: StandardsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StandardsPageRoutingModule {}
