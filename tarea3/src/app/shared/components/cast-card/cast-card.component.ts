import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CastMember } from '../../models/movie.model';

@Component({
  selector: 'app-cast-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cast-card.component.html',
  styleUrl: './cast-card.component.scss',
})
export class CastCardComponent {
  @Input({ required: true }) member!: CastMember;
}
