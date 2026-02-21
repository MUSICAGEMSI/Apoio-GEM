// =============================================
// App Routes - Angular 19 Standalone
// =============================================

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'lancar-aula',
    loadComponent: () =>
      import('./pages/lancar-aula/turma-select/turma-select.component').then(m => m.TurmaSelectComponent),
  },
  {
    path: 'lancar-aula/:turmaId',
    loadComponent: () =>
      import('./pages/lancar-aula/attendance/attendance.component').then(m => m.AttendanceComponent),
  },
  {
    path: 'lancar-aula/:turmaId/dashboard',
    loadComponent: () =>
      import('./pages/lancar-aula/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'historico',
    loadComponent: () =>
      import('./pages/historico/historico-home/historico-home.component').then(m => m.HistoricoHomeComponent),
  },
  {
    path: 'historico/turma',
    loadComponent: () =>
      import('./pages/historico/turma-list/turma-list.component').then(m => m.TurmaListComponent),
  },
  {
    path: 'historico/turma/:turmaId',
    loadComponent: () =>
      import('./pages/historico/turma-detail/turma-detail.component').then(m => m.TurmaDetailComponent),
  },
  {
    path: 'historico/turma/:turmaId/:lessonId',
    loadComponent: () =>
      import('./pages/historico/lesson-detail/lesson-detail.component').then(m => m.LessonDetailComponent),
  },
  {
    path: 'historico/aluno',
    loadComponent: () =>
      import('./pages/historico/aluno-list/aluno-list.component').then(m => m.AlunoListComponent),
  },
  {
    path: 'historico/aluno/:studentName',
    loadComponent: () =>
      import('./pages/historico/aluno-detail/aluno-detail.component').then(m => m.AlunoDetailComponent),
  },
  { path: '**', redirectTo: '' },
];
