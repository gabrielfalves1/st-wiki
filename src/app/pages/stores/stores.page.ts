import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import { Store } from 'src/app/model/store';
import { LoadingController } from '@ionic/angular';
import { GmapsService } from 'src/app/services/gmaps.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.page.html',
  styleUrls: ['./stores.page.scss'],
})
export class StoresPage implements OnInit {
  constructor(
    private storeService: StoreService,
    private loadingCtrl: LoadingController,
    private gmaps: GmapsService,
    private storage: Storage
  ) {}

  stores: Store[] = [];
  store = new Store();
  loading: any;
  dataLoaded: any;
  states: string[] = [];
  userState: string = '';
  lat: number | any;
  lng: number | any;
  noStore = false;

  ngOnInit() {
    this.getUserLocation();
    this.getStates();
  }

  async getStores() {
    try {
      this.dataLoaded = false;
      this.loading = await this.loadingCtrl.create({
        cssClass: 'my-loading-class',
        spinner: 'dots',
      });
      await this.loading.present();

      const res = await this.storeService.list(this.userState);
      this.stores = <Store[]>res;

      if (this.stores.length === 0) {
        this.noStore = true;
      } else {
        this.noStore = false;
      }

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

  async getUserLocation() {
    await this.storage.create();
    const coords = await this.storage.get('coordenadas');

    if (coords) {
      this.lat = coords.lat;
      this.lng = coords.lng;

      const state = await this.gmaps.getCityFromCoordinates(this.lat, this.lng);

      if (state) {
        this.userState = state;
        this.getStores();
      }
    }
  }

  async getStates() {
    this.states = await this.gmaps.getStates();
  }

  async selectedState(event: any) {
    this.userState = event.detail.value;

    this.getStores();
  }
}
