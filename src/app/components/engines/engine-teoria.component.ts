// =============================================
// EngineTeoria - MSA Group/Individual modes
// Angular 19 Standalone - single file
// =============================================

import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { AutocompleteInputComponent } from './autocomplete-input.component';
import { StatusSelectorComponent, StatusLevel } from './status-selector.component';
import { HistoryAccumulatorComponent, HistoryEntry } from './history-accumulator.component';

const MSA_PHASES = ['Fase 1.1', 'Fase 1.2', 'Fase 2.1', 'Fase 2.2', 'Fase 2.3', 'Fase 3.1'];
const CLAVES = ['Sol', 'Do', 'Fa'];
const SOLFEJO_SUGGESTIONS = [
  'Solfejo e Leitura Rítmica', 'Solfejo Melódico', 'Leitura Rítmica',
  'Ditado Rítmico', 'Ditado Melódico', 'Percepção Musical',
];
const INDIVIDUAL_METHODS = ['MSA', 'Apostila Auxiliar de Solfejo'];
const EXERCISES_PER_PHASE: Record<string, number> = {
  'Fase 1.1': 4, 'Fase 1.2': 3, 'Fase 2.1': 5, 'Fase 2.2': 4, 'Fase 2.3': 3, 'Fase 3.1': 4,
};

function phaseRank(phase: string): number {
  return MSA_PHASES.indexOf(phase);
}

@Component({
  selector: 'app-engine-teoria',
  standalone: true,
  imports: [AutocompleteInputComponent, StatusSelectorComponent, HistoryAccumulatorComponent],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      @if (mode === 'group') {
        <!-- ===== GROUP MODE ===== -->

        <!-- MSA Header -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 0.75rem; border: 2px solid rgba(94,196,160,0.3); background: rgba(94,196,160,0.05); padding: 0.75rem 1rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(94,196,160)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          <span class="font-chalk" style="font-size: 0.875rem; font-weight: 700; letter-spacing: 0.05em; color: rgb(94,196,160);">
            MSA - Método Simplificado de Aprendizagem
          </span>
        </div>

        <!-- Section 1: Fase De/Ate -->
        <div style="display: flex; flex-direction: column; gap: 0.75rem; border-radius: 0.75rem; border: 1px solid var(--board-border); background: var(--muted); padding: 1rem;">
          <label class="font-chalk" style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">
            Intervalo de Fases
          </label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <span class="font-chalk" style="display: block; margin-bottom: 0.25rem; font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">De</span>
              <app-autocomplete-input [suggestions]="msaPhases" placeholder="Fase..." [blockedValues]="[]"
                [value]="gFaseDe()" (confirmed)="gFaseDe.set($event)" (cleared)="clearGFaseDe()" />
            </div>
            <div>
              <span class="font-chalk" style="display: block; margin-bottom: 0.25rem; font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">Ate</span>
              <app-autocomplete-input [suggestions]="gFaseAteSuggestions()" placeholder="Fase..." [blockedValues]="[]"
                [value]="gFaseAte()" (confirmed)="gFaseAte.set($event)" (cleared)="gFaseAte.set(null)" />
            </div>
          </div>
          @if (gRangeError()) {
            <p class="font-chalk" style="font-size: 0.75rem; color: rgb(220,70,70);">O campo "Até" deve ser uma fase igual ou superior à fase selecionada em "De" ({{ gFaseDe() }})</p>
          }
          @if (gRangeOverlap() && gRangeValid()) {
            <p class="font-chalk" style="font-size: 0.75rem; color: rgb(230,160,50);">
              Fases já registradas: {{ overlappingPhaseNames() }}. Este intervalo sobrepõe fases já adicionadas.
            </p>
          }
          @if (gRangeValid() && !gRangeIsDuplicate()) {
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="position: relative; overflow: hidden; border-radius: 0.5rem; border: 1px solid var(--board-border); background: var(--card);">
                <textarea [value]="gFaseObs()" (input)="gFaseObs.set(asInput($event).value)" placeholder="Observação..." rows="1" class="font-chalk"
                  style="position: relative; z-index: 1; width: 100%; resize: none; background: transparent; padding: 0.375rem 0.75rem; font-size: 0.75rem; line-height: 1.75rem; color: var(--foreground); border: none; outline: none;"
                ></textarea>
              </div>
              <button type="button" (click)="addFaseRange()"
                style="display: flex; width: 100%; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 0.5rem; border: 2px dashed rgba(94,196,160,0.4); padding: 0.5rem 0.75rem; font-size: 0.75rem; font-weight: 700; color: rgb(94,196,160); cursor: pointer; transition: all 0.2s; background: transparent;"
                class="font-chalk"
              >+ Adicionar Intervalo</button>
            </div>
          }
        </div>

        <!-- Section 2: Exercícios do MSA -->
        <div style="display: flex; flex-direction: column; gap: 0.75rem; border-radius: 0.75rem; border: 1px solid var(--board-border); background: var(--muted); padding: 1rem;">
          <label class="font-chalk" style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">
            Exercícios do MSA
          </label>
          <app-autocomplete-input [suggestions]="msaPhases" placeholder="Selecione a fase..." [blockedValues]="[]"
            [value]="gExPhase()" (confirmed)="onGExPhaseConfirmed($event)"
            (cleared)="onGExPhaseCleared()" />

          @if (gExPhase() && gExCount() > 0) {
            <span class="font-chalk" style="font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">
              {{ gExPhase() }} - Selecione os exercícios
            </span>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              @for (ex of range(gExCount()); track ex) {
                <button type="button" (click)="toggleGExercise(ex)"
                  [disabled]="isGExBlocked(ex)"
                  [style.border-color]="gExSelected().has(ex) ? 'var(--primary)' : isGExBlocked(ex) ? 'rgba(58,56,53,0.3)' : 'var(--board-border)'"
                  [style.border-style]="gExSelected().has(ex) ? 'solid' : 'dashed'"
                  [style.background]="gExSelected().has(ex) ? 'rgba(212,175,55,0.1)' : 'transparent'"
                  [style.color]="isGExBlocked(ex) ? 'rgba(138,135,128,0.3)' : gExSelected().has(ex) ? 'var(--primary)' : 'var(--foreground)'"
                  [style.cursor]="isGExBlocked(ex) ? 'not-allowed' : 'pointer'"
                  style="display: flex; width: 2.25rem; height: 2.25rem; align-items: center; justify-content: center; border-radius: 0.5rem; border-width: 2px; font-size: 0.875rem; font-weight: 700; transition: all 0.2s;"
                  class="font-chalk"
                >{{ ex }}</button>
              }
            </div>
            @if (gExSelected().size > 0) {
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <div style="position: relative; overflow: hidden; border-radius: 0.5rem; border: 1px solid var(--board-border); background: var(--card);">
                  <textarea [value]="gExObs()" (input)="gExObs.set(asInput($event).value)" placeholder="Observação sobre exercícios..." rows="1" class="font-chalk"
                    style="position: relative; z-index: 1; width: 100%; resize: none; background: transparent; padding: 0.375rem 0.75rem; font-size: 0.75rem; line-height: 1.75rem; color: var(--foreground); border: none; outline: none;"
                  ></textarea>
                </div>
                <button type="button" (click)="addGExercises()"
                  style="display: flex; width: 100%; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 0.5rem; border: 2px dashed rgba(94,196,160,0.4); padding: 0.5rem 0.75rem; font-size: 0.75rem; font-weight: 700; color: rgb(94,196,160); cursor: pointer; transition: all 0.2s; background: transparent;"
                  class="font-chalk"
                >+ Adicionar Exercícios</button>
              </div>
            }
          }
        </div>

        <!-- Section 3: Solfejo e Leitura Rítmica -->
        <div style="display: flex; flex-direction: column; gap: 0.75rem; border-radius: 0.75rem; border: 1px solid var(--board-border); background: var(--muted); padding: 1rem;">
          <label class="font-chalk" style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">
            Solfejo e Leitura Rítmica
          </label>
          <app-autocomplete-input [suggestions]="solfejoSuggestions" placeholder="Digite ou selecione..." [blockedValues]="gSolfejoBlockedItems()"
            duplicateMessage="Já adicionado."
            [value]="gSolfejoItem()" (confirmed)="gSolfejoItem.set($event)" (cleared)="clearGSolfejo()" />

          @if (gSolfejoItem()) {
            <label class="font-chalk" style="font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">
              Claves (seleção múltipla)
            </label>
            <div style="display: flex; gap: 0.5rem;">
              @for (c of claves; track c) {
                <button type="button" (click)="toggleGClave(c)"
                  [style.border-color]="gSolfejoClaves().has(c) ? 'var(--primary)' : 'var(--board-border)'"
                  [style.border-style]="gSolfejoClaves().has(c) ? 'solid' : 'dashed'"
                  [style.background]="gSolfejoClaves().has(c) ? 'rgba(212,175,55,0.1)' : 'transparent'"
                  [style.color]="gSolfejoClaves().has(c) ? 'var(--primary)' : 'var(--foreground)'"
                  style="flex: 1; border-radius: 0.5rem; border-width: 2px; padding: 0.625rem 0.75rem; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.2s;"
                  class="font-chalk"
                >Clave de {{ c }}</button>
              }
            </div>
            @if (gSolfejoClaves().size > 0) {
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <div style="position: relative; overflow: hidden; border-radius: 0.5rem; border: 1px solid var(--board-border); background: var(--card);">
                  <textarea [value]="gSolfejoObs()" (input)="gSolfejoObs.set(asInput($event).value)" placeholder="Observação sobre solfejo..." rows="1" class="font-chalk"
                    style="position: relative; z-index: 1; width: 100%; resize: none; background: transparent; padding: 0.375rem 0.75rem; font-size: 0.75rem; line-height: 1.75rem; color: var(--foreground); border: none; outline: none;"
                  ></textarea>
                </div>
                <button type="button" (click)="addGSolfejo()"
                  [disabled]="!gCanAddSolfejo()"
                  [style.border-color]="gCanAddSolfejo() ? 'rgba(94,196,160,0.4)' : 'rgba(58,56,53,0.4)'"
                  [style.color]="gCanAddSolfejo() ? 'rgb(94,196,160)' : 'rgba(138,135,128,0.4)'"
                  style="display: flex; width: 100%; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 0.5rem; border: 2px dashed; padding: 0.5rem 0.75rem; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s; background: transparent;"
                  class="font-chalk"
                >+ Adicionar Solfejo</button>
              </div>
            }
          }
        </div>

        <!-- Accumulated entries -->
        <app-history-accumulator
          [entries]="entries()"
          addLabel=""
          [addDisabled]="true"
          [canRemoveLast]="entries().length > 0"
          (removeLast)="handleRemoveLast()"
            (removeAt)="handleRemoveAt($event)"
        />

        <!-- Save (group) -->
        <button type="button" [disabled]="entries().length === 0" (click)="handleSave()"
          [style.border-color]="entries().length > 0 ? 'rgba(94,196,160,0.6)' : 'rgba(58,56,53,0.4)'"
          [style.color]="entries().length > 0 ? 'rgb(94,196,160)' : 'rgba(138,135,128,0.4)'"
          [style.cursor]="entries().length > 0 ? 'pointer' : 'not-allowed'"
          style="display: flex; width: 100%; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 0.75rem; border: 2px dashed; padding: 1rem 1.5rem; font-size: 1.25rem; font-weight: 700; transition: all 0.2s; background: transparent;"
          class="font-chalk"
        >SALVAR</button>

      } @else {
        <!-- ===== INDIVIDUAL MODE ===== -->

        <!-- Method selector -->
        <div>
          <label class="font-chalk" style="display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">Método</label>
          <div style="display: flex; gap: 0.5rem;">
            @for (m of individualMethods; track m) {
              <button type="button" (click)="iSelectedMethod.set(iSelectedMethod() === m ? null : m)"
                [style.border-color]="iSelectedMethod() === m ? 'var(--primary)' : 'var(--board-border)'"
                [style.border-style]="iSelectedMethod() === m ? 'solid' : 'dashed'"
                [style.background]="iSelectedMethod() === m ? 'rgba(212,175,55,0.1)' : 'transparent'"
                [style.color]="iSelectedMethod() === m ? 'var(--primary)' : 'var(--foreground)'"
                style="flex: 1; border-radius: 0.5rem; border-width: 2px; padding: 0.625rem 0.75rem; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s;"
                class="font-chalk"
              >{{ m }}</button>
            }
          </div>
        </div>

        <!-- MSA Individual -->
        @if (iSelectedMethod() === 'MSA') {
          <!-- Solfejo -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem; border-radius: 0.75rem; border: 1px solid var(--board-border); background: var(--muted); padding: 1rem;">
            <label class="font-chalk" style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">Solfejo</label>
            <app-autocomplete-input [suggestions]="solfejoSuggestions" placeholder="Digite ou selecione..."
              [blockedValues]="iMsaSolfejoBlockedItems()" duplicateMessage="Já adicionado."
              [value]="iMsaSolfejoItem()" (confirmed)="iMsaSolfejoItem.set($event)" (cleared)="clearIMsaSolfejo()" />

            @if (iMsaSolfejoItem()) {
              <label class="font-chalk" style="font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">Claves (seleção múltipla)</label>
              <div style="display: flex; gap: 0.5rem;">
                @for (c of claves; track c) {
                  <button type="button" (click)="toggleIMsaClave(c)"
                    [style.border-color]="iMsaSolfejoClaves().has(c) ? 'var(--primary)' : 'var(--board-border)'"
                    [style.border-style]="iMsaSolfejoClaves().has(c) ? 'solid' : 'dashed'"
                    [style.background]="iMsaSolfejoClaves().has(c) ? 'rgba(212,175,55,0.1)' : 'transparent'"
                    [style.color]="iMsaSolfejoClaves().has(c) ? 'var(--primary)' : 'var(--foreground)'"
                    style="flex: 1; border-radius: 0.5rem; border-width: 2px; padding: 0.625rem 0.75rem; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: all 0.2s;"
                    class="font-chalk"
                  >Clave de {{ c }}</button>
                }
              </div>
              @if (iMsaSolfejoClaves().size > 0) {
                <app-status-selector [value]="iMsaSolfejoStatus()" (statusChange)="iMsaSolfejoStatus.set($event)" />
                <div style="position: relative; overflow: hidden; border-radius: 0.5rem; border: 1px solid var(--board-border); background: var(--card);">
                  <textarea [value]="iMsaSolfejoObs()" (input)="iMsaSolfejoObs.set(asInput($event).value)" placeholder="Observação..." rows="2" class="font-chalk"
                    style="position: relative; z-index: 1; width: 100%; resize: none; background: transparent; padding: 0.375rem 0.75rem; font-size: 0.75rem; line-height: 1.75rem; color: var(--foreground); border: none; outline: none;"
                  ></textarea>
                </div>
              }
            }
            <app-history-accumulator [entries]="[]" addLabel="Adicionar Solfejo" [addDisabled]="!iMsaSolfejoCanAdd()" (add)="addIMsaSolfejo()" />
          </div>

          <!-- Exercicios -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem; border-radius: 0.75rem; border: 1px solid var(--board-border); background: var(--muted); padding: 1rem;">
            <label class="font-chalk" style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">Exercícios</label>
            <app-autocomplete-input [suggestions]="msaPhases" placeholder="Selecione a fase..." [blockedValues]="[]"
              [value]="iMsaExPhase()" (confirmed)="onIMsaExPhaseConfirmed($event)"
              (cleared)="onIMsaExPhaseCleared()" />

            @if (iMsaExPhase() && iMsaExCount() > 0) {
              <span class="font-chalk" style="font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">
                {{ iMsaExPhase() }} - Selecione os exercícios
              </span>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                @for (ex of range(iMsaExCount()); track ex) {
                  <button type="button" (click)="toggleIMsaEx(ex)"
                    [disabled]="isIMsaExBlocked(ex)"
                    [style.border-color]="iMsaExSelected().has(ex) ? 'var(--primary)' : isIMsaExBlocked(ex) ? 'rgba(58,56,53,0.3)' : 'var(--board-border)'"
                    [style.border-style]="iMsaExSelected().has(ex) ? 'solid' : 'dashed'"
                    [style.background]="iMsaExSelected().has(ex) ? 'rgba(212,175,55,0.1)' : 'transparent'"
                    [style.color]="isIMsaExBlocked(ex) ? 'rgba(138,135,128,0.3)' : iMsaExSelected().has(ex) ? 'var(--primary)' : 'var(--foreground)'"
                    [style.cursor]="isIMsaExBlocked(ex) ? 'not-allowed' : 'pointer'"
                    style="display: flex; width: 2.25rem; height: 2.25rem; align-items: center; justify-content: center; border-radius: 0.5rem; border-width: 2px; font-size: 0.875rem; font-weight: 700; transition: all 0.2s;"
                    class="font-chalk"
                  >{{ ex }}</button>
                }
              </div>
              @if (iMsaExSelected().size > 0) {
                <app-status-selector [value]="iMsaExStatus()" (statusChange)="iMsaExStatus.set($event)" />
                <div style="position: relative; overflow: hidden; border-radius: 0.5rem; border: 1px solid var(--board-border); background: var(--card);">
                  <textarea [value]="iMsaExObs()" (input)="iMsaExObs.set(asInput($event).value)" placeholder="Observação sobre exercícios..." rows="2" class="font-chalk"
                    style="position: relative; z-index: 1; width: 100%; resize: none; background: transparent; padding: 0.375rem 0.75rem; font-size: 0.75rem; line-height: 1.75rem; color: var(--foreground); border: none; outline: none;"
                  ></textarea>
                </div>
              }
            }
            <app-history-accumulator [entries]="[]" addLabel="Adicionar Exercícios" [addDisabled]="!iMsaExCanAdd()" (add)="addIMsaExercises()" />
          </div>

          @if (entries().length > 0) {
            <div style="border-top: 1px solid var(--board-border); padding-top: 1rem;">
              <label class="font-chalk" style="display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">Registros Acumulados</label>
              <app-history-accumulator [entries]="entries()" addLabel="" [addDisabled]="true" [canRemoveLast]="true" (removeLast)="handleRemoveLast()"
            (removeAt)="handleRemoveAt($event)" />
            </div>
          }
        }

        <!-- Apostila Auxiliar de Solfejo -->
        @if (iSelectedMethod() === 'Apostila Auxiliar de Solfejo') {
          <div>
            <label class="font-chalk" style="display: block; margin-bottom: 0.5rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-foreground);">Lição</label>
            <app-autocomplete-input [suggestions]="apostilaSuggestions" placeholder="Digite a licao..."
              [blockedValues]="apostilaBlockedValues()"
              [value]="iApostilaLesson()" (confirmed)="iApostilaLesson.set($event)" (cleared)="iApostilaLesson.set(null)" />
          </div>
          @if (iApostilaLesson()) {
            <app-status-selector [value]="iApostilaStatus()" (statusChange)="iApostilaStatus.set($event)" />
            <div style="position: relative; overflow: hidden; border-radius: 0.5rem; border: 1px solid var(--board-border); background: var(--card);">
              <textarea [value]="iApostilaObs()" (input)="iApostilaObs.set(asInput($event).value)" placeholder="Observação..." rows="2" class="font-chalk"
                style="position: relative; z-index: 1; width: 100%; resize: none; background: transparent; padding: 0.375rem 0.75rem; font-size: 0.75rem; line-height: 1.75rem; color: var(--foreground); border: none; outline: none;"
              ></textarea>
            </div>
          }
          <app-history-accumulator [entries]="entries()" addLabel="Adicionar Lição" [addDisabled]="!iApostilaCanAdd()"
            [canRemoveLast]="entries().length > 0" (add)="addIApostila()" (removeLast)="handleRemoveLast()"
            (removeAt)="handleRemoveAt($event)" />
        }

        <!-- Save (individual) -->
        <button type="button" [disabled]="entries().length === 0" (click)="handleSave()"
          [style.border-color]="entries().length > 0 ? 'rgba(94,196,160,0.6)' : 'rgba(58,56,53,0.4)'"
          [style.color]="entries().length > 0 ? 'rgb(94,196,160)' : 'rgba(138,135,128,0.4)'"
          [style.cursor]="entries().length > 0 ? 'pointer' : 'not-allowed'"
          style="display: flex; width: 100%; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 0.75rem; border: 2px dashed; padding: 1rem 1.5rem; font-size: 1.25rem; font-weight: 700; transition: all 0.2s; background: transparent;"
          class="font-chalk"
        >SALVAR</button>
      }
    </div>
  `,
})
export class EngineTeoriaComponent {
  @Input() mode: 'group' | 'individual' = 'group';
  @Input() initialEntries: HistoryEntry[] = [];
  @Output() save = new EventEmitter<HistoryEntry[]>();
  @Output() entriesChange = new EventEmitter<HistoryEntry[]>();

  msaPhases = MSA_PHASES;
  claves = CLAVES;
  solfejoSuggestions = SOLFEJO_SUGGESTIONS;
  individualMethods = INDIVIDUAL_METHODS;
  apostilaSuggestions = Array.from({ length: 500 }, (_, i) => `Lição ${i + 1}`);

  entries = signal<HistoryEntry[]>([]);
  existingSources = computed(() => this.entries().map(e => e.source));

  // === GROUP STATE ===
  gFaseDe = signal<string | null>(null);
  gFaseAte = signal<string | null>(null);
  gFaseObs = signal('');
  gExPhase = signal<string | null>(null);
  gExSelected = signal<Set<number>>(new Set());
  gExObs = signal('');
  gSolfejoItem = signal<string | null>(null);
  gSolfejoClaves = signal<Set<string>>(new Set());
  gSolfejoObs = signal('');

  gFaseAteSuggestions = computed(() => {
    const de = this.gFaseDe();
    if (!de) return MSA_PHASES;
    const deRank = phaseRank(de);
    return MSA_PHASES.filter((_, i) => i >= deRank);
  });

  gRangeValid = computed(() => {
    const de = this.gFaseDe();
    const ate = this.gFaseAte();
    return de !== null && ate !== null && phaseRank(ate) >= phaseRank(de);
  });

  gRangeError = computed(() => {
    const de = this.gFaseDe();
    const ate = this.gFaseAte();
    return de !== null && ate !== null && phaseRank(ate) < phaseRank(de);
  });

  gRangeLabel = computed(() => {
    if (!this.gRangeValid()) return '';
    return `MSA Teoria ${this.gFaseDe()} a ${this.gFaseAte()}`;
  });

  gCoveredPhases = computed(() => {
    const covered = new Set<number>();
    for (const src of this.existingSources()) {
      const match = src.match(/^MSA Teoria (Fase \d+\.\d+) a (Fase \d+\.\d+)$/);
      if (match) {
        const deIdx = phaseRank(match[1]);
        const ateIdx = phaseRank(match[2]);
        if (deIdx >= 0 && ateIdx >= 0) {
          for (let i = deIdx; i <= ateIdx; i++) covered.add(i);
        }
      }
    }
    return covered;
  });

  gRangeOverlap = computed(() => {
    if (!this.gRangeValid()) return false;
    const deIdx = phaseRank(this.gFaseDe()!);
    const ateIdx = phaseRank(this.gFaseAte()!);
    for (let i = deIdx; i <= ateIdx; i++) {
      if (this.gCoveredPhases().has(i)) return true;
    }
    return false;
  });

  gRangeIsDuplicate = computed(() => {
    const label = this.gRangeLabel();
    return (label !== '' && this.existingSources().includes(label)) || this.gRangeOverlap();
  });

  overlappingPhaseNames = computed(() => {
    if (!this.gRangeValid()) return '';
    const deIdx = phaseRank(this.gFaseDe()!);
    const ateIdx = phaseRank(this.gFaseAte()!);
    const names: string[] = [];
    for (let i = deIdx; i <= ateIdx; i++) {
      if (this.gCoveredPhases().has(i)) names.push(MSA_PHASES[i]);
    }
    return names.join(', ');
  });

  gExCount = computed(() => {
    const phase = this.gExPhase();
    return phase ? (EXERCISES_PER_PHASE[phase] ?? 0) : 0;
  });

  gSolfejoBlockedItems = computed(() => {
    const items: string[] = [];
    for (const src of this.existingSources()) {
      for (const suggestion of SOLFEJO_SUGGESTIONS) {
        if (src.startsWith(suggestion)) items.push(suggestion);
      }
    }
    return items;
  });

  gCanAddSolfejo = computed(() =>
    this.gSolfejoItem() !== null && this.gSolfejoClaves().size > 0
  );

  // === INDIVIDUAL STATE ===
  iSelectedMethod = signal<string | null>(null);
  iMsaSolfejoItem = signal<string | null>(null);
  iMsaSolfejoClaves = signal<Set<string>>(new Set());
  iMsaSolfejoStatus = signal<StatusLevel | null>(null);
  iMsaSolfejoObs = signal('');
  iMsaExPhase = signal<string | null>(null);
  iMsaExSelected = signal<Set<number>>(new Set());
  iMsaExStatus = signal<StatusLevel | null>(null);
  iMsaExObs = signal('');
  iApostilaLesson = signal<string | null>(null);
  iApostilaStatus = signal<StatusLevel | null>(null);
  iApostilaObs = signal('');

  iMsaSolfejoBlockedItems = computed(() => {
    const items: string[] = [];
    for (const src of this.existingSources()) {
      if (src.startsWith('MSA ')) {
        for (const suggestion of SOLFEJO_SUGGESTIONS) {
          if (src.startsWith(`MSA ${suggestion}`)) items.push(suggestion);
        }
      }
    }
    return items;
  });

  iMsaSolfejoSource = computed(() => {
    const item = this.iMsaSolfejoItem();
    const claves = this.iMsaSolfejoClaves();
    return item && claves.size > 0
      ? `MSA ${item} - Clave ${Array.from(claves).join('/')}`
      : '';
  });

  iMsaSolfejoCanAdd = computed(() =>
    this.iMsaSolfejoItem() !== null && this.iMsaSolfejoClaves().size > 0 && this.iMsaSolfejoStatus() !== null
  );

  iMsaExCount = computed(() => {
    const phase = this.iMsaExPhase();
    return phase ? (EXERCISES_PER_PHASE[phase] ?? 0) : 0;
  });

  iMsaExCanAdd = computed(() =>
    this.iMsaExSelected().size > 0 && this.iMsaExPhase() !== null && this.iMsaExStatus() !== null
  );

  iApostilaCanAdd = computed(() =>
    this.iApostilaLesson() !== null && this.iApostilaStatus() !== null
  );

  apostilaBlockedValues = computed(() =>
    this.existingSources().map(s => s.replace('Apostila Solfejo - ', ''))
  );

  ngOnInit(): void {
    this.entries.set([...this.initialEntries]);
  }

  range(n: number): number[] { return Array.from({ length: n }, (_, i) => i + 1); }

  // GROUP METHODS
  addFaseRange(): void {
    if (!this.gRangeValid() || this.gRangeIsDuplicate()) return;
    this.entries.update(prev => [...prev, { source: this.gRangeLabel(), observation: this.gFaseObs() || undefined }]);
    this.gFaseDe.set(null); this.gFaseAte.set(null); this.gFaseObs.set('');
    this.entriesChange.emit(this.entries());
  }

  isGExBlocked(ex: number): boolean {
    const prefix = `MSA Exercicios ${this.gExPhase()} - (`;
    for (const src of this.existingSources()) {
      if (src.startsWith(prefix)) {
        const lessonPart = src.slice(prefix.length, -1);
        for (const n of lessonPart.split(',')) {
          if (parseInt(n.trim(), 10) === ex) return true;
        }
      }
    }
    return false;
  }

  toggleGExercise(ex: number): void {
    if (this.isGExBlocked(ex)) return;
    this.gExSelected.update(prev => {
      const next = new Set(prev);
      if (next.has(ex)) next.delete(ex);
      else next.add(ex);
      return next;
    });
  }

  addGExercises(): void {
    const phase = this.gExPhase();
    const sorted = Array.from(this.gExSelected()).sort((a, b) => a - b);
    if (!phase || sorted.length === 0) return;
    const formatted = sorted.map(n => String(n).padStart(2, '0'));
    const exLabel = formatted.length === 1
      ? formatted[0]
      : formatted.slice(0, -1).join(', ') + ' e ' + formatted[formatted.length - 1];
    const source = `MSA Exercicios ${phase} - (${exLabel})`;
    this.entries.update(prev => [...prev, { source, observation: this.gExObs() || undefined }]);
    this.gExSelected.set(new Set()); this.gExObs.set('');
    this.entriesChange.emit(this.entries());
  }

  toggleGClave(c: string): void {
    this.gSolfejoClaves.update(prev => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  addGSolfejo(): void {
    const item = this.gSolfejoItem();
    if (!item || this.gSolfejoClaves().size === 0) return;
    const source = `${item} - Clave ${Array.from(this.gSolfejoClaves()).join('/')}`;
    if (this.existingSources().includes(source)) return;
    this.entries.update(prev => [...prev, { source, observation: this.gSolfejoObs() || undefined }]);
    this.gSolfejoItem.set(null); this.gSolfejoClaves.set(new Set()); this.gSolfejoObs.set('');
    this.entriesChange.emit(this.entries());
  }

  // INDIVIDUAL METHODS
  toggleIMsaClave(c: string): void {
    this.iMsaSolfejoClaves.update(prev => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  addIMsaSolfejo(): void {
    const src = this.iMsaSolfejoSource();
    const st = this.iMsaSolfejoStatus();
    if (!src || !st) return;
    this.entries.update(prev => [...prev, { source: src, status: st, observation: this.iMsaSolfejoObs() || undefined }]);
    this.iMsaSolfejoItem.set(null); this.iMsaSolfejoClaves.set(new Set()); this.iMsaSolfejoStatus.set(null); this.iMsaSolfejoObs.set('');
    this.entriesChange.emit(this.entries());
  }

  isIMsaExBlocked(ex: number): boolean {
    const prefix = `MSA Exercicios ${this.iMsaExPhase()} - (`;
    for (const src of this.existingSources()) {
      if (src.startsWith(prefix)) {
        const lessonPart = src.slice(prefix.length, -1);
        for (const n of lessonPart.split(',')) {
          if (parseInt(n.trim(), 10) === ex) return true;
        }
      }
    }
    return false;
  }

  toggleIMsaEx(ex: number): void {
    if (this.isIMsaExBlocked(ex)) return;
    this.iMsaExSelected.update(prev => {
      const next = new Set(prev);
      if (next.has(ex)) next.delete(ex);
      else next.add(ex);
      return next;
    });
  }

  addIMsaExercises(): void {
    const phase = this.iMsaExPhase();
    const st = this.iMsaExStatus();
    const sorted = Array.from(this.iMsaExSelected()).sort((a, b) => a - b);
    if (!phase || !st || sorted.length === 0) return;
    const formatted = sorted.map(n => String(n).padStart(2, '0'));
    const exLabel = formatted.length === 1
      ? formatted[0]
      : formatted.slice(0, -1).join(', ') + ' e ' + formatted[formatted.length - 1];
    const source = `MSA Exercicios ${phase} - (${exLabel})`;
    this.entries.update(prev => [...prev, { source, status: st, observation: this.iMsaExObs() || undefined }]);
    this.iMsaExSelected.set(new Set()); this.iMsaExStatus.set(null); this.iMsaExObs.set('');
    this.entriesChange.emit(this.entries());
  }

  addIApostila(): void {
    const lesson = this.iApostilaLesson();
    const st = this.iApostilaStatus();
    if (!lesson || !st) return;
    const source = `Apostila Solfejo - ${lesson.trim()}`;
    this.entries.update(prev => [...prev, { source, status: st, observation: this.iApostilaObs() || undefined }]);
    this.iApostilaLesson.set(null); this.iApostilaStatus.set(null); this.iApostilaObs.set('');
    this.entriesChange.emit(this.entries());
  }

  // === TEMPLATE EVENT HANDLERS (avoid multi-statement / new Set() in templates) ===

  clearGFaseDe(): void {
    this.gFaseDe.set(null);
    this.gFaseAte.set(null);
  }

  onGExPhaseConfirmed(value: string): void {
    this.gExPhase.set(value);
    this.gExSelected.set(new Set());
  }

  onGExPhaseCleared(): void {
    this.gExPhase.set(null);
    this.gExSelected.set(new Set());
  }

  clearGSolfejo(): void {
    this.gSolfejoItem.set(null);
    this.gSolfejoClaves.set(new Set());
  }

  clearIMsaSolfejo(): void {
    this.iMsaSolfejoItem.set(null);
    this.iMsaSolfejoClaves.set(new Set());
    this.iMsaSolfejoStatus.set(null);
  }

  onIMsaExPhaseConfirmed(value: string): void {
    this.iMsaExPhase.set(value);
    this.iMsaExSelected.set(new Set());
    this.iMsaExStatus.set(null);
  }

  onIMsaExPhaseCleared(): void {
    this.iMsaExPhase.set(null);
    this.iMsaExSelected.set(new Set());
    this.iMsaExStatus.set(null);
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