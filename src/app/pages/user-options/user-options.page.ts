import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.page.html',
  styleUrls: ['./user-options.page.scss'],
})
export class UserOptionsPage implements OnInit {
  constructor(
    private storage: Storage,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}
  userType: string | undefined;
  profileTitle: string | undefined;
  loading: any;
  dataLoaded = false;

  async ngOnInit() {
    this.getTypeUser();
  }

  async getTypeUser() {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-loading-class',
      spinner: 'dots',
    });
    await this.loading.present();

    this.storage.create();
    const data = await this.storage.get('user');
    this.userType = data.type;

    if (this.userType === 'user') {
      this.profileTitle = 'SEU PERFIL';
    } else {
      this.profileTitle = 'PERFIL DA LOJA';
    }
    this.loading.dismiss();
    this.dataLoaded = true;

    const coords = await this.storage.get('coordenadas');

    if (!coords) {
      this.router.navigate(['/location']);
    }
  }
}
