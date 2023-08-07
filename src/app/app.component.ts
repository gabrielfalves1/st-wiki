import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './model/user';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { StoreService } from './services/store.service';
import { Store } from './model/store';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private userService: UserService,
    private storeService: StoreService,
    private router: Router,
    private menuController: MenuController,
    private storage: Storage
  ) { }

  user = new User();
  store = new Store();
  imageSrc: string | undefined;
  nome: string | undefined;
  route = '';
  userType: string | undefined;

  ngOnInit() {
    this.getUser();
  }

  async getUser() {
    this.imageSrc = 'assets/avatar.svg';
    await this.storage.create();
    const user = await this.storage.get('user');
    const id = user.id;
    this.userType = user.type;

    if (this.userType === 'user') {
      this.userService.get(id).then(async (res) => {
        this.user = <User>res;
        const nomeParts = this.user.nome.split(' ');

        if (nomeParts.length === 1) {
          this.nome = nomeParts[0];
        } else {
          this.nome = nomeParts[0] + ' ' + nomeParts[nomeParts.length - 1];
        }


        if (this.user.foto) {
          await this.userService.getPhotoPerfil(this.user.foto).then((res) => {
            this.imageSrc = res;
          });
        }
      });
    } else {
      this.storeService.get(id).then(async (res) => {
        this.store = <Store>res;
        const nomeParts = this.store.nome.split(' ');


        if (nomeParts.length === 1) {
          this.nome = nomeParts[0];
        } else {
          this.nome = nomeParts[0] + ' ' + nomeParts[nomeParts.length - 1];
        }



        if (this.store.foto) {
          await this.storeService
            .getPhotoPerfil(this.store.foto)
            .then((res) => {
              this.imageSrc = res;
            });
        }
      });
    }
  }

  logout() {
    this.userService
      .logoff()
      .then(() => {
        this.storage.remove('user');
        this.menuController.close();
        this.router.navigate(['/tabs/tab2']);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  navigateTo(route: string) {
    const menu = document.querySelector('ion-menu');
    menu?.toggle();
    this.router.navigateByUrl(route);
  }
}
