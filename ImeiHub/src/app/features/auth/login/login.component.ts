import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    ReactiveFormsModule,
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
  private route = inject(ActivatedRoute);
  private notifyService = inject(NotificationService);

  // Set by the auth guard and by the session expiry handler
  private returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  sessionNotice = signal(
    this.route.snapshot.queryParamMap.get('reason') === 'expired'
      ? 'Tu sesión expiró. Inicia sesión de nuevo para continuar donde te quedaste.'
      : this.returnUrl
        ? 'Inicia sesión para continuar a la sección que solicitaste.'
        : ''
  );

  loginSuccess = output<{ email: string; name?: string }>();
  switchToRegister = output<void>();
  backToDashboard = output<void>();
  notify = output<string>();

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)]
    }),
    rememberMe: new FormControl(true, { nonNullable: true })
  });

  generalError = signal('');
  loading = signal(false);

  showRecoveryModal = signal(false);
  recoveryEmail = signal('');

  get emailError(): string {
    const ctrl = this.loginForm.controls.email;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required')) return 'Ingresa tu correo electrónico o usuario';
    if (ctrl.hasError('email')) return 'Ingresa un formato de correo electrónico válido';
    return '';
  }

  get passwordError(): string {
    const ctrl = this.loginForm.controls.password;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required')) return 'Ingresa tu contraseña';
    if (ctrl.hasError('minlength')) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  }

  onEmailChange(val: string) {
    this.loginForm.controls.email.setValue(val);
    this.generalError.set('');
  }

  onPasswordChange(val: string) {
    this.loginForm.controls.password.setValue(val);
    this.generalError.set('');
  }

  async handleSubmit(event: Event) {
    event.preventDefault();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.generalError.set('');

    try {
      const { email, password } = this.loginForm.getRawValue();
      const user = await this.authService.login(
        { email: email.trim(), password },
        this.returnUrl
      );
      this.loading.set(false);
      this.loginSuccess.emit({ email: user.email, name: user.name });
    } catch (err: any) {
      this.loading.set(false);
      this.generalError.set(err?.message || 'Correo o contraseña incorrectos');
    }
  }

  goToRegister() {
    this.switchToRegister.emit();
    this.router.navigate(['/register']);
  }

  handleForgotPassword() {
    this.recoveryEmail.set(this.loginForm.controls.email.value || '');
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
