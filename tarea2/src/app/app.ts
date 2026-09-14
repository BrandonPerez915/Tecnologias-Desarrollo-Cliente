import { Component, signal } from '@angular/core';
import { TableDisplay } from './components/table-display/table-display';

@Component({
  imports: [TableDisplay],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('tarea2');
}
