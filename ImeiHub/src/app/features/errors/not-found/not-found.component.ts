import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './not-found.component.html',
  styleUrls: ['../error-view.css']
})
export class NotFoundComponent {
  private router = inject(Router);
  isAuthenticated = inject(AuthService).isAuthenticated;
  path = this.router.url;

  goBack() {
    this.router.navigate([this.isAuthenticated() ? '/dashboard' : '/login']);
  }
}
