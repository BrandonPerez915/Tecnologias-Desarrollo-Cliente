import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { FieldComponent } from '../../../components/ui/field/field.component';
import { PasswordFieldComponent } from '../../../components/ui/password-field/password-field.component';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AuthLayoutComponent,
    FieldComponent,
    PasswordFieldComponent,
    ButtonComponent,
    IconComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notifyService = inject(NotificationService);

  loginSuccess = output<{ email: string; name?: string }>();
  switchToRegister = output<void>();
  backToDashboard = output<void>();
  notify = output<string>();

  email = signal('');
  password = signal('');
  rememberMe = true;

  emailError = signal('');
  passwordError = signal('');
  generalError = signal('');
  loading = signal(false);

  showRecoveryModal = signal(false);
  recoveryEmail = signal('');

  onEmailChange(val: string) {
    this.email.set(val);
    if (this.emailError()) this.validateEmail();
    this.generalError.set('');
  }

  onPasswordChange(val: string) {
    this.password.set(val);
    if (this.passwordError()) this.validatePassword();
    this.generalError.set('');
  }

  validateEmail(): boolean {
    const val = this.email().trim();
    if (!val) {
      this.emailError.set('Ingresa tu correo electrónico o usuario');
      return false;
    }
    if (val.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      this.emailError.set('Ingresa un formato de correo electrónico válido');
      return false;
    }
    this.emailError.set('');
    return true;
  }

  validatePassword(): boolean {
    const val = this.password();
    if (!val) {
      this.passwordError.set('Ingresa tu contraseña');
      return false;
    }
    if (val.length < 6) {
      this.passwordError.set('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    this.passwordError.set('');
    return true;
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    this.loading.set(true);
    this.generalError.set('');

    try {
      const user = await this.authService.login({
        email: this.email().trim(),
        password: this.password()
      });
      this.loading.set(false);
      this.loginSuccess.emit({ email: user.email, name: user.name });
    } catch {
      this.loading.set(false);
      this.generalError.set('Credenciales incorrectas o error en el servidor');
    }
  }

  goToRegister() {
    this.switchToRegister.emit();
    this.router.navigate(['/register']);
  }

  handleForgotPassword() {
    this.recoveryEmail.set(this.email() || '');
    this.showRecoveryModal.set(true);
  }

  sendPasswordReset() {
    const emailToReset = this.recoveryEmail().trim();
    if (!emailToReset || !emailToReset.includes('@')) {
      this.notifyService.warning('Por favor ingresa un correo válido');
      return;
    }

    this.showRecoveryModal.set(false);
    this.notifyService.success(`Enlace de recuperación enviado a ${emailToReset}`);
  }
}
