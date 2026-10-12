import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  @Input() icon = 'movie_off';
  @Input() title = 'Sin resultados encontrados';
  @Input() description = 'No encontramos películas que coincidan con tus criterios. Intenta con otros términos o limpia los filtros.';
  @Input() actionLabel?: string;

  @Output() actionClick = new EventEmitter<void>();

  onActionClick(): void {
    this.actionClick.emit();
  }
}
