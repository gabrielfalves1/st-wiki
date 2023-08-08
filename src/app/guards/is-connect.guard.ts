import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UtilsService } from '../services/util.service';

@Injectable({
  providedIn: 'root',
})
export class IsConnectGuard implements CanActivate {
  constructor(private router: Router, private utilService: UtilsService) {}

  async canActivate(): Promise<boolean> {
    const networkStatus = this.utilService.checkNetwork();

    if (await networkStatus) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }
}
