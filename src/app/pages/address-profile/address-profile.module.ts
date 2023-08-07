import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddressProfilePageRoutingModule } from './address-profile-routing.module';

import { AddressProfilePage } from './address-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddressProfilePageRoutingModule
  ],
  declarations: [AddressProfilePage]
})
export class AddressProfilePageModule {}
