import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Store } from 'src/app/model/store';
import { StoreService } from 'src/app/services/store.service';
import { UtilsService } from 'src/app/services/util.service';

@Component({
  selector: 'app-store-register',
  templateUrl: './store-register.page.html',
  styleUrls: ['./store-register.page.scss'],
})
export class StoreRegisterPage implements OnInit {
  constructor(
    private storage: Storage,
    private storeService: StoreService,
    private utilService: UtilsService,
    private router: Router
  ) {}

  store = new Store();
  isLoading = false;

  ngOnInit() {
    this.removeData();
  }

  async next() {
    try {
      this.isLoading = true;
      const res = await this.storeService.searchEmail(this.store.email);

      if (res) {
        this.utilService.alert(
          'Aviso',
          'Email já cadastrado em nosso sistema!'
        );
      } else {
        const storeData = {
          nome: this.store.nome,
          telefone: this.store.telefone,
          email: this.store.email,
          senha: this.store.senha,
        };

        await this.storage.set('storeData', storeData);
        this.router.navigate(['/store-address']);
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  }

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

  async removeData() {
    this.storage.remove('storeData');
  }
}
