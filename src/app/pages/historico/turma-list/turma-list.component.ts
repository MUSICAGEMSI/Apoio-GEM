// =============================================
// TurmaListComponent - List all turmas for history
// =============================================

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CLASSES_DATA } from '../../../data/classes.data';
import { LessonService } from '../../../services/lesson.service';

@Component({
  selector: 'app-turma-list',
  standalone: true,
  template: `
    <main class="page-container">
      <div class="page-content">
        <header class="page-header">
          <button class="btn-back" (click)="router.navigate(['/historico'])" aria-label="Voltar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
          </button>
        </header>

        <div class="animate-fade-in" style="text-align: center; padding: 1rem;">
          <h1 class="font-chalk" style="font-size: 1.75rem; font-weight: 700; color: var(--foreground);">
            Selecione a Turma
          </h1>
        </div>

        <div class="chalk-divider"></div>

        <div class="stagger-children" style="display: flex; flex-direction: column; gap: 0.5rem; padding: 0 1rem 2rem;">
          @for (cls of classes; track cls.id) {
            <button class="animate-slide-in" style="all: unset; width: 100%; cursor: pointer;" (click)="select(cls.id)">
              <div class="board-card-interactive" style="display: flex; align-items: center; justify-content: space-between; padding: 1rem;">
                <div>
                  <span class="font-chalk" style="font-size: 1rem; font-weight: 700; color: var(--foreground);">{{ cls.fullName }}</span>
                  <p class="font-chalk" style="font-size: 0.75rem; color: var(--muted-foreground);">
                    {{ getFrequency(cls.id).totalLessons }} registros
                  </p>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </button>
          }
        </div>
      </div>
    </main>
  `,
})
export class TurmaListComponent {
  classes = CLASSES_DATA;
  private lessonService = inject(LessonService);

  constructor(public router: Router) {}

  select(id: string): void {
    this.router.navigate(['/historico/turma', id]);
  }

  getFrequency(turmaId: string) {
    return this.lessonService.getTurmaFrequency(turmaId);
  }
}
