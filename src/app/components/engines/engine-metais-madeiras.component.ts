// =============================================
// EngineMetaisMadeiras - Almeida Dias / Rubank / Clark's
// Angular 19 Standalone - single file
// =============================================

import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { AutocompleteInputComponent } from './autocomplete-input.component';
import { StatusSelectorComponent, StatusLevel } from './status-selector.component';
import { HistoryAccumulatorComponent, HistoryEntry } from './history-accumulator.component';

type Tab = 'almeida-dias' | 'rubank' | 'clarks';

interface SubtopicDef { name: string; lessons: number; }
interface PhaseDef { label: string; subtopics: SubtopicDef[]; }
interface SimpleLessonDef { label: string; lessons: number; }

const AD_PHASES: PhaseDef[] = [
  { label: 'Fase 1', subtopics: [{ name: 'RITMO', lessons: 4 }, { name: 'ESCALAS', lessons: 4 }] },
  { label: 'Fase 2', subtopics: [{ name: 'RITMO', lessons: 5 }, { name: 'ESCALAS', lessons: 3 }, { name: 'PULSACAO', lessons: 3 }] },
  { label: 'Fase 3', subtopics: [{ name: 'RITMO', lessons: 2 }, { name: 'ESCALAS', lessons: 2 }, { name: 'PULSACAO', lessons: 2 }] },
];

const RB_LESSONS: PhaseDef[] = [
  { label: 'Lesson 1', subtopics: [{ name: 'RITMO', lessons: 3 }, { name: 'ESCALAS', lessons: 2 }] },
  { label: 'Lesson 1 - Supplementary', subtopics: [{ name: 'RITMO', lessons: 4 }, { name: 'ESCALAS', lessons: 3 }] },
  { label: 'Lesson 2', subtopics: [{ name: 'RITMO', lessons: 1 }, { name: 'ESCALAS', lessons: 2 }] },
];

const RB_MADEIRAS_LESSONS: SimpleLessonDef[] = [
  { label: 'Lesson 1', lessons: 5 },
  { label: 'Lesson 1 - Supplementary', lessons: 7 },
  { label: 'Lesson 2', lessons: 3 },
  { label: 'Lesson 3', lessons: 4 },
  { label: 'Lesson 4', lessons: 6 },
  { label: 'Lesson 5', lessons: 5 },
];

const CLARKS_SUGGESTIONS = Array.from({ length: 500 }, (_, i) => String(i + 1));

@Component({
  selector: 'app-engine-metais-madeiras',
  standalone: true,
  imports: [AutocompleteInputComponent, StatusSelectorComponent, HistoryAccumulatorComponent],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <!-- Tab buttons -->
      <div style="display: flex; gap: 0.5rem;">
        @for (t of availableTabs(); track t.key) {
          <button
            type="button"
            (click)="tab.set(t.key)"
            [style.border-color]="tab() === t.key ? 'var(--primary)' : 'var(--board-border)'"
            [style.border-style]="tab() === t.key ? 'solid' : 'dashed'"
            [style.background]="tab() === t.key ? 'rgba(212,175,55,0.1)' : 'transparent'"
            [style.color]="tab() === t.key ? 'var(--primary)' : 'var(--muted-foreground)'"
            style="flex: 1; border-radius: 0.5rem; border-width: 2px; padding: 0.625rem 0.5rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s;"
            class="font-chalk"
          >
            {{ t.label }}
          </button>
        }
      </div>

      <!-- ALMEIDA DIAS -->
      @if (tab() === 'almeida-dias') {
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <label class="font-chalk" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">
            Fase
          </label>
          <app-autocomplete-input
            [suggestions]="adPhaseSuggestions"
            placeholder="Selecione a fase..."
            [blockedValues]="[]"
            [value]="adPhase()"
            (confirmed)="adPhase.set($event)"
            (cleared)="adPhase.set(null)"
          />

          @if (adSelectedPhase(); as phase) {
            @for (st of phase.subtopics; track st.name) {
              @if (st.lessons > 0) {
                <div style="display: flex; flex-direction: column; gap: 0.75rem; border-radius: 0.75rem; border: 1px solid var(--board-border); background: var(--muted); padding: 0.75rem;">
                  <span class="font-chalk" style="font-size: 0.875rem; font-weight: 700; color: var(--foreground);">{{ st.name }}</span>
                  <!-- Lesson grid -->
                  <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    @for (n of range(st.lessons); track n) {
                      <button
                        type="button"
                        (click)="toggleSubtopicLesson(adPhase()!, st.name, n)"
                        [disabled]="isSubtopicLessonBlocked('Almeida Dias', adPhase()!, st.name, n)"
                        [style.border-color]="isSubtopicLessonSelected(adPhase()!, st.name, n) ? 'var(--primary)' : isSubtopicLessonBlocked('Almeida Dias', adPhase()!, st.name, n) ? 'rgba(58,56,53,0.3)' : 'var(--board-border)'"
                        [style.border-style]="isSubtopicLessonSelected(adPhase()!, st.name, n) ? 'solid' : 'dashed'"
                        [style.background]="isSubtopicLessonSelected(adPhase()!, st.name, n) ? 'rgba(212,175,55,0.1)' : 'transparent'"
                        [style.color]="isSubtopicLessonBlocked('Almeida Dias', adPhase()!, st.name, n) ? 'rgba(138,135,128,0.3)' : isSubtopicLessonSelected(adPhase()!, st.name, n) ? 'var(--primary)' : 'var(--foreground)'"
                        [style.text-decoration]="isSubtopicLessonBlocked('Almeida Dias', adPhase()!, st.name, n) ? 'line-through' : 'none'"
                        [style.cursor]="isSubtopicLessonBlocked('Almeida Dias', adPhase()!, st.name, n) ? 'not-allowed' : 'pointer'"
                        style="display: flex; width: 2.5rem; height: 2.5rem; align-items: center; justify-content: center; border-radius: 0.5rem; border-width: 2px; font-size: 0.875rem; font-weight: 700; transition: all 0.2s;"
                        class="font-chalk"
                      >
                        {{ n }}
                      </button>
                    }
                  </div>
                  <app-status-selector
                    [value]="getSubtopicStatus(adPhase()!, st.name)"
                    (statusChange)="setSubtopicStatus(adPhase()!, st.name, $event)"
                  />
                  <div style="position: relative; overflow: hidden; border-radius: 0.5rem; border: 1px solid var(--board-border); background: var(--card);">
                    <textarea
                      [value]="getSubtopicObs(adPhase()!, st.name)"
                      (input)="setSubtopicObs(adPhase()!, st.name, asInput($event).value)"
                      placeholder="Observação..."
                      rows="1"
                      class="font-chalk"
                      style="position: relative; z-index: 1; width: 100%; resize: none; background: transparent; padding: 0.375rem 0.75rem; font-size: 0.75rem; line-height: 1.75rem; color: var(--foreground); border: none; outline: none;"
                    ></textarea>
                  </div>
                  <button
                    type="button"
                    [disabled]="!canAddSubtopic('Almeida Dias', adPhase()!, st.name)"
                    (click)="addSubtopicEntry('Almeida Dias', adPhase()!, st)"
                    [style.border-color]="canAddSubtopic('Almeida Dias', adPhase()!, st.name) ? 'rgba(94,196,160,0.4)' : 'rgba(58,56,53,0.4)'"
                    [style.color]="canAddSubtopic('Almeida Dias', adPhase()!, st.name) ? 'rgb(94,196,160)' : 'rgba(138,135,128,0.4)'"
                    [style.cursor]="canAddSubtopic('Almeida Dias', adPhase()!, st.name) ? 'pointer' : 'not-allowed'"
                    style="display: flex; width: 100%; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 0.5rem; border: 2px dashed; padding: 0.5rem 0.75rem; font-size: 0.75rem; font-weight: 700; transition: all 0.2s; background: transparent;"
                    class="font-chalk"
                  >
                    + Adicionar {{ st.name }}
                  </button>
                </div>
              }
            }
          }
        </div>
      }

      <!-- RUBANK — SimpleLessonView for all turmas (Metais and Madeiras) -->
      @if (tab() === 'rubank') {
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <label class="font-chalk" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">Lesson</label>
          <app-autocomplete-input
            [suggestions]="rbSimpleSuggestionsForTurma()"
            placeholder="Selecione a lesson..."
            [blockedValues]="[]"
            [value]="rbSimplePhase()"
            (confirmed)="rbSimplePhase.set($event)"
            (cleared)="clearRbSimplePhase()"
          />
          @if (rbSimpleSelectedLessonForTurma(); as lesson) {
            <div style="display: flex; flex-direction: column; gap: 0.75rem; border-radius: 0.75rem; border: 1px solid var(--board-border); background: var(--muted); padding: 0.75rem;">
              <span class="font-chalk" style="font-size: 0.875rem; font-weight: 700; color: var(--foreground);">{{ lesson.label }}</span>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                @for (n of range(lesson.lessons); track n) {
                  <button
                    type="button"
                    (click)="toggleRbSimpleLesson(n)"
                    [disabled]="isRbSimpleLessonBlocked(n)"
                    [style.border-color]="rbSimpleLessons().has(n) ? 'var(--primary)' : 'var(--board-border)'"
                    [style.border-style]="rbSimpleLessons().has(n) ? 'solid' : 'dashed'"
                    [style.background]="rbSimpleLessons().has(n) ? 'rgba(212,175,55,0.1)' : 'transparent'"
                    [style.color]="isRbSimpleLessonBlocked(n) ? 'rgba(138,135,128,0.3)' : rbSimpleLessons().has(n) ? 'var(--primary)' : 'var(--foreground)'"
                    [style.cursor]="isRbSimpleLessonBlocked(n) ? 'not-allowed' : 'pointer'"
                    style="display: flex; width: 2.5rem; height: 2.5rem; align-items: center; justify-content: center; border-radius: 0.5rem; border-width: 2px; font-size: 0.875rem; font-weight: 700; transition: all 0.2s;"
                    class="font-chalk"
                  >{{ n }}</button>
                }
              </div>
              <app-status-selector [value]="rbSimpleStatus()" (statusChange)="rbSimpleStatus.set($event)" />
              <div style="position: relative; overflow: hidden; border-radius: 0.5rem; border: 1px solid var(--board-border); background: var(--card);">
                <textarea [value]="rbSimpleObs()" (input)="rbSimpleObs.set(asInput($event).value)" placeholder="Observação..." rows="1" class="font-chalk"
                  style="position: relative; z-index: 1; width: 100%; resize: none; background: transparent; padding: 0.375rem 0.75rem; font-size: 0.75rem; line-height: 1.75rem; color: var(--foreground); border: none; outline: none;"
                ></textarea>
              </div>
              <button type="button" [disabled]="!canAddRbSimple()" (click)="addRbSimple()"
                [style.border-color]="canAddRbSimple() ? 'rgba(94,196,160,0.4)' : 'rgba(58,56,53,0.4)'"
                [style.color]="canAddRbSimple() ? 'rgb(94,196,160)' : 'rgba(138,135,128,0.4)'"
                [style.cursor]="canAddRbSimple() ? 'pointer' : 'not-allowed'"
                style="display: flex; width: 100%; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 0.5rem; border: 2px dashed; padding: 0.5rem 0.75rem; font-size: 0.75rem; font-weight: 700; transition: all 0.2s; background: transparent;"
                class="font-chalk"
              >+ Adicionar Lições</button>
            </div>
          }
        </div>
      }

      <!-- CLARK'S -->
      @if (tab() === 'clarks') {
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <label class="font-chalk" style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">
            Lição (Clark's)
          </label>
          @if (!clarksSelected()) {
            <app-autocomplete-input
              [suggestions]="clarksSuggestions"
              placeholder="Digite o numero da licao..."
              [blockedValues]="clarksBlocked()"
              duplicateMessage="Esta lição já foi adicionada."
              (confirmed)="clarksSelected.set($event)"
            />
          }
          @if (clarksSelected()) {
            <div style="display: flex; align-items: center; gap: 0.5rem; border-radius: 0.5rem; border: 1px solid rgba(212,175,55,0.4); background: rgba(212,175,55,0.05); padding: 0.5rem 0.75rem;">
              <span class="font-chalk" style="flex: 1; font-size: 0.875rem; font-weight: 700; color: var(--primary);">
                Selecionado: Lição {{ clarksSelected() }}
              </span>
              <button type="button" (click)="clarksSelected.set(null)"
                style="background: none; border: none; cursor: pointer; color: var(--primary); padding: 0; display: flex; align-items: center;" title="Cancelar seleção">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
            <app-status-selector [value]="clarksStatus()" (statusChange)="clarksStatus.set($event)" />
            <div style="position: relative; overflow: hidden; border-radius: 0.5rem; border: 1px solid var(--board-border); background: var(--card);">
              <textarea [value]="clarksObs()" (input)="clarksObs.set(asInput($event).value)" placeholder="Observação..." rows="2" class="font-chalk"
                style="position: relative; z-index: 1; width: 100%; resize: none; background: transparent; padding: 0.5rem 0.75rem; font-size: 0.875rem; line-height: 1.75rem; color: var(--foreground); border: none; outline: none;"
              ></textarea>
            </div>
          }
          <app-history-accumulator
            [entries]="[]"
            [addLabel]="'Adicionar Lição ' + (clarksSelected() || '...')"
            [addDisabled]="!canAddClarks()"
            (add)="addClarks()"
          />
        </div>
      }

      <!-- Combined history -->
      @if (entries().length > 0) {
        <div style="border-top: 1px solid var(--board-border); padding-top: 1rem;">
          <label class="font-chalk" style="display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">
            Registros Acumulados
          </label>
          <app-history-accumulator
            [entries]="entries()"
            addLabel=""
            [addDisabled]="true"
            [canRemoveLast]="true"
            (removeLast)="handleRemoveLast()"
            (removeAt)="handleRemoveAt($event)"
          />
        </div>
      }

      <!-- Save -->
      <button type="button" [disabled]="entries().length === 0" (click)="handleSave()"
        [style.border-color]="entries().length > 0 ? 'rgba(94,196,160,0.6)' : 'rgba(58,56,53,0.4)'"
        [style.color]="entries().length > 0 ? 'rgb(94,196,160)' : 'rgba(138,135,128,0.4)'"
        [style.cursor]="entries().length > 0 ? 'pointer' : 'not-allowed'"
        style="display: flex; width: 100%; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 0.75rem; border: 2px dashed; padding: 1rem 1.5rem; font-size: 1.25rem; font-weight: 700; transition: all 0.2s; background: transparent;"
        class="font-chalk"
      >SALVAR</button>
    </div>
  `,
})
export class EngineMetaisMadeirasComponent {
  @Input() turmaId = '';
  @Input() initialEntries: HistoryEntry[] = [];
  @Output() save = new EventEmitter<HistoryEntry[]>();
  @Output() entriesChange = new EventEmitter<HistoryEntry[]>();

  get isMadeiras(): boolean { return this.turmaId === 'madeiras'; }
  get isMetais(): boolean { return this.turmaId.startsWith('metais'); }

  adPhaseSuggestions = AD_PHASES.map(p => p.label);
  rbLessonSuggestions = RB_LESSONS.map(p => p.label);
  rbMadeirasSuggestions = RB_MADEIRAS_LESSONS.map(l => l.label);
  clarksSuggestions = CLARKS_SUGGESTIONS;

  entries = signal<HistoryEntry[]>([]);
  tab = signal<Tab>('almeida-dias');

  // Almeida Dias
  adPhase = signal<string | null>(null);
  adSelectedPhase = computed(() => AD_PHASES.find(p => p.label === this.adPhase()) ?? null);

  // Rubank (phase-based for metais)
  rbPhase = signal<string | null>(null);
  rbSelectedPhase = computed(() => RB_LESSONS.find(p => p.label === this.rbPhase()) ?? null);

  // Rubank (simplified for madeiras)
  rbSimplePhase = signal<string | null>(null);
  rbSimpleSelectedLesson = computed(() => RB_MADEIRAS_LESSONS.find(l => l.label === this.rbSimplePhase()) ?? null);

  // Unified Rubank: combine Madeiras and Metais lesson lists for all turmas
  rbAllSimpleLessons: SimpleLessonDef[] = [
    ...RB_MADEIRAS_LESSONS,
    ...RB_LESSONS.map(p => ({ label: p.label, lessons: p.subtopics.reduce((s, st) => s + st.lessons, 0) })),
  ].filter((v, i, arr) => arr.findIndex(x => x.label === v.label) === i);

  rbSimpleSuggestionsForTurma = computed(() => RB_MADEIRAS_LESSONS.map(l => l.label));

  rbSimpleSelectedLessonForTurma = computed(() =>
    RB_MADEIRAS_LESSONS.find(l => l.label === this.rbSimplePhase()) ?? null
  );
  rbSimpleLessons = signal<Set<number>>(new Set());
  rbSimpleStatus = signal<StatusLevel | null>(null);
  rbSimpleObs = signal('');

  // Clark's
  clarksSelected = signal<string | null>(null);
  clarksStatus = signal<StatusLevel | null>(null);
  clarksObs = signal('');

  // Subtopic state: key = "phase-subtopic"
  subtopicLessons: Record<string, Set<number>> = {};
  subtopicStatuses: Record<string, StatusLevel | null> = {};
  subtopicObservations: Record<string, string> = {};

  existingSources = computed(() => this.entries().map(e => e.source));

  availableTabs = computed(() => {
    const tabs: { key: Tab; label: string }[] = [{ key: 'almeida-dias', label: 'Almeida Dias' }];
    if (this.isMadeiras) {
      tabs.push({ key: 'rubank', label: 'Rubank' });
    } else if (this.isMetais) {
      tabs.push({ key: 'rubank', label: 'Rubank' });
      tabs.push({ key: 'clarks', label: "Clark's" });
    } else {
      tabs.push({ key: 'rubank', label: 'Rubank' });
    }
    return tabs;
  });

  clarksBlocked = computed(() =>
    this.existingSources().filter(s => s.startsWith('Clarks Licao ')).map(s => s.replace('Clarks Licao ', ''))
  );
  canAddClarks = computed(() => this.clarksSelected() !== null && this.clarksStatus() !== null);

  ngOnInit(): void {
    this.entries.set([...this.initialEntries]);
  }

  range(n: number): number[] { return Array.from({ length: n }, (_, i) => i + 1); }

  // Subtopic helpers
  private stKey(phase: string, subtopic: string): string { return `${phase}-${subtopic}`; }

  getSubtopicLessons(phase: string, subtopic: string): Set<number> {
    return this.subtopicLessons[this.stKey(phase, subtopic)] ?? new Set();
  }
  getSubtopicStatus(phase: string, subtopic: string): StatusLevel | null {
    return this.subtopicStatuses[this.stKey(phase, subtopic)] ?? null;
  }
  getSubtopicObs(phase: string, subtopic: string): string {
    return this.subtopicObservations[this.stKey(phase, subtopic)] ?? '';
  }
  setSubtopicStatus(phase: string, subtopic: string, st: StatusLevel): void {
    this.subtopicStatuses[this.stKey(phase, subtopic)] = st;
  }
  setSubtopicObs(phase: string, subtopic: string, obs: string): void {
    this.subtopicObservations[this.stKey(phase, subtopic)] = obs;
  }

  isSubtopicLessonSelected(phase: string, subtopic: string, n: number): boolean {
    return this.getSubtopicLessons(phase, subtopic).has(n);
  }

  isSubtopicLessonBlocked(method: string, phase: string, subtopic: string, n: number): boolean {
    const prefix = `${method} ${phase} ${subtopic} `;
    for (const src of this.existingSources()) {
      if (src.startsWith(prefix)) {
        const matches = src.match(/L(\d+)/g);
        if (matches) {
          for (const m of matches) {
            if (parseInt(m.replace('L', ''), 10) === n) return true;
          }
        }
      }
    }
    return false;
  }

  toggleSubtopicLesson(phase: string, subtopic: string, n: number): void {
    const key = this.stKey(phase, subtopic);
    const current = this.subtopicLessons[key] ?? new Set();
    const next = new Set(current);
    if (next.has(n)) next.delete(n);
    else next.add(n);
    this.subtopicLessons[key] = next;
  }

  canAddSubtopic(method: string, phase: string, subtopic: string): boolean {
    return this.getSubtopicLessons(phase, subtopic).size > 0 && this.getSubtopicStatus(phase, subtopic) !== null;
  }

  addSubtopicEntry(method: string, phase: string, st: SubtopicDef): void {
    const lessons = this.getSubtopicLessons(phase, st.name);
    const status = this.getSubtopicStatus(phase, st.name);
    if (lessons.size === 0 || !status) return;
    const sorted = Array.from(lessons).sort((a, b) => a - b);
    const lessonsStr = sorted.map(n => `L${n}`).join(',');
    const source = `${method} ${phase} ${st.name} ${lessonsStr}`;
    const obs = this.getSubtopicObs(phase, st.name);
    this.entries.update(prev => [...prev, { source, status, observation: obs || undefined }]);
    const key = this.stKey(phase, st.name);
    this.subtopicLessons[key] = new Set();
    this.subtopicStatuses[key] = null;
    this.subtopicObservations[key] = '';
    this.entriesChange.emit(this.entries());
  }

  // Rubank simple (madeiras)
  toggleRbSimpleLesson(n: number): void {
    this.rbSimpleLessons.update(prev => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }

  isRbSimpleLessonBlocked(n: number): boolean {
    const phase = this.rbSimplePhase();
    if (!phase) return false;
    const prefix = `Rubank ${phase} `;
    for (const src of this.existingSources()) {
      if (src.startsWith(prefix)) {
        const matches = src.match(/L(\d+)/g);
        if (matches) {
          for (const m of matches) {
            if (parseInt(m.replace('L', ''), 10) === n) return true;
          }
        }
      }
    }
    return false;
  }

  canAddRbSimple(): boolean {
    return this.rbSimpleLessons().size > 0 && this.rbSimpleStatus() !== null;
  }

  addRbSimple(): void {
    const phase = this.rbSimplePhase();
    const st = this.rbSimpleStatus();
    if (!phase || !st || this.rbSimpleLessons().size === 0) return;
    const sorted = Array.from(this.rbSimpleLessons()).sort((a, b) => a - b);
    const source = `Rubank ${phase} ${sorted.map(n => `L${n}`).join(',')}`;
    this.entries.update(prev => [...prev, { source, status: st, observation: this.rbSimpleObs() || undefined }]);
    this.rbSimpleLessons.set(new Set());
    this.rbSimpleStatus.set(null);
    this.rbSimpleObs.set('');
    this.entriesChange.emit(this.entries());
  }

  // Clark's
  addClarks(): void {
    const sel = this.clarksSelected();
    const st = this.clarksStatus();
    if (!sel || !st) return;
    const source = `Clarks Licao ${sel}`;
    if (this.existingSources().includes(source)) return;
    this.entries.update(prev => [...prev, { source, status: st, observation: this.clarksObs() || undefined }]);
    this.clarksSelected.set(null);
    this.clarksStatus.set(null);
    this.clarksObs.set('');
    this.entriesChange.emit(this.entries());
  }

  // === TEMPLATE EVENT HANDLER (avoid multi-statement / new Set() in template) ===

  clearRbSimplePhase(): void {
    this.rbSimplePhase.set(null);
    this.rbSimpleLessons.set(new Set());
  }

  handleRemoveLast(): void {
    this.entries.update(prev => prev.slice(0, -1));
    this.entriesChange.emit(this.entries());
  }

  handleRemoveAt(idx: number): void {
    this.entries.update(prev => prev.filter((_, i) => i !== idx));
    this.entriesChange.emit(this.entries());
  }

  handleSave(): void {
    this.save.emit(this.entries());
  }

  asInput(e: Event): HTMLInputElement { return e.target as HTMLInputElement; }
}