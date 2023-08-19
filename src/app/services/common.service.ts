import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private router: Router) {}

  logger(data: any) {
    if (environment.production) {
      return;
    }
  }

  spinnerSubject = new BehaviorSubject<boolean>(false);
  spinnerSubject$ = this.spinnerSubject.asObservable();

  authenticationSubject = new BehaviorSubject<boolean>(false);
  authenticationSubject$ = this.authenticationSubject.asObservable();

  backgroundSubject = new BehaviorSubject<string>('default');
  backgroundSubject$ = this.backgroundSubject.asObservable();

  notificationMessageSubject = new BehaviorSubject<string>('');
  notificationMessageSubject$ = this.notificationMessageSubject.asObservable();

  updateSpinnerSubject(spinnerState: boolean) {
    this.spinnerSubject.next(spinnerState);
  }

  updateNotificationMessageSubject(message: string) {
    this.notificationMessageSubject.next(message);
    setTimeout(() => {
      this.notificationMessageSubject.next('');
    }, 5000);
  }

  updateBackgroundSubject(background: string) {
    this.background = background;
    this.backgroundSubject.next(background);
  }

  updateAuthenticationSubject(authenticationState: boolean) {
    this.authenticationSubject.next(authenticationState);
  }

  handleSignOut() {
    this.updateAuthenticationSubject(false);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('background');
    this.backgroundSubject.next('default');
    this.router.navigate(['/signin']);
  }

  set token(token: string) {
    sessionStorage.setItem('token', token);
  }

  get token(): string {
    return sessionStorage.getItem('token') ?? '';
  }

  set background(background: string) {
    sessionStorage.setItem('background', background);
  }

  get background(): string {
    return sessionStorage.getItem('background') ?? 'default';
  }

  checkSavedCredentials() {
    try {
      const sessionStorageToken = sessionStorage.getItem('token');
      const sessionStorageBackground = sessionStorage.getItem('background');

      if (sessionStorageToken && sessionStorageBackground) {
        this.token = sessionStorageToken;
        this.background = sessionStorageBackground;

        this.updateBackgroundSubject(this.background);
        this.updateAuthenticationSubject(true);
      } else {
        this.handleSignOut();
      }
    } catch (error) {
      this.handleSignOut();
      this.logger(error);
    }
  }
}
