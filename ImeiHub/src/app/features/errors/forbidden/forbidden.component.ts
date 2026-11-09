import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './forbidden.component.html',
  styleUrls: ['../error-view.css']
})
export class ForbiddenComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  // Query param set by the role guard
  from = input<string>();
  roleLabel = this.authService.roleLabel;

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
