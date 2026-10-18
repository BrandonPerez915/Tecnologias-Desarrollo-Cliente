import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SheetComponent } from '../../../components/ui/sheet/sheet.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';

@Component({
  selector: 'app-date-picker-sheet',
  standalone: true,
  imports: [CommonModule, SheetComponent, IconComponent],
  templateUrl: './date-picker-sheet.component.html',
  styleUrls: ['./date-picker-sheet.component.css']
})
export class DatePickerSheetComponent {
  selectedDay = input.required<number>();
  select = output<number>();
  close = output<void>();

  weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  days = Array.from({ length: 30 }, (_, index) => index + 1);
}
