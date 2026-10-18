import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Notifications } from './core/services/notifications';
import { Toast } from './shared/components/toast/toast';

@Component({
  imports: [RouterOutlet, Toast],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly toast = inject(Notifications).toast;
}
