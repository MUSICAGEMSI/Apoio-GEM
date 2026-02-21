// =============================================
// HomeComponent - Landing page
// =============================================

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <main class="page-container">
      <div class="page-content" style="justify-content: center; min-height: 100dvh; padding: 2rem 1rem;">
        <!-- Title -->
        <div class="animate-fade-in" style="text-align: center; margin-bottom: 3rem;">
          <h1 class="font-chalk" style="font-size: 2.5rem; font-weight: 700; color: var(--foreground); line-height: 1.2;">
            Sistema de Gest\u00E3o de Aulas
          </h1>
          <div style="margin-top: 0.5rem; height: 2px; width: 60%; margin-inline: auto; border-radius: 9999px; background: var(--primary); opacity: 0.5;"></div>
        </div>

        <!-- Navigation Cards -->
        <div style="display: flex; flex-direction: column; gap: 1.25rem; max-width: 28rem; margin: 0 auto; width: 100%;">
          <!-- Lancar Aula -->
          <button
            class="animate-fade-in"
            style="animation-delay: 0.2s;"
            (click)="navigate('/lancar-aula')"
          >
            <div class="board-card-interactive" style="text-align: center; padding: 2rem; border-width: 3px; border-color: rgba(212,175,55,0.6);">
              <div style="width: 3.5rem; height: 3.5rem; margin: 0 auto 1rem; border-radius: 50%; border: 2px dashed rgba(212,175,55,0.4); display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                </svg>
              </div>
              <span class="font-chalk" style="font-size: 1.75rem; font-weight: 700; color: var(--foreground);">
                Lan\u00E7ar Aula
              </span>
              <p class="font-chalk" style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--muted-foreground);">
                Registrar presen\u00E7a e conte\u00FAdo
              </p>
            </div>
          </button>

          <!-- Consultar Historico -->
          <button
            class="animate-fade-in"
            style="animation-delay: 0.4s;"
            (click)="navigate('/historico')"
          >
            <div class="board-card-interactive" style="text-align: center; padding: 2rem; border-style: dashed;">
              <div style="width: 3.5rem; height: 3.5rem; margin: 0 auto 1rem; border-radius: 50%; border: 2px dashed var(--board-border); display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
              <span class="font-chalk" style="font-size: 1.75rem; font-weight: 700; color: var(--foreground);">
                Consultar Hist\u00F3rico
              </span>
              <p class="font-chalk" style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--muted-foreground);">
                Visualizar registros anteriores
              </p>
            </div>
          </button>
        </div>
      </div>
    </main>
  `,
  styles: [`
    button { all: unset; display: block; width: 100%; cursor: pointer; }
  `],
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
