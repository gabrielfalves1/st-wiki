import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  async alert(tipo: string, texto: string) {
    const alert = await this.alertController.create({
      header: tipo,
      message: texto,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async searchCep(cep: string): Promise<any> {
    const apiUrl = 'https://viacep.com.br/ws/' + cep + '/json/';

    try {
      return new Promise<any>((resolve, reject) => {
        this.http.get(apiUrl).subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            console.log(err);
            reject(null);
          }
        );
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
