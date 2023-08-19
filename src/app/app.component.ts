import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonService } from './services/common.service';
import { backgroundConstant } from './constants/background.constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterContentChecked {
  title = 'Drink Diary';
  disableBackground: boolean = true;

  constructor(
    private commonService: CommonService,
    private cd: ChangeDetectorRef
  ) {}
  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }
  ngOnInit(): void {
    this.commonService.checkSavedCredentials();
    this.commonService.spinnerSubject.subscribe((disableBackground) => {
      this.disableBackground = disableBackground;
    });
    this.commonService.backgroundSubject.subscribe((background) => {
      document.body.style.background = this.getBackgroundStyle(background);
    });
  }

  getBackgroundStyle(background: string): string {
    let style: string;

    switch (background.toLowerCase()) {
      case 'water':
        style = backgroundConstant.water;
        break;

      case 'tea':
        style = backgroundConstant.tea;
        break;

      case 'beer':
        style = backgroundConstant.beer;
        break;

      case 'coffee':
      case 'latte':
      case 'espresso':
      case 'cappuccino':
      case 'black coffee':
        style = backgroundConstant.coffee;
        break;

      case 'coke':
      case 'cola':
        style = backgroundConstant.carbonatedDrink;
        break;

      default:
        style = backgroundConstant.default;
        break;
    }

    return style;
  }
}
