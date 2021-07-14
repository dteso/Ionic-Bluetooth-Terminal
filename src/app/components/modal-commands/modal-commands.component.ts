import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-modal-commands',
  templateUrl: './modal-commands.component.html',
  styleUrls: ['./modal-commands.component.scss'],
})
export class ModalCommandsComponent implements OnInit{

  commands = [];
  showCreateForm =  false;
  createForm: FormGroup;

  constructor(
    private readonly modalController:ModalController,
    private readonly formBuilder: FormBuilder,
    private readonly storageService: StorageService
  ) {
    this.createForm = this.formBuilder.group({
        command: ['', Validators.required],
        message: ['', Validators.required]
    });
  }

  ngOnInit(){
    this.storageService.getItem('COMMANDS').then( cmds => {
      this.commands = cmds;
    });
  }

  addCommand(){
    this.showCreateForm = true;
  }

  async storeCommand(){
    if(!this.createForm.invalid)
      this.commands.push(this.createForm.value);
    await this.storageService.setItem('COMMANDS', this.commands);
    this.showCreateForm = false;
    this.createForm.reset();
  }

  async dismiss() {
    await this.modalController.dismiss({
      'dismissed': true
    });
  }

  async dismissWithCommand(message){
    await this.modalController.dismiss({
      'command': message
    });
  }


}
