// =============================================
// AttendanceComponent - Chamada (P/F) with localStorage draft persistence
// =============================================

import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AttendanceToggleComponent } from '../../../components/attendance-toggle/attendance-toggle.component';
import { LessonService } from '../../../services/lesson.service';
import { AttendanceMap, ClassInfo } from '../../../models/lesson.model';

const DAY_NAMES = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [FormsModule, AttendanceToggleComponent],
  template: `
    <main class="page-container">
      <div class="page-content">
        <!-- Header -->
        <header class="page-header">
          <button class="btn-back" (click)="goBack()" aria-label="Voltar para turmas">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
          </button>
        </header>

        <!-- Class Title -->
        <div class="animate-fade-in" style="text-align: center; padding: 0.5rem 1rem;">
          <div style="display: inline-block; border: 2px dashed var(--board-border); border-radius: var(--radius-xl); padding: 0.75rem 1.5rem;">
            <h1 class="font-chalk" style="font-size: 1.75rem; font-weight: 700; color: var(--foreground);">
              {{ classInfo?.fullName || turmaId }}
            </h1>
          </div>
        </div>

        <!-- Date Picker -->
        <div class="animate-fade-in" style="animation-delay: 0.15s; padding: 1rem;">
          <label class="font-chalk" style="display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">
            Data da Aula
          </label>
          <div 
            (click)="focusDateInput()"
            style="display: flex; align-items: center; gap: 0.75rem; border: 2px dashed var(--board-border); border-radius: var(--radius-xl); padding: 0.75rem 1rem; background: var(--card); cursor: pointer; transition: border-color 0.2s;" 
            class="date-picker-container"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>
            </svg>
            <input
              #dateInput
              type="date"
              [value]="selectedDate"
              [max]="todayStr"
              (change)="onDateChange($event)"
              class="font-chalk"
              style="flex: 1; background: transparent; border: none; outline: none; color: var(--foreground); font-size: 1.125rem; cursor: pointer;"
            />
          </div>
        </div>

        <!-- Saturday warning modal -->
        @if (showSaturdayModal) {
          <div style="position: fixed; inset: 0; z-index: 200; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); padding: 1rem;">
            <div style="width: 100%; max-width: 22rem; border-radius: var(--radius-xl); border: 2px solid var(--board-border); background: var(--card); padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; color: rgb(230,160,50);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
                </svg>
                <span class="font-chalk" style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Atenção</span>
              </div>
              <p class="font-chalk" style="font-size: 1rem; color: var(--foreground); line-height: 1.5;">
                Você selecionou <strong>{{ pendingDayName }}</strong>. Habitualmente as aulas ocorrem aos sábados. Deseja continuar?
              </p>
              <div style="display: flex; gap: 0.75rem;">
                <button type="button" (click)="cancelDateModal()"
                  style="flex: 1; padding: 0.75rem; border-radius: var(--radius-md); border: 2px solid rgba(220,70,70,0.6); background: rgba(220,70,70,0.1); color: rgb(220,70,70); font-family: var(--font-chalk); font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.2s;">
                  Cancelar
                </button>
                <button type="button" (click)="confirmDateModal()"
                  style="flex: 1; padding: 0.75rem; border-radius: var(--radius-md); border: 2px solid rgba(230,160,50,0.6); background: rgba(230,160,50,0.1); color: rgb(230,160,50); font-family: var(--font-chalk); font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.2s;">
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        }

        <!-- Student List -->
        <div class="animate-fade-in" style="animation-delay: 0.3s; padding: 0 1rem 1rem;">
          <!-- Column Headers -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span class="font-chalk" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">
                Matriculados
              </span>
              <span style="background: var(--secondary); padding: 0.125rem 0.5rem; border-radius: var(--radius-sm); font-family: var(--font-chalk); font-size: 0.75rem; color: var(--secondary-foreground);">
                {{ students.length }}
              </span>
            </div>
            <span class="font-chalk" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">
              Presença
            </span>
          </div>

          <!-- Chalk line -->
          <div style="height: 2px; border-radius: 9999px; background: var(--board-border); opacity: 0.6; margin-bottom: 0.75rem;"></div>

          <!-- Student rows -->
          <div class="stagger-children" style="display: flex; flex-direction: column; gap: 0.5rem;">
            @for (student of students; track student; let i = $index) {
              <div class="animate-slide-in" style="display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--board-border); border-radius: var(--radius-xl); background: var(--card); padding: 0.625rem 0.75rem; transition: border-color 0.2s;">
                <div style="display: flex; align-items: center; gap: 0.625rem; min-width: 0; flex: 1;">
                  <span style="display: flex; align-items: center; justify-content: center; width: 1.75rem; height: 1.75rem; border-radius: 50%; background: var(--secondary); font-family: var(--font-chalk); font-size: 0.75rem; color: var(--secondary-foreground); flex-shrink: 0;">
                    {{ i + 1 }}
                  </span>
                  <span class="font-chalk" style="font-size: 0.875rem; color: var(--card-foreground); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    {{ student }}
                  </span>
                </div>
                <app-attendance-toggle
                  [defaultValue]="getAttendanceValue(student)"
                  (attendanceChange)="onAttendanceChange(student, $event)"
                />
              </div>
            }
          </div>
        </div>

        <!-- Summary + Advance -->
        <div style="position: sticky; bottom: 0; z-index: 20; margin-top: 0.5rem; border-top: 1px solid var(--board-border); background: var(--background); backdrop-filter: blur(12px); padding: 1rem;">
          <!-- Summary counters -->
          <div style="display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-bottom: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.375rem;">
              <div style="width: 0.625rem; height: 0.625rem; border-radius: 50%; background: var(--color-present);"></div>
              <span class="font-chalk" style="font-size: 0.75rem; color: var(--muted-foreground);">
                P: <strong style="color: var(--foreground);">{{ presentCount }}</strong>
              </span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.375rem;">
              <div style="width: 0.625rem; height: 0.625rem; border-radius: 50%; background: var(--color-absent);"></div>
              <span class="font-chalk" style="font-size: 0.75rem; color: var(--muted-foreground);">
                F: <strong style="color: var(--foreground);">{{ absentCount }}</strong>
              </span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.375rem;">
              <div style="width: 0.625rem; height: 0.625rem; border-radius: 50%; background: var(--color-pending);"></div>
              <span class="font-chalk" style="font-size: 0.75rem; color: var(--muted-foreground);">
                Pendentes: <strong style="color: var(--foreground);">{{ pendingCount }}</strong>
              </span>
            </div>
          </div>

          <!-- Advance button -->
          <button
            class="btn-primary"
            [disabled]="!canAdvance"
            (click)="advance()"
          >
            AVANÇAR
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>

          @if (!canAdvance) {
            <p class="font-chalk" style="margin-top: 0.5rem; text-align: center; font-size: 0.75rem; color: var(--muted-foreground);">
              @if (!selectedDate) {
                Selecione a data da aula para continuar
              } @else {
                Marque a presença de todos os alunos ({{ pendingCount }} pendente{{ pendingCount !== 1 ? 's' : '' }})
              }
            </p>
          }
        </div>
      </div>
    </main>
  `,
  styles: [`
    .date-picker-container:focus-within { border-color: rgba(212,175,55,0.6); }
    input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.8); }
  `],
})
export class AttendanceComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private lessonService = inject(LessonService);

  @ViewChild('dateInput') dateInputRef!: ElementRef<HTMLInputElement>;

  turmaId = '';
  classInfo: ClassInfo | undefined;
  students: string[] = [];
  attendance: AttendanceMap = {};
  selectedDate = '';
  todayStr = new Date().toISOString().split('T')[0];

  // Saturday modal state
  showSaturdayModal = false;
  pendingDayName = '';
  pendingDate = '';

  get presentCount(): number {
    return Object.values(this.attendance).filter(v => v === true).length;
  }

  get absentCount(): number {
    return Object.values(this.attendance).filter(v => v === false).length;
  }

  get pendingCount(): number {
    return this.students.length - this.presentCount - this.absentCount;
  }

  get allMarked(): boolean {
    return Object.keys(this.attendance).length === this.students.length;
  }

  get canAdvance(): boolean {
    return !!this.selectedDate && this.allMarked;
  }

  focusDateInput(): void {
    this.dateInputRef?.nativeElement?.showPicker?.();
  }

  ngOnInit(): void {
    this.turmaId = this.route.snapshot.paramMap.get('turmaId') ?? '';
    this.classInfo = this.lessonService.getClassInfo(this.turmaId);
    this.students = this.lessonService.getStudents(this.turmaId);

    // Restore draft state from localStorage
    this.attendance = this.lessonService.getDraftAttendance(this.turmaId);
    this.selectedDate = this.lessonService.getDraftDate(this.turmaId) ?? '';
  }

  getAttendanceValue(student: string): boolean | null {
    return this.attendance[student] ?? null;
  }

  onAttendanceChange(student: string, present: boolean): void {
    this.attendance = { ...this.attendance, [student]: present };
    this.lessonService.setDraftAttendance(this.turmaId, this.attendance);
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (!value) return;

    const [y, m, d] = value.split('-');
    const date = new Date(+y, +m - 1, +d);
    const dayOfWeek = date.getDay(); // 0=Dom, 6=Sáb

    if (dayOfWeek !== 6) {
      this.pendingDate = value;
      this.pendingDayName = DAY_NAMES[dayOfWeek];
      this.showSaturdayModal = true;
    } else {
      this.applyDate(value);
    }
  }

  private applyDate(value: string): void {
    this.selectedDate = value;
    this.lessonService.setDraftDate(this.turmaId, value);
  }

  confirmDateModal(): void {
    this.applyDate(this.pendingDate);
    this.showSaturdayModal = false;
    this.pendingDate = '';
    this.pendingDayName = '';
  }

  cancelDateModal(): void {
    this.showSaturdayModal = false;
    this.pendingDate = '';
    this.pendingDayName = '';
    // Reset input value visually
    this.selectedDate = '';
  }

  advance(): void {
    if (!this.canAdvance) return;
    const presentStudents = Object.entries(this.attendance)
      .filter(([, v]) => v)
      .map(([name]) => name);
    this.router.navigate(['/lancar-aula', this.turmaId, 'dashboard'], {
      queryParams: {
        date: this.selectedDate,
        presentes: this.presentCount,
        total: this.students.length,
        aluno: presentStudents,
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/lancar-aula']);
  }
}