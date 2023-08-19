import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, finalize } from 'rxjs';
import { responseConstant } from 'src/app/constants/response.constant';
import { BackendResponse } from 'src/app/models/BackendResponse.model';
import { Data } from 'src/app/models/Data.model';
import { BackendService } from 'src/app/services/backend.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
})
export class DataComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(
    private commonService: CommonService,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    this.commonService.updateSpinnerSubject(true);

    this.form = this.generateForm();

    const beverageNameSubscription = this.form['controls'][
      'beverageName'
    ].valueChanges.subscribe((value: string) => {
      this.commonService.backgroundSubject.next(value);
      this.easterEggMessage(value);
    });
    this.subscriptions.push(beverageNameSubscription);

    this.commonService.updateBackgroundSubject(
      sessionStorage.getItem('background') ?? 'default'
    );

    this.handleGetData();
  }

  generateForm() {
    this.commonService.backgroundSubject.next('default');
    return new FormGroup({
      beverageName: new FormControl({ value: '', disabled: false }, [
        Validators.required,
        Validators.nullValidator,
        Validators.minLength(3),
      ]),
      totalDrinks: new FormControl({ value: '', disabled: false }, [
        Validators.required,
        Validators.nullValidator,
        Validators.min(0),
      ]),
    });
  }

  handleTotalDrinksIncrease() {
    this.form.patchValue({
      totalDrinks: this.form.value.totalDrinks + 1,
    });
  }

  handleTotalDrinksDecrease() {
    this.form.patchValue({
      totalDrinks:
        this.form.value.totalDrinks <= 0 ? 0 : this.form.value.totalDrinks - 1,
    });
  }

  handleSave() {
    const isFormValid = this.validateForm(this.form);
    if (!isFormValid) {
      const errorMessage = this.checkErrorsInForm(this.form);
      this.commonService.logger(errorMessage);
      this.commonService.updateNotificationMessageSubject(errorMessage);
      return;
    }

    const formattedBeverageName =
      this.form.value.beverageName.charAt(0).toUpperCase() +
      this.form.value.beverageName.slice(1).toLowerCase();
    this.form.patchValue({
      beverageName: formattedBeverageName,
    });

    const updateDataRequest: Data = this.form.value as Data;

    this.commonService.logger(updateDataRequest);

    this.commonService.updateSpinnerSubject(true);
    let message: string = '';

    const subscription = this.backendService
      .updateData(updateDataRequest)
      .pipe(
        finalize(() => {
          this.commonService.updateSpinnerSubject(false);
          this.commonService.updateNotificationMessageSubject(message);
          // this.clickedOnSave = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          message = response.message
            ? response.message
            : responseConstant.GENERIC_SUCCESS;

          this.commonService.logger(response);
          this.commonService.updateBackgroundSubject(
            this.form.value.beverageName
          );
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

  handleGetData() {
    let message: string = '';
    const subscription = this.backendService
      .getData()
      .pipe(
        finalize(() => {
          this.commonService.updateSpinnerSubject(false);
          this.commonService.updateNotificationMessageSubject(message);
        })
      )
      .subscribe({
        next: (response: any) => {
          this.commonService.logger(response);

          message = response.message
            ? response.message
            : responseConstant.GENERIC_SUCCESS;

          this.form.patchValue({
            beverageName: response.data.beverageName,
            totalDrinks: response.data.totalDrinks,
          });

          this.commonService.updateBackgroundSubject(
            response.data.beverageName
          );
        },
        error: (error: any) => {
          this.commonService.logger(error);
          if (error.status === 401) {
            this.commonService.handleSignOut();
          }
          this.commonService.updateBackgroundSubject('default');
          if (error.error && error.error.message) {
            message = error.error.message;
          } else {
            message = responseConstant.GENERIC_ERROR;
          }
        },
      });

    this.subscriptions.push(subscription);
  }

  validateForm(form: FormGroup): boolean {
    let validationStatus: boolean = false;
    if (form.status === 'VALID') {
      validationStatus = true;
    }
    return validationStatus;
  }

  checkErrorsInForm(form: FormGroup): string {
    let errorMessage: string = '';

    Object.keys(form.controls).forEach((key) => {
      const controlErrors: any = form.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          if (key === 'beverageName') {
            errorMessage += responseConstant.INVALID_BEVERAGE_NAME;
          }
          if (key === 'totalDrinks') {
            errorMessage += responseConstant.INVALID_TOTAL_DRINKS;
          }
        });
      }
    });

    return errorMessage;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: any) => {
      subscription.unsubscribe();
    });
  }

  easterEggMessage(beverageName: string) {
    let easterEggMessage: string;

    switch (beverageName.toLowerCase()) {
      case 'toilet':
        easterEggMessage = 'Hello, Bear Grylls?';
        break;

      case 'sperm':
      case 'cum':
        easterEggMessage = 'Eww! Who drinks that?';
        break;

      case 'juice':
      case 'fruit juice':
        easterEggMessage = 'And, I thought all Asians are the same!';
        break;

      case 'hot chocolate':
      case 'horlicks':
      case 'boost':
      case 'complan':
        easterEggMessage = 'Ahh, so you are that... guy.';
        break;

      case 'protein shake':
        easterEggMessage = 'Vegan or non-vegan?';
        break;

      case 'energy drink':
      case 'monster':
        easterEggMessage = 'Feeling all good? Energetic, huh?';
        break;

      case 'red bull':
        easterEggMessage = 'Look who just grew a pair of wings?';
        break;

      case 'ice tea':
      case 'black tea':
        easterEggMessage = "That's lame! You could have just entered tea.";
        break;

      case 'smoothie':
      case 'milkshake':
      case 'milk':
        easterEggMessage = 'Nerd detected!';
        break;

      case 'cocktail':
      case 'mojito':
      case 'lemonade':
        easterEggMessage = 'Enjoying that confused life of yours, huh?';
        break;

      case 'blood':
        easterEggMessage = "It's morbin time!";
        break;

      case 'tap water':
      case 'mineral water':
      case 'normal water':
        easterEggMessage = 'Seriously?';
        break;

      case 'fanta':
      case 'limca':
      case 'mazza':
      case 'sprite':
      case 'thumbs up':
      case 'miranda':
      case 'pepsi':
      case '7 up':
      case 'spice up':
      case 'diet coke':
      case 'coca cola':
        easterEggMessage = 'Cheers to your daily sugar rush goals!';
        break;

      default:
        return;
    }

    this.commonService.updateNotificationMessageSubject(easterEggMessage);
  }
}
