import { Injectable } from '@angular/core';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Platform } from '@ionic/angular';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  pdfObject: any;

  constructor(
    private platform: Platform
  ) {}

  generateContent(rawData):String{
    let result = '';
    rawData.map( data=> {
      result = `\r\n ${result} [ ${data.timestamp.getHours()}:${data.timestamp.getMinutes()}:${data.timestamp.getSeconds()} ] - ${data.content} \r\n`;
    });
    return result;
  }

  generatePDF(rawData) {
    let docDefinition = {
      content: [
        this.generateContent(rawData)
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
