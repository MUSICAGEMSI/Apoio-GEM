// =============================================
// LessonService - Global State with RxJS + localStorage persistence
// =============================================
// Usage: inject(LessonService) in any standalone component
// All state is backed by BehaviorSubject and auto-persisted to localStorage.

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {
  LessonRecord,
  AttendanceMap,
  StructuredRecord,
  StructuredGroup,
  StudentFrequency,
  ClassHistory,
  getTurmaConfig,
} from '../models/lesson.model';
import { CLASSES_DATA, STUDENTS_BY_CLASS } from '../data/classes.data';
import { MOCK_LESSONS } from '../data/mock-lessons.data';

// ------- localStorage keys -------
const LS_KEY_LESSONS = 'sgaulas_lessons';
const LS_KEY_DRAFT_ATTENDANCE = 'sgaulas_draft_attendance';
const LS_KEY_DRAFT_DATE = 'sgaulas_draft_date';
const LS_KEY_DRAFT_RECORDS = 'sgaulas_draft_records';

@Injectable({ providedIn: 'root' })
export class LessonService {
  // ---------- Core state ----------
  private lessonsSubject: BehaviorSubject<LessonRecord[]>;
  lessons$: Observable<LessonRecord[]>;

  // ---------- Draft state (for in-progress attendance) ----------
  private draftAttendanceSubject: BehaviorSubject<Record<string, AttendanceMap>>;
  private draftDateSubject: BehaviorSubject<Record<string, string>>;
  private draftRecordsSubject: BehaviorSubject<Record<string, Record<string, StructuredRecord>>>;

  constructor() {
    // Initialize lessons from localStorage or fallback to mock data
    const storedLessons = this.loadFromStorage<LessonRecord[]>(LS_KEY_LESSONS);
    this.lessonsSubject = new BehaviorSubject<LessonRecord[]>(storedLessons ?? [...MOCK_LESSONS]);
    this.lessons$ = this.lessonsSubject.asObservable();

    // Draft attendance per turma
    const storedDraftAtt = this.loadFromStorage<Record<string, AttendanceMap>>(LS_KEY_DRAFT_ATTENDANCE);
    this.draftAttendanceSubject = new BehaviorSubject(storedDraftAtt ?? {});

    // Draft date per turma
    const storedDraftDate = this.loadFromStorage<Record<string, string>>(LS_KEY_DRAFT_DATE);
    this.draftDateSubject = new BehaviorSubject(storedDraftDate ?? {});

    // Draft student records per turma
    const storedDraftRecs = this.loadFromStorage<Record<string, Record<string, StructuredRecord>>>(LS_KEY_DRAFT_RECORDS);
    this.draftRecordsSubject = new BehaviorSubject(storedDraftRecs ?? {});

    // Auto-persist on every change
    this.lessonsSubject.subscribe(v => this.saveToStorage(LS_KEY_LESSONS, v));
    this.draftAttendanceSubject.subscribe(v => this.saveToStorage(LS_KEY_DRAFT_ATTENDANCE, v));
    this.draftDateSubject.subscribe(v => this.saveToStorage(LS_KEY_DRAFT_DATE, v));
    this.draftRecordsSubject.subscribe(v => this.saveToStorage(LS_KEY_DRAFT_RECORDS, v));
  }

  // ===================== PERSISTENCE HELPERS =====================

  private loadFromStorage<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private saveToStorage(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable - fail silently
    }
  }

  // ===================== DRAFT ATTENDANCE =====================

  getDraftAttendance(turmaId: string): AttendanceMap {
    return this.draftAttendanceSubject.value[turmaId] ?? {};
  }

  getDraftAttendance$(turmaId: string): Observable<AttendanceMap> {
    return this.draftAttendanceSubject.pipe(map(all => all[turmaId] ?? {}));
  }

  setDraftAttendance(turmaId: string, attendance: AttendanceMap): void {
    const current = { ...this.draftAttendanceSubject.value };
    current[turmaId] = attendance;
    this.draftAttendanceSubject.next(current);
  }

  updateStudentAttendance(turmaId: string, studentName: string, present: boolean): void {
    const current = this.getDraftAttendance(turmaId);
    this.setDraftAttendance(turmaId, { ...current, [studentName]: present });
  }

  clearDraftAttendance(turmaId: string): void {
    const current = { ...this.draftAttendanceSubject.value };
    delete current[turmaId];
    this.draftAttendanceSubject.next(current);
  }

  // ===================== DRAFT DATE =====================

  getDraftDate(turmaId: string): string | null {
    return this.draftDateSubject.value[turmaId] ?? null;
  }

  getDraftDate$(turmaId: string): Observable<string | null> {
    return this.draftDateSubject.pipe(map(all => all[turmaId] ?? null));
  }

  setDraftDate(turmaId: string, isoDate: string): void {
    const current = { ...this.draftDateSubject.value };
    current[turmaId] = isoDate;
    this.draftDateSubject.next(current);
  }

  clearDraftDate(turmaId: string): void {
    const current = { ...this.draftDateSubject.value };
    delete current[turmaId];
    this.draftDateSubject.next(current);
  }

  // ===================== DRAFT STUDENT RECORDS =====================

  getDraftRecords(turmaId: string): Record<string, StructuredRecord> {
    return this.draftRecordsSubject.value[turmaId] ?? {};
  }

  setDraftStudentRecord(turmaId: string, studentName: string, record: StructuredRecord): void {
    const current = { ...this.draftRecordsSubject.value };
    current[turmaId] = { ...(current[turmaId] ?? {}), [studentName]: record };
    this.draftRecordsSubject.next(current);
  }

  clearDraftRecords(turmaId: string): void {
    const current = { ...this.draftRecordsSubject.value };
    delete current[turmaId];
    this.draftRecordsSubject.next(current);
  }

  clearAllDrafts(turmaId: string): void {
    this.clearDraftAttendance(turmaId);
    this.clearDraftDate(turmaId);
    this.clearDraftRecords(turmaId);
  }

  // ===================== LESSON CRUD =====================

  addLesson(lesson: LessonRecord): void {
    const current = [...this.lessonsSubject.value];
    current.push(lesson);
    this.lessonsSubject.next(current);
  }

  getLessonsForTurma(turmaId: string): LessonRecord[] {
    return this.lessonsSubject.value
      .filter(l => l.turmaId === turmaId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  getLessonsForStudent(studentName: string): { lesson: LessonRecord; turmaId: string }[] {
    return this.lessonsSubject.value
      .filter(l => l.presentStudents.includes(studentName))
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(l => ({ lesson: l, turmaId: l.turmaId }));
  }

  getLessonById(lessonId: string): LessonRecord | undefined {
    return this.lessonsSubject.value.find(l => l.id === lessonId);
  }

  // ===================== STATIC HELPERS =====================

  getClassInfo(turmaId: string) {
    return CLASSES_DATA.find(c => c.id === turmaId);
  }

  getStudents(turmaId: string): string[] {
    return STUDENTS_BY_CLASS[turmaId] ?? [];
  }

  getAllStudents(): string[] {
    const allNames = new Set<string>();
    for (const students of Object.values(STUDENTS_BY_CLASS)) {
      for (const name of students) {
        allNames.add(name);
      }
    }
    return Array.from(allNames).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }

  getStudentTurmas(studentName: string): string[] {
    const turmas: string[] = [];
    for (const [turmaId, students] of Object.entries(STUDENTS_BY_CLASS)) {
      if (students.includes(studentName)) {
        turmas.push(turmaId);
      }
    }
    return turmas;
  }

  getTurmaName(turmaId: string): string {
    return this.getClassInfo(turmaId)?.fullName ?? turmaId;
  }

  // ===================== FREQUENCY CALCULATIONS =====================

  getStudentFrequency(studentName: string, turmaId: string): StudentFrequency {
    const lessons = this.getLessonsForTurma(turmaId);
    const total = lessons.length;
    const present = lessons.filter(l => l.presentStudents.includes(studentName)).length;
    return {
      turmaId,
      turmaName: this.getTurmaName(turmaId),
      present,
      total,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  }

  getTurmaFrequency(turmaId: string): ClassHistory {
    const lessons = this.getLessonsForTurma(turmaId);
    const totalLessons = lessons.length;
    const students = this.getStudents(turmaId);
    const totalStudents = students.length;

    let avgPresent = 0;
    let percentage = 0;
    if (totalLessons > 0) {
      avgPresent = Math.round(lessons.reduce((s, l) => s + l.presentStudents.length, 0) / totalLessons);
      percentage = totalStudents > 0 ? Math.round((avgPresent / totalStudents) * 100) : 0;
    }

    return {
      turmaId,
      turmaName: this.getTurmaName(turmaId),
      totalLessons,
      avgPresent,
      totalStudents,
      percentage,
      lessons,
    };
  }
}
