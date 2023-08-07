import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  constructor(private storage: Storage) {}

  async ngOnInit() {
    await this.storage.create();
    const isLoggedIn = await this.storage.get('user');
    console.log(isLoggedIn);
  }
}
