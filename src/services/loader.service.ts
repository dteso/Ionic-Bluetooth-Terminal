import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loading;

  constructor(public loadingController: LoadingController) {}

   async presentLoading(msg: string) {
    this.loading = await this.loadingController.create({
      cssClass: 'loader-class',
      message: msg,
      spinner: 'dots',
      backdropDismiss: true
    });
    await this.loading.present();
  }

  async hideLoading() {
    await this.loading.dismiss();
  }

}
