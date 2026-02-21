import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface HistoryEntry {
  source: string;
  status?: 'estudar' | 'regular' | 'bom';
  observation?: string;
  method?: string; // prefixo do método (ex: 'Sacro', 'Suzuki') para ordenação
}

const STATUS_LABELS: Record<string, string> = {
  estudar: 'Estudar',
  regular: 'Regular',
  bom: 'Bom',
};

// Ordem canônica dos métodos por engine
const METHOD_ORDER = ['Sacro', 'Suzuki', 'Almeida Dias', 'Rubank', "Clark's", 'Clarks', 'MSA', 'Apostila'];

function getMethodPrefix(source: string): string {
  for (const m of METHOD_ORDER) {
    if (source.startsWith(m)) return m;
  }
  return source.split(' ')[0] ?? source;
}

function sortEntries(entries: HistoryEntry[]): HistoryEntry[] {
  const methodOrder: string[] = [];
  for (const e of entries) {
    const m = getMethodPrefix(e.source);
    if (!methodOrder.includes(m)) methodOrder.push(m);
  }
  return [...entries].sort((a, b) => {
    const ma = getMethodPrefix(a.source);
    const mb = getMethodPrefix(b.source);
    const ia = methodOrder.indexOf(ma);
    const ib = methodOrder.indexOf(mb);
    if (ia !== ib) return ia - ib;
    return entries.indexOf(a) - entries.indexOf(b);
  });
}

/** Check if two entries are identical (same source, status, observation) */
export function isEntryDuplicate(a: HistoryEntry, b: HistoryEntry): boolean {
  return a.source === b.source && a.status === b.status && (a.observation ?? '') === (b.observation ?? '');
}

/** Add entry only if the last entry is not identical */
export function addEntryNoDuplicate(entries: HistoryEntry[], newEntry: HistoryEntry): HistoryEntry[] {
  if (entries.length > 0 && isEntryDuplicate(entries[entries.length - 1], newEntry)) {
    return entries;
  }
  return [...entries, newEntry];
}

@Component({
  selector: 'app-history-accumulator',
  standalone: true,
  template: `
    @if (entries.length > 0) {
      <div style="border-radius: 0.75rem; border: 1px solid var(--board-border); background: var(--card); padding: 1rem;">
        @for (entry of sortedEntries(); track $index; let i = $index; let isLast = $last) {
          <div style="display: flex; align-items: flex-start; gap: 0.5rem; padding: 0.25rem 0;">
            <span class="font-chalk" style="flex-shrink: 0; font-size: 0.75rem; color: var(--muted-foreground);">
              {{ i + 1 }}.
            </span>
            <span class="font-chalk" style="flex: 1; font-size: 0.875rem; line-height: 1.6; color: var(--foreground);">
              {{ formatEntry(entry) }}{{ isLast ? '.' : ';' }}
            </span>
            <!-- X por item individual -->
            <button
              type="button"
              (click)="removeAt.emit(indexOf(entry))"
              title="Remover este registro"
              style="flex-shrink: 0; background: none; border: none; cursor: pointer; color: var(--color-absent); opacity: 0.7; padding: 0.125rem; display: flex; align-items: center;"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
        }
      </div>
    }

    @if (addLabel) {
      <button
        type="button"
        [disabled]="addDisabled"
        (click)="add.emit()"
        [style.border-color]="addDisabled ? 'rgba(58,56,53,0.4)' : 'rgba(94,196,160,0.4)'"
        [style.color]="addDisabled ? 'rgba(138,135,128,0.4)' : 'rgb(94,196,160)'"
        [style.cursor]="addDisabled ? 'not-allowed' : 'pointer'"
        style="display: flex; width: 100%; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 0.75rem; border: 2px dashed; padding: 0.75rem 1rem; transition: all 0.2s; background: transparent;"
        class="font-chalk"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"/><path d="M12 5v14"/>
        </svg>
        {{ addLabel }}
      </button>
    }
  `,
})
export class HistoryAccumulatorComponent {
  @Input() entries: HistoryEntry[] = [];
  @Input() addLabel = 'Adicionar';
  @Input() addDisabled = false;
  @Input() canRemoveLast = false;

  @Output() add = new EventEmitter<void>();
  @Output() removeLast = new EventEmitter<void>();
  @Output() removeAt = new EventEmitter<number>(); // índice no array original

  sortedEntries(): HistoryEntry[] {
    return sortEntries(this.entries);
  }

  indexOf(entry: HistoryEntry): number {
    return this.entries.indexOf(entry);
  }

  formatEntry(entry: HistoryEntry): string {
    let str = entry.source;
    if (entry.status) str += ` - ${STATUS_LABELS[entry.status] ?? entry.status}`;
    if (entry.observation?.trim()) str += ` (${entry.observation.trim()})`;
    return str;
  }
}
