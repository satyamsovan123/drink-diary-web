import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, finalize } from 'rxjs';
import { responseConstant } from 'src/app/constants/response.constant';
import { BackendService } from 'src/app/services/backend.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
})
export class HelpComponent implements OnInit, OnDestroy {
  constructor(
    private commonService: CommonService,
    private backendService: BackendService
  ) {}
  authenticated: boolean = false;
  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.commonService.authenticationSubject.subscribe(
      (authenticationState: boolean) => {
        this.authenticated = authenticationState;
      }
    );
  }

  handleDeleteAccount() {
    let message: string = '';
    const subscription = this.backendService
      .deleteAccount()
      .pipe(
        finalize(() => {
          this.commonService.updateSpinnerSubject(false);
          this.commonService.updateNotificationMessageSubject(message);
        })
      )
      .subscribe({
        next: (response: any) => {
          message = response.message
            ? response.message
            : responseConstant.GENERIC_SUCCESS;

          this.commonService.logger(response);
          this.commonService.handleSignOut();
        },
        error: (error: any) => {
          this.commonService.logger(error);
          if (error.status === 401) {
            this.commonService.handleSignOut();
          }
          if (error.error && error.error.message) {
            message = error.error.message;
          } else {
            message = responseConstant.GENERIC_ERROR;
          }
        },
      });

    this.subscriptions.push(subscription);
  }

  handleDeleteData() {
    let message: string = '';
    const subscription = this.backendService
      .deleteData()
      .pipe(
        finalize(() => {
          this.commonService.updateSpinnerSubject(false);
          this.commonService.updateNotificationMessageSubject(message);
        })
      )
      .subscribe({
        next: (response: any) => {
          message = response.message
            ? response.message
            : responseConstant.GENERIC_SUCCESS;

          this.commonService.updateBackgroundSubject('default');
          this.commonService.logger(response);
        },
        error: (error: any) => {
          this.commonService.logger(error);
          if (error.status === 401) {
            this.commonService.handleSignOut();
          }
          if (error.error && error.error.message) {
            message = error.error.message;
          } else {
            message = responseConstant.GENERIC_ERROR;
          }
        },
      });

    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: any) => {
      subscription.unsubscribe();
    });
  }
}
