import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from 'src/app/model/store';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-view-store',
  templateUrl: './view-store.page.html',
  styleUrls: ['./view-store.page.scss'],
})
export class ViewStorePage implements OnInit {
  constructor(
    private activatedRouter: ActivatedRoute,
    private storeService: StoreService
  ) {}
  _id: string | null = null;
  store = new Store();
  imageSrc: string | undefined;
  ngOnInit() {
    this, this.getParam();
  }

  getParam() {
    this._id = this.activatedRouter.snapshot.paramMap.get('id');
    if (this._id) {
      this.storeService.get(this._id).then(async (res) => {
        this.store = <Store>res;
        if (this.store.foto) {
          await this.storeService
            .getPhotoPerfil(this.store.foto)
            .then((res) => {
              this.imageSrc = res;
            });
        } else {
          this.imageSrc = 'assets/avatar.svg';
        }
      });
    }
  }
}
