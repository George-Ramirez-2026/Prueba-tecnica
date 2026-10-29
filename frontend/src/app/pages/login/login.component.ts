import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LOGO } from '../../logo';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="auth">
      <div class="auth-brand">
        <span class="brand-plate big"><img [src]="logo" alt="BeConsult" /></span>
        <h1>Administra tus usuarios con seguridad.</h1>
        <p>Acceso al panel interno de BeConsult.</p>
      </div>

      <div class="auth-panel">
        <div class="card auth-card">
          <h2>Iniciar sesión</h2>
          <p class="hint">Ingresa tus credenciales para continuar.</p>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <label for="username">Usuario</label>
            <input id="username" type="text" formControlName="username"
                   [class.invalid]="invalid('username')" autocomplete="username" />
            @if (invalid('username')) { <div class="error">El usuario es obligatorio</div> }

            <label for="password">Contraseña</label>
            <input id="password" type="password" formControlName="password"
                   [class.invalid]="invalid('password')" autocomplete="current-password" />
            @if (invalid('password')) { <div class="error">La contraseña es obligatoria</div> }

            @if (error()) { <div class="alert">{{ error() }}</div> }

            <p><button type="submit" [disabled]="loading()">{{ loading() ? 'Ingresando...' : 'Ingresar' }}</button></p>
          </form>
        </div>
      </div>
    </section>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  logo = LOGO;
  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  loading = signal(false);
  error = signal('');

  invalid(name: 'username' | 'password'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    const { username, password } = this.form.getRawValue();
    this.auth.login(username, password).subscribe({
      next: () => this.router.navigate(['/users']),
      error: (e: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(e.status === 0 ? 'No hay conexión con el servidor' : e.error?.message ?? 'Error al iniciar sesión');
      },
    });
  }
}
