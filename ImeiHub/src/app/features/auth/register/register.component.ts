import { Component, signal, computed, inject } from '@angular/core';
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
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotificationService);

  name = signal('');
  storeName = signal('');
  email = signal('');
  phone = signal('');
  password = signal('');
  confirmPassword = signal('');
  acceptTerms = false;

  nameError = signal('');
  storeError = signal('');
  emailError = signal('');
  passwordError = signal('');
  confirmPasswordError = signal('');
  termsError = signal('');
  generalError = signal('');
  loading = signal(false);

  strengthLevel = computed(() => {
    const pwd = this.password();
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.min(3, Math.max(1, score));
  });

  strengthText = computed(() => {
    switch (this.strengthLevel()) {
      case 1:
        return 'Débil';
      case 2:
        return 'Media';
      case 3:
        return 'Fuerte';
      default:
        return '';
    }
  });

  strengthColorClass = computed(() => {
    switch (this.strengthLevel()) {
      case 1:
        return 'text-danger';
      case 2:
        return 'text-warning';
      case 3:
        return 'text-success';
      default:
        return '';
    }
  });

  goToLogin() {
    this.router.navigate(['/login']);
  }

  onNameChange(val: string) {
    this.name.set(val);
    if (this.nameError()) this.validateName();
  }

  onStoreChange(val: string) {
    this.storeName.set(val);
    if (this.storeError()) this.validateStore();
  }

  onEmailChange(val: string) {
    this.email.set(val);
    if (this.emailError()) this.validateEmail();
  }

  onPasswordChange(val: string) {
    this.password.set(val);
    if (this.passwordError()) this.validatePassword();
    if (this.confirmPassword()) this.validateConfirmPassword();
  }

  onConfirmPasswordChange(val: string) {
    this.confirmPassword.set(val);
    if (this.confirmPasswordError()) this.validateConfirmPassword();
  }

  validateName(): boolean {
    if (!this.name().trim()) {
      this.nameError.set('Ingresa tu nombre completo');
      return false;
    }
    if (this.name().trim().length < 3) {
      this.nameError.set('El nombre debe tener al menos 3 caracteres');
      return false;
    }
    this.nameError.set('');
    return true;
  }

  validateStore(): boolean {
    if (!this.storeName().trim()) {
      this.storeError.set('Ingresa el nombre de tu tienda o taller');
      return false;
    }
    this.storeError.set('');
    return true;
  }

  validateEmail(): boolean {
    const val = this.email().trim();
    if (!val) {
      this.emailError.set('Ingresa tu correo electrónico');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      this.emailError.set('Ingresa un correo electrónico válido');
      return false;
    }
    this.emailError.set('');
    return true;
  }

  validatePassword(): boolean {
    const val = this.password();
    if (!val) {
      this.passwordError.set('Ingresa una contraseña');
      return false;
    }
    if (val.length < 8) {
      this.passwordError.set('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    this.passwordError.set('');
    return true;
  }

  validateConfirmPassword(): boolean {
    if (!this.confirmPassword()) {
      this.confirmPasswordError.set('Confirma tu contraseña');
      return false;
    }
    if (this.confirmPassword() !== this.password()) {
      this.confirmPasswordError.set('Las contraseñas no coinciden');
      return false;
    }
    this.confirmPasswordError.set('');
    return true;
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    const v1 = this.validateName();
    const v2 = this.validateStore();
    const v3 = this.validateEmail();
    const v4 = this.validatePassword();
    const v5 = this.validateConfirmPassword();

    if (!this.acceptTerms) {
      this.termsError.set('Debes aceptar los términos y condiciones para continuar');
    } else {
      this.termsError.set('');
    }

    if (!v1 || !v2 || !v3 || !v4 || !v5 || !this.acceptTerms) {
      return;
    }

    this.loading.set(true);
    this.generalError.set('');

    try {
      await this.authService.register({
        name: this.name().trim(),
        storeName: this.storeName().trim(),
        email: this.email().trim(),
        phone: this.phone().trim() || undefined,
        password: this.password()
      });
    } catch (err: any) {
      this.generalError.set(err?.message || 'Error al crear la cuenta. Intenta de nuevo.');
      this.notify.error('No se pudo completar el registro');
    } finally {
      this.loading.set(false);
    }
  }
}
