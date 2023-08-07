import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreProfilePageRoutingModule } from './store-profile-routing.module';

import { StoreProfilePage } from './store-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreProfilePageRoutingModule,
  ],
  declarations: [StoreProfilePage],
})
export class StoreProfilePageModule {}
