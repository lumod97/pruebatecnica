import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-notification-bar',
  standalone: true,
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss'],
  imports: [
    CommonModule
  ]
})
export class NotificationBarComponent {
  message: string = '';
  isVisible: boolean = false;

  showNotification(message: string): void {
    this.message = message;
    this.isVisible = true;

    setTimeout(() => {
      this.isVisible = false;
    }, 5000);
  }
}
