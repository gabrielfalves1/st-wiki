import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewStorePageRoutingModule } from './view-store-routing.module';

import { ViewStorePage } from './view-store.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewStorePageRoutingModule
  ],
  declarations: [ViewStorePage]
})
export class ViewStorePageModule {}
