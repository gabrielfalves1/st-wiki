import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Store } from 'src/app/model/store';
import { UtilsService } from 'src/app/services/util.service';
import { GeoPoint } from '@angular/fire/firestore';
import { GmapsService } from 'src/app/services/gmaps.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-store-address',
  templateUrl: './store-address.page.html',
  styleUrls: ['./store-address.page.scss'],
})
export class StoreAddressPage implements OnInit {
  constructor(
    private storeService: StoreService,
    private utilService: UtilsService,
    private storage: Storage,
    private router: Router,
    private gmaps: GmapsService
  ) {}
  store = new Store();
  googleMaps: any;
  isLoading = false;
  registerSuccess = false;
  async ngOnInit() {
    this.getData();
  }

  async save() {
    try {
      this.isLoading = true;
      const address =
        this.store.cep +
        ' ' +
        this.store.rua +
        ' ' +
        this.store.numero +
        ' ' +
        this.store.cidade;

      const cords = await this.getCoordinates(address);

      if (cords) {
        this.store.coordenadas = new GeoPoint(cords.lat, cords.lng);
        await this.storeService.add(this.store);
        this.utilService.alert('sucesso', 'Loja cadastrada com sucesso!');
        this.registerSuccess = true;

        const res = this.storeService
          .getStoreIdByEmail(this.store.email)
          .then(async (res) => {
            const id = res;

            const type = 'store';
            const user_data = {
              id: id,
              type: type,
            };

            await this.storage.set('user', user_data);
            this.router.navigateByUrl('/user-options').then(() => {
              location.reload();
              this.storage.remove('storeData');
            });
          });
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  }

  async searchCep(event: any) {
    const res = await this.utilService.searchCep(event.target.value);
    this.store.rua = res.logradouro;
    this.store.cidade = res.localidade;
  }

  async getCoordinates(address: string): Promise<{ lat: number; lng: number }> {
    let googleMaps: any = await this.gmaps.loadGoogleMaps();
    this.googleMaps = googleMaps;

    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (
          status === google.maps.GeocoderStatus.OK &&
          results &&
          results.length > 0
        ) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          reject(new Error('Endereço não encontrado.'));
          this.utilService.alert('Aviso', 'Endereço não encontrado');
        }
      });
    });
  }

  async getData() {
    this.storage.create();
    const data = await this.storage.get('storeData');

    if (!data) {
      this.router.navigate(['/tabs/storeRegister']);
    } else {
      this.store.nome = data.nome;
      this.store.telefone = data.telefone;
      this.store.email = data.email;
      this.store.senha = data.senha;
    }
  }
}
