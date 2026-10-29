import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LOGO } from './logo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    @if (auth.isLoggedIn()) {
      <header class="topbar">
        <div class="topbar-inner">
          <span class="brand-plate"><img [src]="logo" alt="BeConsult" /></span>
          <span class="topbar-title">Gestión de usuarios</span>
          <span class="topbar-user">
            <span class="avatar">{{ auth.username()?.charAt(0)?.toUpperCase() }}</span>
            {{ auth.username() }}
            <button class="ghost" (click)="auth.logout()">Salir</button>
          </span>
        </div>
      </header>
    }
    <main [class.container]="auth.isLoggedIn()"><router-outlet /></main>
  `,
})
export class AppComponent {
  auth = inject(AuthService);
  logo = LOGO;
}
