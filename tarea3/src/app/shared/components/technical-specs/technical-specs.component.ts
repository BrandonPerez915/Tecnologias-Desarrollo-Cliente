import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicalSheet } from '../../models/movie.model';

@Component({
  selector: 'app-technical-specs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technical-specs.component.html',
  styleUrl: './technical-specs.component.scss',
})
export class TechnicalSpecsComponent {
  @Input({ required: true }) specs!: TechnicalSheet;
}
