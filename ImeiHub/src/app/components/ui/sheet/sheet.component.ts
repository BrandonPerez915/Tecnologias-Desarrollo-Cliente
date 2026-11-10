import { Component, input, output, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [CommonModule, IconComponent],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.css']
})
export class SheetComponent implements OnInit, OnDestroy {
  title = input.required<string>();
  subtitle = input<string>('');
  wide = input<boolean>(false);
  close = output<void>();

  private onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') this.close.emit();
  };

  ngOnInit() {
    window.addEventListener('keydown', this.onKey);
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.onKey);
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
