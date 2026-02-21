// =============================================
// TurmaSelectComponent - Class grid selection
// =============================================

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CLASSES_DATA } from '../../../data/classes.data';
import { ClassInfo } from '../../../models/lesson.model';

@Component({
  selector: 'app-turma-select',
  standalone: true,
  template: `
    <main class="page-container">
      <div class="page-content">
        <!-- Header -->
        <header class="page-header">
          <button class="btn-back" (click)="goBack()" aria-label="Voltar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
          </button>
        </header>

        <!-- Title -->
        <div class="animate-fade-in" style="text-align: center; padding: 1rem;">
          <h1 class="font-chalk" style="font-size: 1.75rem; font-weight: 700; color: var(--foreground);">
            Selecione a Turma
          </h1>
        </div>

        <div class="chalk-divider"></div>

        <!-- Class grid -->
        <div class="class-grid stagger-children" style="padding: 0 1rem 2rem;">
          @for (cls of classes; track cls.id) {
            <button
              class="animate-slide-in"
              (click)="selectClass(cls.id)"
              style="all: unset; display: block; width: 100%; cursor: pointer;"
            >
              <div class="board-card-interactive" style="text-align: center; padding: 1.5rem;">
                <div class="font-chalk" style="font-size: 1rem; color: var(--muted-foreground);">
                  {{ cls.title }}
                </div>
                <div class="font-chalk" style="font-size: 1.5rem; font-weight: 700; color: var(--foreground);">
                  {{ cls.subtitle }}
                </div>
              </div>
            </button>
          }
        </div>
      </div>
    </main>
  `,
  styles: [`
    .class-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
    @media (min-width: 768px) {
      .class-grid { gap: 1rem; }
    }
  `],
})
export class TurmaSelectComponent {
  classes = CLASSES_DATA;

  constructor(private router: Router) {}

  selectClass(id: string): void {
    this.router.navigate(['/lancar-aula', id]);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
