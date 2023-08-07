import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserOptionsPage } from './user-options.page';

const routes: Routes = [
  {
    path: '',
    component: UserOptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserOptionsPageRoutingModule {}
