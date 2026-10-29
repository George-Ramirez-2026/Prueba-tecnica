import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="card">
      <div class="toolbar">
        <h2>Usuarios</h2>
        <a routerLink="/users/new"><button>Nuevo usuario</button></a>
      </div>

      @if (error()) { <div class="alert">{{ error() }}</div> }

      <table>
        <thead>
          <tr><th>ID</th><th>Username</th><th>Email</th><th>Estado</th><th>Creado</th><th></th></tr>
        </thead>
        <tbody>
          @for (u of users(); track u.id; let i = $index) {
            <tr [style.--i]="i">
              <td>{{ u.id }}</td>
              <td>{{ u.username }}</td>
              <td>{{ u.email }}</td>
              <td><span class="badge" [class.on]="u.estado" [class.off]="!u.estado">{{ u.estado ? 'Activo' : 'Inactivo' }}</span></td>
              <td>{{ u.fechaCreacion | date: 'dd/MM/yyyy HH:mm' }}</td>
              <td><div class="actions">
                <a [routerLink]="['/users', u.id, 'edit']"><button class="secondary">Editar</button></a>
                <button class="danger" (click)="remove(u)">Eliminar</button>
              </div></td>
            </tr>
          } @empty {
            <tr><td colspan="6">No hay usuarios.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class UsersComponent implements OnInit {
  private service = inject(UserService);
  users = signal<User[]>([]);
  error = signal('');

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe({
      next: (u) => this.users.set(u),
      error: (e: HttpErrorResponse) => this.error.set(e.error?.message ?? 'Error al cargar usuarios'),
    });
  }

  remove(u: User): void {
    if (!confirm(`¿Eliminar al usuario "${u.username}"?`)) return;
    this.service.delete(u.id).subscribe({
      next: () => this.load(),
      error: (e: HttpErrorResponse) => this.error.set(e.error?.message ?? 'Error al eliminar'),
    });
  }
}
