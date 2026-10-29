import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserPayload } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="card narrow">
      <h2>{{ id ? 'Editar usuario' : 'Nuevo usuario' }}</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label for="username">Username</label>
        <input id="username" type="text" formControlName="username" [class.invalid]="invalid('username')" />
        @if (invalid('username')) { <div class="error">Obligatorio (3 a 50 caracteres)</div> }

        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" [class.invalid]="invalid('email')" />
        @if (invalid('email')) { <div class="error">Ingrese un email válido</div> }

        <label for="password">Contraseña {{ id ? '(dejar vacío para no cambiarla)' : '' }}</label>
        <input id="password" type="password" formControlName="password" [class.invalid]="invalid('password')" autocomplete="new-password" />
        @if (invalid('password')) { <div class="error">{{ id ? 'Mínimo 6 caracteres' : 'Obligatoria (mínimo 6 caracteres)' }}</div> }

        <label><input type="checkbox" formControlName="estado" /> Activo</label>

        @if (error()) { <div class="alert">{{ error() }}</div> }

        <p class="actions">
          <button type="submit" [disabled]="saving()">Guardar</button>
          <a routerLink="/users"><button type="button" class="secondary">Cancelar</button></a>
        </p>
      </form>
    </div>
  `,
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null;
  saving = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    estado: [true],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      // En edición la contraseña es opcional
      this.form.controls.password.setValidators([Validators.minLength(6)]);
      this.form.controls.password.updateValueAndValidity();
      this.service.getById(this.id).subscribe({
        next: (u) => this.form.patchValue({ username: u.username, email: u.email, estado: u.estado }),
        error: (e: HttpErrorResponse) => this.error.set(e.error?.message ?? 'No se pudo cargar el usuario'),
      });
    }
  }

  invalid(name: 'username' | 'email' | 'password'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.error.set('');
    const v = this.form.getRawValue();
    const payload: UserPayload = { username: v.username, email: v.email, estado: v.estado };
    if (v.password) payload.password = v.password;

    const request$ = this.id ? this.service.update(this.id, payload) : this.service.create(payload);
    request$.subscribe({
      next: () => this.router.navigate(['/users']),
      error: (e: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(e.error?.message ?? 'Error al guardar');
      },
    });
  }
}
