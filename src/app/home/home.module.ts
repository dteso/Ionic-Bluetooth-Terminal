import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

import { HomePageRoutingModule } from './home-routing.module';
import { PdfService } from 'src/services/pdf.service';
import { ModalCommandsModule } from '../components/modal-commands/modal-commands.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
    ModalCommandsModule
  ],
  providers: [
    BluetoothSerial,
    AndroidPermissions,
    SpeechRecognition,
    PdfService
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
