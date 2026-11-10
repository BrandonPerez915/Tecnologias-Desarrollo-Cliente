import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { FieldComponent } from '../../../components/ui/field/field.component';
import { PasswordFieldComponent } from '../../../components/ui/password-field/password-field.component';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (!confirmPassword) return null;
  return password === confirmPassword ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotificationService);

  registerForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    }),
    storeName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    phone: new FormControl('', {
      nonNullable: true
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)]
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    acceptTerms: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue]
    })
  }, { validators: passwordsMatchValidator });

  passwordVal = signal('');
  generalError = signal('');
  loading = signal(false);

  strengthLevel = computed(() => {
    const pwd = this.passwordVal();
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

  get nameError(): string {
    const ctrl = this.registerForm.controls.name;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required')) return 'Ingresa tu nombre completo';
    if (ctrl.hasError('minlength')) return 'El nombre debe tener al menos 3 caracteres';
    return '';
  }

  get storeError(): string {
    const ctrl = this.registerForm.controls.storeName;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required')) return 'Ingresa el nombre de tu tienda o taller';
    return '';
  }

  get emailError(): string {
    const ctrl = this.registerForm.controls.email;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required')) return 'Ingresa tu correo electrónico';
    if (ctrl.hasError('email')) return 'Ingresa un correo electrónico válido';
    return '';
  }

  get passwordError(): string {
    const ctrl = this.registerForm.controls.password;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required')) return 'Ingresa una contraseña';
    if (ctrl.hasError('minlength')) return 'La contraseña debe tener al menos 8 caracteres';
    return '';
  }

  get confirmPasswordError(): string {
    const ctrl = this.registerForm.controls.confirmPassword;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required')) return 'Confirma tu contraseña';
    if (this.registerForm.hasError('mismatch')) return 'Las contraseñas no coinciden';
    return '';
  }

  get termsError(): string {
    const ctrl = this.registerForm.controls.acceptTerms;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required')) return 'Debes aceptar los términos y condiciones para continuar';
    return '';
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  onNameChange(val: string) {
    this.registerForm.controls.name.setValue(val);
  }

  onStoreChange(val: string) {
    this.registerForm.controls.storeName.setValue(val);
  }

  onEmailChange(val: string) {
    this.registerForm.controls.email.setValue(val);
  }

  onPhoneChange(val: string) {
    this.registerForm.controls.phone.setValue(val);
  }

  onPasswordChange(val: string) {
    this.registerForm.controls.password.setValue(val);
    this.passwordVal.set(val);
    this.registerForm.controls.confirmPassword.updateValueAndValidity();
    this.registerForm.updateValueAndValidity();
  }

  onConfirmPasswordChange(val: string) {
    this.registerForm.controls.confirmPassword.setValue(val);
    this.registerForm.updateValueAndValidity();
  }

  async handleSubmit(event: Event) {
    event.preventDefault();

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.generalError.set('');

    const formValues = this.registerForm.getRawValue();

    try {
      await this.authService.register({
        name: formValues.name.trim(),
        storeName: formValues.storeName.trim(),
        email: formValues.email.trim(),
        phone: formValues.phone.trim() || undefined,
        password: formValues.password
      });
    } catch (err: any) {
      this.generalError.set(err?.message || 'Error al crear la cuenta. Intenta de nuevo.');
      this.notify.error('No se pudo completar el registro');
    } finally {
      this.loading.set(false);
    }
  }
}
