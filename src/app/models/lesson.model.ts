// =============================================
// Data Models - lesson.model.ts
// =============================================

export type StatusLevel = 'estudar' | 'regular' | 'bom';
export type EngineType = 'cordas' | 'metais-madeiras' | 'teoria' | 'generic';
export type AttendanceStatus = 'present' | 'absent' | 'pending';
export type FlowStep = 'choose' | 'group-engine' | 'individual-tree' | 'review';

export interface Student {
  name: string;
  turmaIds: string[];
}

export interface HistoryEntry {
  source: string;
  status?: StatusLevel;
  observation?: string;
}

export interface StudentRecord {
  metodo: HistoryEntry[];
  hinario: HistoryEntry[];
  escalas: HistoryEntry[];
  outros: string;
}

export interface StructuredGroup {
  methodName: string;
  details: string[];
}

export interface StructuredRecord {
  metodo: StructuredGroup[];
  hinario: StructuredGroup[];
  escalas: StructuredGroup[];
  outros: string;
}

export interface LessonRecord {
  id: string;
  turmaId: string;
  date: string; // ISO "yyyy-MM-dd"
  presentStudents: string[];
  totalStudents: number;
  mode: 'group' | 'individual';
  studentRecords: Record<string, StructuredRecord>;
}

export interface ClassInfo {
  id: string;
  title: string;
  subtitle: string;
  fullName: string;
  engineType: EngineType;
  allowGroup: boolean;
  icon: string; // icon name for the illustration
}

export interface TurmaConfig {
  engine: EngineType;
  allowGroup: boolean;
}

export interface ClassHistory {
  turmaId: string;
  turmaName: string;
  totalLessons: number;
  avgPresent: number;
  totalStudents: number;
  percentage: number;
  lessons: LessonRecord[];
}

export interface StudentFrequency {
  turmaId: string;
  turmaName: string;
  present: number;
  total: number;
  percentage: number;
}

export interface AttendanceMap {
  [studentName: string]: boolean; // true=present, false=absent
}

export function emptyStudentRecord(): StudentRecord {
  return { metodo: [], hinario: [], escalas: [], outros: '' };
}

export function emptyStructuredRecord(): StructuredRecord {
  return { metodo: [], hinario: [], escalas: [], outros: '' };
}

// Status display helpers
export const STATUS_LABELS: Record<StatusLevel, string> = {
  estudar: 'Estudar',
  regular: 'Regular',
  bom: 'Bom',
};

export const STATUS_COLORS: Record<StatusLevel, { bg: string; border: string; text: string }> = {
  estudar: { bg: 'rgba(220,70,70,0.2)', border: 'rgb(220,70,70)', text: 'rgb(220,70,70)' },
  regular: { bg: 'rgba(230,160,50,0.2)', border: 'rgb(230,160,50)', text: 'rgb(230,160,50)' },
  bom: { bg: 'rgba(60,185,80,0.2)', border: 'rgb(60,185,80)', text: 'rgb(60,185,80)' },
};

// Turma configuration map
export const TURMA_CONFIG: Record<string, TurmaConfig> = {
  musicalizacao: { engine: 'generic', allowGroup: true },
  teoria: { engine: 'teoria', allowGroup: true },
  'cordas-01': { engine: 'cordas', allowGroup: false },
  'cordas-02': { engine: 'cordas', allowGroup: false },
  madeiras: { engine: 'metais-madeiras', allowGroup: false },
  'metais-01': { engine: 'metais-madeiras', allowGroup: false },
  'metais-02': { engine: 'metais-madeiras', allowGroup: false },
  'pratica-conjunto': { engine: 'generic', allowGroup: true },
};

export function getTurmaConfig(turmaId: string): TurmaConfig {
  return TURMA_CONFIG[turmaId] ?? { engine: 'generic', allowGroup: true };
}
