import { Component } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent {
  constructor(private commonService: CommonService) {}
  notificationMessage: string = '';

  ngOnInit(): void {
    this.commonService.notificationMessageSubject$.subscribe(
      (notificationMessage: string) => {
        this.notificationMessage = notificationMessage;
      }
    );
  }

  clearNotification() {
    this.commonService.updateNotificationMessageSubject('');
  }
}
