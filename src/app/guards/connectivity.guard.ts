import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilsService } from '../services/util.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectivityGuard implements CanActivate {
  constructor(private router: Router, private utilService: UtilsService) {}

  async canActivate(): Promise<boolean> {
    const networkStatus = this.utilService.checkNetwork();

    if (await networkStatus) {
      return true;
    } else {
      this.router.navigate(['/error']);
      return false;
    }
  }
}
