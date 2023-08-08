import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private storage: Storage,
    private router: Router,
    private userService: UserService
  ) {}

  async canActivate(): Promise<boolean> {
    await this.storage.create();
    const user = await this.storage.get('user');

    if (user !== null) {
      return true;
    } else {
      this.router.navigate(['/tabs/tab2']);
      return false;
    }
  }
}
