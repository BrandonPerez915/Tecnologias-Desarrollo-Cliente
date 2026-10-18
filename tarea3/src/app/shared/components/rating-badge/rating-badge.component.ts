import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-badge.component.html',
  styleUrl: './rating-badge.component.scss',
})
export class RatingBadgeComponent {
  @Input({ required: true }) rating!: number;
  @Input() votesCount?: string;
  @Input() size: 'sm' | 'md' = 'sm';
}
