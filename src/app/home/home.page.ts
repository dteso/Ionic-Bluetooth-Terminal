/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-console */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { Observable, of } from 'rxjs';
import { LoaderService } from 'src/services/loader.service';

import { File } from '@ionic-native/file/ngx';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { NavController, Platform } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Filesystem, Directory } from '@capacitor/filesystem';

const READ_STATUS = '>>>READ_STATUS';

interface DataRow {
  id: number;
  content: string;
  type: string; // sent / received
  timestamp: Date;
}

const MessageTypes = {
  SENT: 'SENT',
  RECEIVED: 'RECEIVED',
};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  @ViewChild('terminal') terminal: HTMLElement;

  bluetoothDevices = [];
  rawData: DataRow[] = [];
  rawDataSubject = new Observable<any>();
  str = '';
  lastStr = '';
  currentStr = '';
  codeInput = '';
  connectionMessage = READ_STATUS;
  idx: number;
  messageTypes = MessageTypes;

  connected = false;

  btForm: FormGroup;

  currentDevice = {
    name: '',
    address: '',
  };

  pdfObject: any;


  constructor(
    private readonly bt: BluetoothSerial,
    private readonly androidPermissions: AndroidPermissions,
    private readonly cdr: ChangeDetectorRef,
    private readonly formBuilder: FormBuilder,
    public loaderService: LoaderService,
    private readonly speechRecognition: SpeechRecognition,
    private navCtrl: NavController,
    private file: File,
    private fileOpener: FileOpener,
    private platform: Platform
  ) {
    this.idx = 0;
    this.btForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  async ngOnInit() {
    await this.androidPermissions
      .requestPermissions([
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
      ])
      .then(() => {
        this.androidPermissions
          .checkPermission(
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
          )
          .then(
            (result) => {
              console.log('Has permission?', result.hasPermission);
              this.bt.isConnected().then((connected) => {
                this.bt.disconnect();
              });
              this.getStoredDevices();
            },
            (err) =>
              this.androidPermissions.requestPermission(
                this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
              )
          );
      });
    await this.speechRecognition.hasPermission().then((hasPermission) => {
      if (!hasPermission) {
        this.speechRecognition.requestPermission().then(
          () => {
            console.log('Granted');
          },
          () => {
            console.log('Denied');
          }
        );
      }
    });
  }

  startSpeechRecognition() {
    const options = {}; // Optional
    this.speechRecognition.startListening().subscribe((matches) => {
      console.log(matches[0]);
      this.idx++;
      this.rawData.push({
        id: this.idx,
        content: matches[0],
        type: MessageTypes.SENT,
        timestamp: new Date(),
      });
      this.bt.write(matches[0]);
    });
  }

  onSubmit() {
    if (!this.btForm.invalid) {
      this.idx++;
      this.rawData.push({
        id: this.idx,
        content: this.btForm.controls.message.value,
        type: MessageTypes.SENT,
        timestamp: new Date(),
      });
      this.bt.write(this.btForm.controls.message.value);
      this.btForm.controls.message.reset();
    }
  }

  getStoredDevices() {
    this.bt.list().then((devs) => {
      console.log(JSON.stringify(devs));
      this.bluetoothDevices.push(devs);
      this.cdr.detectChanges();
    });
  }

  clearConsole() {
    this.rawData = [];
    this.rawDataSubject = of(this.rawData);
    this.idx = 0;
    this.cdr.detectChanges();
  }

  openNativeBluettothSettings() {
    this.bt.showBluetoothSettings();
  }

  connectToDevice(name: string, mac: string, messageOnConnection?) {
    this.loaderService.presentLoading(`Conectando con ${name}`);
    this.bt.connect(mac).subscribe(
      (connected) => {
        console.info('bluetooth connection: ', connected);
        if (connected === 'OK') {
          this.loaderService.hideLoading();
          this.connected = true;
          this.currentDevice = { name, address: mac };
          this.cdr.detectChanges();
        }
        if (messageOnConnection) {
          this.bt.write(messageOnConnection);
        }
        this.bt.subscribeRawData().subscribe((res) => {
          const view = new Uint8Array(res);
          if (view.length >= 1) {
            for (let i = 0; i < view.length; i++) {
              //if we received a \n, the message is complete, display it
              if (view[i] == 13 || view[i] == 0) {
                this.lastStr = this.str;
                this.str = '';
                this.cdr.detectChanges();
              }
              // if not, concatenate with the begening of the message
              else {
                let temp_str = String.fromCharCode(view[i]);
                let str_esc = escape(temp_str);
                this.codeInput = unescape(str_esc);
                this.str += unescape(str_esc);
              }
            }
          }
          console.log(this.lastStr);
          if (this.currentStr !== this.lastStr && this.lastStr !== '') {
            this.idx++;
            this.rawData.push({
              id: this.idx,
              content: this.lastStr,
              type: MessageTypes.RECEIVED,
              timestamp: new Date()
            });
            this.currentStr = this.lastStr;
          } else {
            this.lastStr = '';
          }
          this.rawDataSubject = of(this.rawData);
          this.cdr.detectChanges();
        });
      },
      (err) => {
        this.loaderService.hideLoading();
        console.error('Conection Lost... ');
      }
    );
  }

  disconnect() {
    this.bt
      .disconnect()
      .then((res) => {
        console.info('Disconnected... ' + res);
        this.connected = false;
        this.currentDevice = null;
        this.lastStr = null;
        this.rawData = [];
        this.rawDataSubject = null;
        this.getStoredDevices();
      })
      .catch((err) => console.error('Unable to disconnect'));
  }

  generateContent():String{
    let result = '';
    this.rawData.map( data=> {
      result = `${result} [ ${data.timestamp.getHours()}:${data.timestamp.getMinutes()}:${data.timestamp.getSeconds()} ] - ${data.content} \r\n`;
    });
    return result;
  }

  generatePDF() {
    let docDefinition = {
      content: [
        this.generateContent()
      ]
    };
    this.pdfObject = pdfMake.createPdf(docDefinition);
    alert('PDF Generado');
    this.savePDF();
  }

  savePDF() {
    if(this.platform.is('cordova')) {
      this.pdfObject.getBase64((buffer) => {
       // Save the PDF to the data Directory of our App
        Filesystem.writeFile(
          {
            directory: Directory.Documents,
            path: 'data.pdf',
            data: buffer
        }
        ).then(fileEntry => {
          console.info(fileEntry);
          this.pdfObject.download();
          alert('Guardado');
        });
      });
      return true;
    }
  }
}
