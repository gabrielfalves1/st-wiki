import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreAddressPage } from './store-address.page';

const routes: Routes = [
  {
    path: '',
    component: StoreAddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreAddressPageRoutingModule {}
