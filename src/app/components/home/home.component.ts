import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private commonService: CommonService) {}
  authenticated: boolean = false;
  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.commonService.authenticationSubject.subscribe(
      (authenticationState: boolean) => {
        this.authenticated = authenticationState;
      }
    );
  }

  handleCTA() {
    this.router.navigate(['/signup']);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: any) => {
      subscription.unsubscribe();
    });
  }
}
