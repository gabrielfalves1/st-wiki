import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import { Store } from 'src/app/model/store';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.page.html',
  styleUrls: ['./stores.page.scss'],
})
export class StoresPage implements OnInit {
  constructor(
    private storeService: StoreService,
    private loadingCtrl: LoadingController
  ) {}

  stores: Store[] = [];
  store = new Store();
  loading: any;
  dataLoaded = false;

  ngOnInit() {
    this.getStores();
  }

  async getStores() {
    try {
      this.loading = await this.loadingCtrl.create({
        cssClass: 'my-loading-class',
        spinner: 'dots',
      });
      await this.loading.present();
      const res = await this.storeService.list();
      this.stores = <Store[]>res;

      for (const store of this.stores) {
        if (store.foto) {
          const photoPerfil = await this.storeService.getPhotoPerfil(
            store.foto
          );
          store.foto = photoPerfil;
        } else {
          store.foto = 'assets/avatar.svg';
        }
      }
    } catch (error) {
      console.error('Erro ao buscar:', error);
    } finally {
      this.loading.dismiss();
      this.dataLoaded = true;
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
      location.reload();
    }, 2000);
  }
}
