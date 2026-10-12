import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CastMember {
  name: string;
  role: string;
  avatarUrl: string;
}

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
