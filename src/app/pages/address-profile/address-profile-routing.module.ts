import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddressProfilePage } from './address-profile.page';

const routes: Routes = [
  {
    path: '',
    component: AddressProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddressProfilePageRoutingModule {}
