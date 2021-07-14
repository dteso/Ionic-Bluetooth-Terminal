import { Injectable } from '@angular/core';

//import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class StorageService {


  constructor(
    public storage: Storage
  ) {
      this.storage.create();
  }

  async getItem(key): Promise<any>{
    return await this.storage.get(key);
  }

  async setItem(key, value): Promise<any>{
    return await this.storage.set(key, value);
  }


}
