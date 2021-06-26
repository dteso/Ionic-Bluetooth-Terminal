import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    BluetoothSerial,
    AndroidPermissions
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
