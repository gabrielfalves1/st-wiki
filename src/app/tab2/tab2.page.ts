import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { Storage } from '@ionic/storage-angular';
import { Auth } from '@angular/fire/auth';
import { LoginService } from '../services/login.service';
import { UserService } from '../services/user.service';
import { StoreService } from '../services/store.service';
import { UtilsService } from '../services/util.service';
import {
  AlertButton,
  AlertController,
  AlertInput,
  LoadingController,
} from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  email: string = '';
  senha: string = '';
  message: string = '';
  isLoading = false;
  showPassword: boolean = false;

  constructor(
    private userService: UserService,
    private storeService: StoreService,
    private loginService: LoginService,
    private router: Router,
    private storage: Storage,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private utilService: UtilsService
  ) {}
  private auth: Auth = inject(Auth);
  pageLoading: any;

  async ngOnInit() {
    this.checkNetwork();
  }

  async enter() {
    this.isLoading = true;
    const res = await this.loginService.login(this.email, this.senha);

    try {
      if (res === true) {
        this.senha = '';
        const id = this.auth.currentUser?.uid;

        if (id) {
          const isUser = this.userService.getUserById(id);
          const isStore = this.storeService.getStoreById(id);

          if (await isUser) {
            const type = 'user';
            const user_data = {
              id: id,
              type: type,
            };
            await this.storage.set('user', user_data);
            this.router.navigateByUrl('/user-options').then(() => {
              location.reload();
            });
          } else if (await isStore) {
            const type = 'store';
            const user_data = {
              id: id,
              type: type,
            };
            await this.storage.set('user', user_data);
            this.router.navigateByUrl('/user-options').then(() => {
              location.reload();
            });
          }
        }
      } else {
        this.senha = '';
        this.message = 'Usuário ou senha incorretos';
      }
    } catch (erro) {
      console.error(erro);
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
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
      text: 'Enviar',
      handler: async (data) => {
        this.userRecovery(data.email);
      },
    },
  ];

  async openAlert() {
    const alert = await this.alertController.create({
      header: 'Digite seu email',
      buttons: this.alertButtons,
      inputs: this.alertInputs,
    });

    await alert.present();
  }

  async userRecovery(email: string) {
    try {
      this.pageLoading = await this.loadingCtrl.create({
        spinner: 'circles',
      });

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (emailRegex.test(email)) {
        await this.userService.userRecovery(email).then(async (res) => {
          const alert = await this.alertController.create({
            header:
              'Redefinição de senha enviada para o seu email com sucesso!',
            buttons: ['Fechar'],
          });
          await alert.present();
        });
      } else {
        const alert = await this.alertController.create({
          header: 'Email inválido',
          message: 'Informe um endereço de email válido',
          buttons: ['Fechar'],
        });
        await alert.present();
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.pageLoading.dismiss();
    }
  }

  async checkNetwork() {
    const networkStatus = this.utilService.checkNetwork();

    if ((await networkStatus) === false) {
      this.router.navigate(['/error']);
    }
  }
}
