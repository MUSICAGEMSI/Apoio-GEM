// =============================================
// EngineCordas - SACRO / SUZUKI tabbed engine
// Angular 19 Standalone - single file
// =============================================

import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { AutocompleteInputComponent } from './autocomplete-input.component';
import { StatusSelectorComponent, StatusLevel } from './status-selector.component';
import { HistoryAccumulatorComponent, HistoryEntry } from './history-accumulator.component';

type Tab = 'sacro' | 'suzuki';

const SUZUKI_PIECES = [
  'Little Star', 'Se essa rua fosse minha', 'Allegro', 'Andantino',
  'Perpetual Motion', 'Allegretto', 'Long Long Ago', 'May Song',
  'Minuet 1', 'Minuet 2', 'Minuet 3', 'The Happy Farmer', 'Gavotte',
  'Musette', 'Hunters Chorus', 'Bourree', 'The Two Grenadiers',
  'Witches Dance', 'Gavotte from Mignon', 'Lully Gavotte',
  'Minuet in G', 'Humoresque', 'Concerto in A Minor',
];

const METHOD_SUGGESTIONS = Array.from({ length: 500 }, (_, i) => String(i + 1));

@Component({
  selector: 'app-engine-cordas',
  standalone: true,
  imports: [AutocompleteInputComponent, StatusSelectorComponent, HistoryAccumulatorComponent],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <!-- Tab buttons -->
      <div style="display: flex; gap: 0.5rem;">
        @for (t of tabs; track t.key) {
          <button
            type="button"
            (click)="tab.set(t.key)"
            [style.border-color]="tab() === t.key ? 'var(--primary)' : 'var(--board-border)'"
            [style.border-style]="tab() === t.key ? 'solid' : 'dashed'"
            [style.background]="tab() === t.key ? 'rgba(212,175,55,0.1)' : 'transparent'"
            [style.color]="tab() === t.key ? 'var(--primary)' : 'var(--muted-foreground)'"
            style="flex: 1; border-radius: 0.5rem; border-width: 2px; padding: 0.625rem 0.75rem; font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s;"
            class="font-chalk"
          >
            {{ t.label }}
          </button>
        }
      </div>

      <!-- SACRO tab -->
      @if (tab() === 'sacro') {
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label class="font-chalk" style="display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">
              Lição (Sacro)
            </label>
            @if (!sacroSelected()) {
              <app-autocomplete-input
                [suggestions]="methodSuggestions"
                placeholder="Digite o número da lição..."
                [blockedValues]="sacroBlocked()"
                duplicateMessage="Esta lição já foi adicionada."
                (confirmed)="sacroSelected.set($event)"
              />
            }
            @if (sacroSelected()) {
              <div style="display: flex; align-items: center; gap: 0.5rem; border-radius: 0.5rem; border: 1px solid rgba(212,175,55,0.4); background: rgba(212,175,55,0.05); padding: 0.5rem 0.75rem;">
                <span class="font-chalk" style="flex: 1; font-size: 0.875rem; font-weight: 700; color: var(--primary);">
                  Selecionado: Lição {{ sacroSelected() }}
                </span>
                <button type="button" (click)="sacroSelected.set(null)"
                  style="background: none; border: none; cursor: pointer; color: var(--primary); padding: 0; display: flex; align-items: center;" title="Cancelar seleção">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                </button>
              </div>
            }
          </div>

          @if (sacroSelected()) {
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <app-status-selector [value]="sacroStatus()" (statusChange)="sacroStatus.set($event)" />
              <div style="position: relative; overflow: hidden; border-radius: 0.5rem; border: 1px solid var(--board-border); background: var(--card);">
                <textarea
                  [value]="sacroObs()"
                  (input)="sacroObs.set(asInput($event).value)"
                  placeholder="Observação..."
                  rows="2"
                  class="font-chalk"
                  style="position: relative; z-index: 1; width: 100%; resize: none; background: transparent; padding: 0.5rem 0.75rem; font-size: 0.875rem; line-height: 1.75rem; color: var(--foreground); border: none; outline: none;"
                ></textarea>
              </div>
            </div>
          }

          <app-history-accumulator
            [entries]="[]"
            [addLabel]="'Adicionar Lição ' + (sacroSelected() || '...')"
            [addDisabled]="!canAddSacro()"
            (add)="addSacro()"
          />
        </div>
      }

      <!-- SUZUKI tab -->
      @if (tab() === 'suzuki') {
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label class="font-chalk" style="display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">
              Peça (Suzuki)
            </label>
            @if (!suzukiSelected()) {
              <app-autocomplete-input
                [suggestions]="suzukiPieces"
                placeholder="Digite o nome da peça..."
                [blockedValues]="suzukiBlocked()"
                duplicateMessage="Esta peça já foi adicionada."
                (confirmed)="suzukiSelected.set($event)"
              />
            }
            @if (suzukiSelected()) {
              <div style="display: flex; align-items: center; gap: 0.5rem; border-radius: 0.5rem; border: 1px solid rgba(212,175,55,0.4); background: rgba(212,175,55,0.05); padding: 0.5rem 0.75rem;">
                <span class="font-chalk" style="flex: 1; font-size: 0.875rem; font-weight: 700; color: var(--primary);">
                  Selecionado: {{ suzukiSelected() }}
                </span>
                <button type="button" (click)="suzukiSelected.set(null)"
                  style="background: none; border: none; cursor: pointer; color: var(--primary); padding: 0; display: flex; align-items: center;" title="Cancelar seleção">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                </button>
              </div>
            }
          </div>

          @if (suzukiSelected()) {
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <app-status-selector [value]="suzukiStatus()" (statusChange)="suzukiStatus.set($event)" />
              <div style="position: relative; overflow: hidden; border-radius: 0.5rem; border: 1px solid var(--board-border); background: var(--card);">
                <textarea
                  [value]="suzukiObs()"
                  (input)="suzukiObs.set(asInput($event).value)"
                  placeholder="Observação..."
                  rows="2"
                  class="font-chalk"
                  style="position: relative; z-index: 1; width: 100%; resize: none; background: transparent; padding: 0.5rem 0.75rem; font-size: 0.875rem; line-height: 1.75rem; color: var(--foreground); border: none; outline: none;"
                ></textarea>
              </div>
            </div>
          }

          <app-history-accumulator
            [entries]="[]"
            [addLabel]="'Adicionar ' + (suzukiSelected() || '...')"
            [addDisabled]="!canAddSuzuki()"
            (add)="addSuzuki()"
          />
        </div>
      }

      <!-- Save -->
      @if (entries().length > 0) {
        <div style="border-top: 1px solid var(--board-border); padding-top: 1rem; margin-top: 1rem;">
          <label class="font-chalk" style="display: block; margin-bottom: 0.75rem; font-size: 0.875rem; font-weight: 700; color: var(--foreground);">
            Registro do aluno na aula
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

      <button
        type="button"
        [disabled]="!canSave()"
        (click)="handleSave()"
        [style.border-color]="canSave() ? 'rgba(94,196,160,0.6)' : 'rgba(58,56,53,0.4)'"
        [style.color]="canSave() ? 'rgb(94,196,160)' : 'rgba(138,135,128,0.4)'"
        [style.cursor]="canSave() ? 'pointer' : 'not-allowed'"
        style="display: flex; width: 100%; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 0.75rem; border: 2px dashed; padding: 1rem 1.5rem; font-size: 1.25rem; font-weight: 700; transition: all 0.2s; background: transparent;"
        class="font-chalk"
      >
        SALVAR
      </button>
      @if (hasPending() && entries().length > 0) {
        <p class="font-chalk" style="text-align: center; font-size: 0.75rem; color: rgb(230,160,50);">
          Adicione ou remova a seleção pendente antes de salvar.
        </p>
      }
    </div>
  `,
})
export class EngineCordasComponent {
  @Input() initialEntries: HistoryEntry[] = [];
  @Output() save = new EventEmitter<HistoryEntry[]>();
  @Output() entriesChange = new EventEmitter<HistoryEntry[]>();

  tabs: { key: Tab; label: string }[] = [
    { key: 'sacro', label: 'SACRO' },
    { key: 'suzuki', label: 'SUZUKI' },
  ];
  methodSuggestions = METHOD_SUGGESTIONS;
  suzukiPieces = SUZUKI_PIECES;

  tab = signal<Tab>('sacro');
  entries = signal<HistoryEntry[]>([]);

  // Sacro state
  sacroSelected = signal<string | null>(null);
  sacroStatus = signal<StatusLevel | null>(null);
  sacroObs = signal('');

  // Suzuki state
  suzukiSelected = signal<string | null>(null);
  suzukiStatus = signal<StatusLevel | null>(null);
  suzukiObs = signal('');

  blockedSources = computed(() => this.entries().map(e => e.source));
  sacroBlocked = computed(() =>
    this.blockedSources().filter(s => s.startsWith('Sacro Licao ')).map(s => s.replace('Sacro Licao ', ''))
  );
  suzukiBlocked = computed(() =>
    this.blockedSources().filter(s => s.startsWith('Suzuki ')).map(s => s.replace('Suzuki ', ''))
  );

  canAddSacro = computed(() => this.sacroSelected() !== null && this.sacroStatus() !== null);
  canAddSuzuki = computed(() => this.suzukiSelected() !== null && this.suzukiStatus() !== null);
  hasPending = computed(() => this.sacroSelected() !== null || this.suzukiSelected() !== null);
  canSave = computed(() => this.entries().length > 0 && !this.hasPending());

  ngOnInit(): void {
    this.entries.set([...this.initialEntries]);
  }

  addSacro(): void {
    const sel = this.sacroSelected();
    const st = this.sacroStatus();
    if (!sel || !st) return;
    const source = `Sacro Licao ${sel}`;
    if (this.blockedSources().includes(source)) return;
    this.entries.update(prev => [...prev, { source, status: st, observation: this.sacroObs() || undefined }]);
    this.sacroSelected.set(null);
    this.sacroStatus.set(null);
    this.sacroObs.set('');
    this.entriesChange.emit(this.entries());
  }

  addSuzuki(): void {
    const sel = this.suzukiSelected();
    const st = this.suzukiStatus();
    if (!sel || !st) return;
    const source = `Suzuki ${sel}`;
    if (this.blockedSources().includes(source)) return;
    this.entries.update(prev => [...prev, { source, status: st, observation: this.suzukiObs() || undefined }]);
    this.suzukiSelected.set(null);
    this.suzukiStatus.set(null);
    this.suzukiObs.set('');
    this.entriesChange.emit(this.entries());
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