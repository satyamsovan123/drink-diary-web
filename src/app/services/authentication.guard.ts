import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { CommonService } from './common.service';

@Injectable()
export class AuthenticationGuard {
  constructor(private commonService: CommonService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let value: boolean = false;
    const currentPath = route.url[0].path;

    this.commonService.authenticationSubject.subscribe(
      (authenticationState: boolean) => {
        value = authenticationState;

        return value;
      }
    );

    if (currentPath === 'signin' || currentPath === 'signup') {
      return !value;
    }

    return value;
  }
}
