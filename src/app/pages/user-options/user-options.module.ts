import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserOptionsPageRoutingModule } from './user-options-routing.module';

import { UserOptionsPage } from './user-options.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserOptionsPageRoutingModule
  ],
  declarations: [UserOptionsPage]
})
export class UserOptionsPageModule {}
