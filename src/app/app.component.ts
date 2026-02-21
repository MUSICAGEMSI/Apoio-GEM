// =============================================
// AppComponent - Root Shell
// =============================================

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <!-- Chalkboard texture overlay -->
    <div class="chalkboard-texture" aria-hidden="true"></div>
    <!-- Theme toggle button -->
    <button
      (click)="toggleTheme()"
      [title]="isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro'"
      style="position: fixed; top: 1rem; right: 1rem; z-index: 100; width: 2.25rem; height: 2.25rem; border-radius: 50%; border: 1px solid var(--board-border); background: var(--card); color: var(--foreground); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.15);"
    >
      @if (isLight) {
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      } @else {
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      }
    </button>
    <!-- Router outlet for page content -->
    <router-outlet />
  `,
})
export class AppComponent {
  title = 'Sistema de Gestão de Aulas';
  isLight = false;

  toggleTheme(): void {
    this.isLight = !this.isLight;
    const el = document.documentElement;
    if (this.isLight) {
      el.classList.add('theme-light');
    } else {
      el.classList.remove('theme-light');
    }
  }
}
