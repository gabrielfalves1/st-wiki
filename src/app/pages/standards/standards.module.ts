import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StandardsPageRoutingModule } from './standards-routing.module';

import { StandardsPage } from './standards.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StandardsPageRoutingModule
  ],
  declarations: [StandardsPage]
})
export class StandardsPageModule {}
