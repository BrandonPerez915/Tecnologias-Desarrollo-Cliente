import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Role } from '../../types/auth';

/**
 * Renders the element only if the user has one of the roles.
 *
 *   <button *appHasRole="'owner'">Eliminar</button>
 *   <section *appHasRole="['owner', 'seller']; else sinPermiso">...</section>
 */
@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);

  appHasRole = input.required<Role | readonly Role[]>();
  appHasRoleElse = input<TemplateRef<unknown> | null>(null);

  private shown: 'main' | 'else' | null = null;

  constructor() {
    effect(() => {
      const allowed = this.authService.hasRole(this.appHasRole());
      const next = allowed ? 'main' : this.appHasRoleElse() ? 'else' : null;
      if (next === this.shown) return;

      this.viewContainer.clear();
      if (next === 'main') {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else if (next === 'else') {
        this.viewContainer.createEmbeddedView(this.appHasRoleElse()!);
      }
      this.shown = next;
    });
  }
}
