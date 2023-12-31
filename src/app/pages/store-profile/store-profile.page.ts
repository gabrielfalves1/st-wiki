import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertButton,
  AlertController,
  AlertInput,
  LoadingController,
} from '@ionic/angular';
import { Store } from 'src/app/model/store';
import { Storage } from '@ionic/storage-angular';
import { StoreService } from 'src/app/services/store.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-store-profile',
  templateUrl: './store-profile.page.html',
  styleUrls: ['./store-profile.page.scss'],
})
export class StoreProfilePage implements OnInit {
  constructor(
    private storeService: StoreService,
    private alertController: AlertController,
    private storage: Storage,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController
  ) {}
  store = new Store();
  pageLoading: any;
  isLoading = false;
  loading: any;
  imageSrc: string | undefined;
  photoLoading = false;
  fd: string = '';

  ngOnInit() {
    this.getStore();
  }

  public alertInputs: AlertInput[] = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email',
    },
  ];

  public alertButtons: AlertButton[] = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {},
    },
    {
      text: 'Salvar',
      handler: async (data) => {
        this.updateEmail(data.email);
      },
    },
  ];

  formatPhone() {
    if (!this.store.telefone) return;

    const cleanPhone = this.store.telefone.replace(/\D/g, '');
    let formattedPhone = '';

    if (cleanPhone.length <= 2) {
      formattedPhone = `(${cleanPhone}`;
    } else if (cleanPhone.length <= 6) {
      const areaCode = cleanPhone.substring(0, 2);
      const firstPart = cleanPhone.substring(2, 6);
      formattedPhone = `(${areaCode}) ${firstPart}`;
    } else if (cleanPhone.length <= 10) {
      const areaCode = cleanPhone.substring(0, 2);
      const firstPart = cleanPhone.substring(2, 6);
      const secondPart = cleanPhone.substring(6, 10);
      formattedPhone = `(${areaCode}) ${firstPart}-${secondPart}`;
    } else {
      const areaCode = cleanPhone.substring(0, 2);
      const firstPart = cleanPhone.substring(2, 7);
      const secondPart = cleanPhone.substring(7, 11);
      formattedPhone = `(${areaCode}) ${firstPart}-${secondPart}`;
    }

    this.store.telefone = formattedPhone;
  }

  async getStore() {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-loading-class',
      spinner: 'dots',
    });
    await this.loading.present();

    this.imageSrc = 'assets/avatar.svg';
    await this.storage.create();
    const store = await this.storage.get('user');
    const id = store.id;
    this.storeService.get(id).then(async (res) => {
      this.store = <Store>res;
      this.loading.dismiss();
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
      const res = await this.storeService.updateStore(
        this.store,
        this.store._id
      );
      this.fd = 'success';
    } catch (err) {
      this.fd = 'error';
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  }

  async updateEmail(email: string) {
    try {
      this.pageLoading = await this.loadingCtrl.create({
        cssClass: 'my-loading-class',
        spinner: 'dots',
      });

      this.pageLoading.present();

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (emailRegex.test(email)) {
        const res = await this.storeService.searchEmail(email);
        if (res) {
          const alert = await this.alertController.create({
            header: 'Endereço de email já cadastrado em nossa plataforma',
            cssClass: 'fd-alert',
            buttons: ['Fechar'],
          });
          await alert.present();
        } else {
          const updateRes = await this.storeService.updateAuthEmail(email);
          if (updateRes) {
            const alert = await this.alertController.create({
              header: 'Email Atualizado com sucesso!',
              cssClass: 'fd-alert',
              buttons: ['Fechar'],
            });
            await alert.present();
            this.store.email = email;
          } else {
            const alert = await this.alertController.create({
              header: 'Necessário refazer login para trocar o email',
              cssClass: 'fd-alert',
              buttons: ['Fechar'],
            });
            await alert.present();
            setTimeout(async () => {
              await this.storage.remove('user');
              location.reload();
            }, 3000);
          }
        }
      } else {
        const alert = await this.alertController.create({
          header: 'Email inválido',
          message: 'Informe um endereço de email válido',
          cssClass: 'fd-alert',
          buttons: ['Fechar'],
        });
        await alert.present();
      }
    } catch (error) {
      console.log('Não foi possível efetuar troca de email', error);
    } finally {
      this.pageLoading.dismiss();
    }
  }

  async openAlert() {
    const alert = await this.alertController.create({
      header: 'Atualize seu email',
      cssClass: 'email-alert',
      buttons: this.alertButtons,
      inputs: this.alertInputs,
    });

    await alert.present();
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
