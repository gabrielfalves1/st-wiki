import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Storage } from '@ionic/storage-angular';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class isAuth implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router,
    private storage: Storage,
    private userService: UserService
  ) {}

  async canActivate(): Promise<boolean> {
    await this.storage.create();

    const user = await this.storage.get('user');

    //const user = await this.userService.isAuthenticated();

    if (user) {
      this.router.navigate(['/user-options']);
      return false;
    } else {
      return true;
    }
  }
}
