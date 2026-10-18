import { Component, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandLogoComponent } from '../../../components/ui/brand-logo/brand-logo.component';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { StatusBadgeComponent } from '../../../components/ui/status-badge/status-badge.component';
import { AmountComponent } from '../../../components/ui/amount/amount.component';
import { FeatureCardComponent } from '../../../components/ui/feature-card/feature-card.component';
import {
  landingFeatures,
  landingModules,
  landingStats,
  landingWorkflowSteps,
} from '../../../data/landing';
import { Screen } from '../../../types/navigation';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    BrandLogoComponent,
    ButtonComponent,
    IconComponent,
    StatusBadgeComponent,
    AmountComponent,
    FeatureCardComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  navigate = output<Screen>();
  notify = output<string>();

  stats = landingStats;
  features = landingFeatures;
  modules = landingModules;
  workflowSteps = landingWorkflowSteps;

  selectedModuleId = signal<Screen>('home');

  activeModule = computed(
    () =>
      this.modules.find((m) => m.id === this.selectedModuleId()) ||
      this.modules[0]
  );

  enterDemo(target: Screen) {
    this.notify.emit('Modo demostración activo · Puesto A-18 (Ada Okafor)');
    this.navigate.emit(target);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
