import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreAddressPageRoutingModule } from './store-address-routing.module';

import { StoreAddressPage } from './store-address.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreAddressPageRoutingModule,
    HttpClientModule,
  ],
  declarations: [StoreAddressPage],
})
export class StoreAddressPageModule {}
