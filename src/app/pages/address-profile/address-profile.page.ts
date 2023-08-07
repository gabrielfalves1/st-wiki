import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertButton,
  AlertController,
  AlertInput,
  LoadingController,
} from '@ionic/angular';
import { Store } from 'src/app/model/store';
import { StoreService } from 'src/app/services/store.service';
import { Storage } from '@ionic/storage-angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UtilsService } from 'src/app/services/util.service';
import { GmapsService } from 'src/app/services/gmaps.service';
import { GeoPoint } from '@angular/fire/firestore';

@Component({
  selector: 'app-address-profile',
  templateUrl: './address-profile.page.html',
  styleUrls: ['./address-profile.page.scss'],
})
export class AddressProfilePage implements OnInit {
  constructor(
    private storeService: StoreService,
    private alertController: AlertController,
    private storage: Storage,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private utilService: UtilsService,
    private gmaps: GmapsService
  ) {}
  store = new Store();
  pageLoading: any;
  isLoading = false;
  imageSrc: string | undefined;
  photoLoading = false;
  fd: string = '';
  googleMaps: any;

  ngOnInit() {
    this.getStore();
  }

  async getStore() {
    this.imageSrc = 'assets/avatar.svg';
    await this.storage.create();
    const store = await this.storage.get('user');
    const id = store.id;
    this.storeService.get(id).then(async (res) => {
      this.store = <Store>res;

      if (this.store.foto) {
        await this.storeService.getPhotoPerfil(this.store.foto).then((res) => {
          this.imageSrc = res;
        });
      }
    });
  }

  async update() {
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

        const res = await this.storeService.updateAddress(
          this.store,
          this.store._id
        );
        this.fd = 'success';
      }
    } catch (err) {
      this.fd = 'error';
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

  async takePhoto() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Escolha uma opção',
      buttons: [
        {
          text: 'Tirar Foto',
          icon: 'camera',
          handler: () => {
            this.capturePhoto();
          },
        },
        {
          text: 'Selecionar da Galeria',
          icon: 'images',
          handler: () => {
            this.pickFromGallery();
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  async capturePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    if (image.base64String && this.store._id) {
      this.photoLoading = true;
      let nameFile = Date.now().toString() + '.' + image.format;
      await this.storeService.setPhotoPerfil(
        nameFile,
        image.base64String,
        this.store._id
      );
      await this.storeService
        .getPhotoPerfil('store/' + nameFile)
        .then((resUrl) => {
          this.imageSrc = resUrl;
          this.photoLoading = false;
        });
    }
  }

  async pickFromGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    if (image.base64String && this.store._id) {
      this.photoLoading = true;
      let nameFile = Date.now().toString() + '.' + image.format;
      await this.storeService.setPhotoPerfil(
        nameFile,
        image.base64String,
        this.store._id
      );
      await this.storeService
        .getPhotoPerfil('store/' + nameFile)
        .then((resUrl) => {
          this.imageSrc = resUrl;
          this.photoLoading = false;
        });
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
      location.reload();
    }, 2000);
  }
}
