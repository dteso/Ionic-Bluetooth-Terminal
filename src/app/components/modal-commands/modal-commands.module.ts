import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCommandsComponent } from './modal-commands.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StorageService } from 'src/services/storage.service';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [ModalCommandsComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  providers: [
    StorageService
  ]
})
export class ModalCommandsModule { }
