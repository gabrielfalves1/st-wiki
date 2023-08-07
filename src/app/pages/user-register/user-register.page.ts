import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/model/user';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { NgForm } from '@angular/forms';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.page.html',
  styleUrls: ['./user-register.page.scss'],
})
export class UserRegisterPage implements OnInit {
  isLoading = false;
  registerSuccess = false;

  constructor(
    private userService: UserService,
    private storeService: StoreService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {}

  user = new User();
  _id: string | null = null;

  async presentAlert(tipo: string, texto: string) {
    const alert = await this.alertController.create({
      header: tipo,
      message: texto,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {},
        },
      ],
    });
    await alert.present();
    return alert;
  }

  async save() {
    try {
      this.isLoading = true;
      const resultUser = await this.userService.searchEmail(this.user.email);
      const resultStore = await this.storeService.searchEmail(this.user.email);

      if (resultUser || resultStore) {
        this.presentAlert('Aviso', 'Email já cadastrado em nosso sistema');
      } else {
        await this.userService.add(this.user);
        this.presentAlert(
          'Aviso',
          'Cadastrado com sucesso! Faça login para continuar'
        );
        this.registerSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/tabs/tab2']);
        }, 3000);
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  }

  formatPhone() {
    if (!this.user.telefone) return;

    const cleanPhone = this.user.telefone.replace(/\D/g, ''); // Remove tudo que não é número
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

    this.user.telefone = formattedPhone;
  }
}
