// =============================================
// Mock History Data - mirrors the Next.js mock-history.ts
// =============================================

import { LessonRecord, StructuredGroup, StructuredRecord } from '../models/lesson.model';

function mg(methodName: string, details: string[]): StructuredGroup {
  return { methodName, details };
}

function makeStructured(
  metodo: StructuredGroup[] = [],
  hinario: StructuredGroup[] = [],
  escalas: StructuredGroup[] = [],
  outros = ''
): StructuredRecord {
  return { metodo, hinario, escalas, outros };
}

export const MOCK_LESSONS: LessonRecord[] = [
  // Cordas-01 lessons
  {
    id: 'c01-2026-02-07', turmaId: 'cordas-01', date: '2026-02-07',
    presentStudents: ['Helena Castro', 'Enzo Rocha', 'Valentina Moreira', 'Bernardo Nunes', 'Alice Teixeira', 'Nicolas Mendes', 'Larissa Campos'],
    totalStudents: 7, mode: 'individual',
    studentRecords: {
      'Helena Castro': makeStructured([mg('SUZUKI', ['Vol.1 Licao 5 / Bom'])], [mg('HINARIO', ['Hino 120 / Bom'])], [mg('ESCALAS', ['Sol Maior 2 oitavas / Bom'])]),
      'Enzo Rocha': makeStructured([mg('SUZUKI', ['Vol.1 Licao 3 / Regular'])], [mg('HINARIO', ['Hino 120 / Estudar'])], [mg('ESCALAS', ['Re Maior 1 oitava / Regular'])]),
      'Valentina Moreira': makeStructured([mg('SUZUKI', ['Vol.1 Licao 4 / Bom'])], [mg('HINARIO', ['Hino 120 / Regular'])], [mg('ESCALAS', ['Sol Maior 2 oitavas / Bom'])]),
      'Bernardo Nunes': makeStructured([mg('SUZUKI', ['Vol.1 Licao 2 / Estudar'])], [], [mg('ESCALAS', ['Re Maior 1 oitava / Estudar'])]),
      'Alice Teixeira': makeStructured([mg('SUZUKI', ['Vol.1 Licao 5 / Bom'])], [mg('HINARIO', ['Hino 120 / Bom'])], [mg('ESCALAS', ['La Maior 2 oitavas / Bom'])]),
      'Nicolas Mendes': makeStructured([mg('SUZUKI', ['Vol.1 Licao 3 / Regular'])], [mg('HINARIO', ['Hino 120 / Regular'])], [mg('ESCALAS', ['Sol Maior 1 oitava / Regular'])]),
      'Larissa Campos': makeStructured([mg('SUZUKI', ['Vol.1 Licao 4 / Bom'])], [mg('HINARIO', ['Hino 120 / Bom'])], [mg('ESCALAS', ['Sol Maior 2 oitavas / Bom'])]),
    },
  },
  {
    id: 'c01-2026-02-14', turmaId: 'cordas-01', date: '2026-02-14',
    presentStudents: ['Helena Castro', 'Enzo Rocha', 'Valentina Moreira', 'Alice Teixeira', 'Nicolas Mendes', 'Larissa Campos'],
    totalStudents: 7, mode: 'individual',
    studentRecords: {
      'Helena Castro': makeStructured([mg('SUZUKI', ['Vol.1 Licao 6 / Bom'])], [mg('HINARIO', ['Hino 135 / Bom'])], [mg('ESCALAS', ['La Maior 2 oitavas / Bom'])]),
      'Enzo Rocha': makeStructured([mg('SUZUKI', ['Vol.1 Licao 4 / Regular'])], [mg('HINARIO', ['Hino 135 / Estudar'])], [mg('ESCALAS', ['Sol Maior 1 oitava / Regular'])]),
      'Valentina Moreira': makeStructured([mg('SUZUKI', ['Vol.1 Licao 5 / Bom'])], [mg('HINARIO', ['Hino 135 / Regular'])], [mg('ESCALAS', ['La Maior 2 oitavas / Regular'])]),
      'Alice Teixeira': makeStructured([mg('SUZUKI', ['Vol.1 Licao 6 / Bom'])], [mg('HINARIO', ['Hino 135 / Bom'])], [mg('ESCALAS', ['Si bemol Maior 2 oitavas / Bom'])]),
      'Nicolas Mendes': makeStructured([mg('SUZUKI', ['Vol.1 Licao 3 / Regular'])], [mg('HINARIO', ['Hino 135 / Estudar'])], [mg('ESCALAS', ['Sol Maior 1 oitava / Regular'])]),
      'Larissa Campos': makeStructured([mg('SUZUKI', ['Vol.1 Licao 5 / Bom'])], [mg('HINARIO', ['Hino 135 / Bom'])], [mg('ESCALAS', ['La Maior 2 oitavas / Bom'])]),
    },
  },
  // Teoria
  {
    id: 't-2026-01-31', turmaId: 'teoria', date: '2026-01-31',
    presentStudents: ['Rafael Barbosa', 'Julia Ribeiro', 'Felipe Goncalves', 'Camila Araujo', 'Thiago Melo', 'Fernanda Dias', 'Bruno Cardoso', 'Mariana Monteiro'],
    totalStudents: 8, mode: 'group',
    studentRecords: Object.fromEntries(
      ['Rafael Barbosa', 'Julia Ribeiro', 'Felipe Goncalves', 'Camila Araujo', 'Thiago Melo', 'Fernanda Dias', 'Bruno Cardoso', 'Mariana Monteiro'].map(n => [n, makeStructured([mg('SOLFEJO', ['Apostila Solfejo Licao 12 e 13 / Regular'])], [], [], 'Revisao de intervalos e acordes. Ditado ritmico.')])
    ),
  },
  {
    id: 't-2026-02-07', turmaId: 'teoria', date: '2026-02-07',
    presentStudents: ['Rafael Barbosa', 'Julia Ribeiro', 'Felipe Goncalves', 'Camila Araujo', 'Fernanda Dias', 'Mariana Monteiro'],
    totalStudents: 8, mode: 'group',
    studentRecords: Object.fromEntries(
      ['Rafael Barbosa', 'Julia Ribeiro', 'Felipe Goncalves', 'Camila Araujo', 'Fernanda Dias', 'Mariana Monteiro'].map(n => [n, makeStructured([mg('SOLFEJO', ['Apostila Solfejo Licao 14 / Bom'])], [], [], 'Escalas maiores e menores. Exercicio de leitura a primeira vista.')])
    ),
  },
  // Metais-01
  {
    id: 'm01-2026-02-07', turmaId: 'metais-01', date: '2026-02-07',
    presentStudents: ['Miguel Costa', 'Clara Santos', 'Joao Vitor Lima', 'Ana Beatriz Ferreira', 'Daniel Oliveira', 'Maria Eduarda Souza', 'Heitor Almeida', 'Luiza Carvalho'],
    totalStudents: 8, mode: 'individual',
    studentRecords: {
      'Miguel Costa': makeStructured([mg('ALMEIDA DIAS', ['Fase 2 RITMO L3,L4 / Bom']), mg('RUBANK', ['Licao 22 / Regular'])], [mg('HINARIO', ['Hino 45 / Bom'])], [mg('ESCALAS', ['Si bemol Maior cromatica / Regular'])]),
      'Clara Santos': makeStructured([mg('ALMEIDA DIAS', ['Fase 1 RITMO L5 / Regular'])], [mg('HINARIO', ['Hino 45 / Estudar'])], [mg('ESCALAS', ['Fa Maior 1 oitava / Estudar'])]),
      'Joao Vitor Lima': makeStructured([mg('ALMEIDA DIAS', ['Fase 2 RITMO L2 / Bom'])], [mg('HINARIO', ['Hino 45 / Bom'])], [mg('ESCALAS', ['Si bemol Maior 2 oitavas / Bom'])]),
      'Ana Beatriz Ferreira': makeStructured([mg('ALMEIDA DIAS', ['Fase 1 RITMO L4 / Regular'])], [mg('HINARIO', ['Hino 45 / Regular'])], [mg('ESCALAS', ['Do Maior 1 oitava / Regular'])]),
      'Daniel Oliveira': makeStructured([mg('ALMEIDA DIAS', ['Fase 2 RITMO L5 / Bom']), mg('RUBANK', ['Licao 25 / Bom'])], [mg('HINARIO', ['Hino 45 / Bom'])], [mg('ESCALAS', ['Mi bemol Maior 2 oitavas / Bom'])]),
      'Maria Eduarda Souza': makeStructured([mg('ALMEIDA DIAS', ['Fase 1 RITMO L3 / Estudar'])], [mg('HINARIO', ['Hino 45 / Estudar'])], [mg('ESCALAS', ['Fa Maior 1 oitava / Estudar'])]),
      'Heitor Almeida': makeStructured([mg('ALMEIDA DIAS', ['Fase 2 RITMO L1 / Regular'])], [mg('HINARIO', ['Hino 45 / Regular'])], [mg('ESCALAS', ['Si bemol Maior 1 oitava / Regular'])]),
      'Luiza Carvalho': makeStructured([mg('ALMEIDA DIAS', ['Fase 1 RITMO L5 / Bom'])], [mg('HINARIO', ['Hino 45 / Bom'])], [mg('ESCALAS', ['Do Maior 2 oitavas / Bom'])]),
    },
  },
  // Musicalizacao
  {
    id: 'mus-2026-02-07', turmaId: 'musicalizacao', date: '2026-02-07',
    presentStudents: ['Ana Clara Oliveira', 'Pedro Henrique Santos', 'Maria Luiza Costa', 'Gabriel Ferreira', 'Isabela Rodrigues', 'Lucas Almeida', 'Beatriz Carvalho', 'Matheus Souza', 'Laura Pereira', 'Davi Lima'],
    totalStudents: 12, mode: 'group',
    studentRecords: Object.fromEntries(
      ['Ana Clara Oliveira', 'Pedro Henrique Santos', 'Maria Luiza Costa', 'Gabriel Ferreira', 'Isabela Rodrigues', 'Lucas Almeida', 'Beatriz Carvalho', 'Matheus Souza', 'Laura Pereira', 'Davi Lima'].map(n => [n, makeStructured([], [], [], 'Atividade ritmica com palmas e instrumentos de percussao. Introducao a flauta doce - notas Si e La.')])
    ),
  },
  {
    id: 'mus-2026-02-14', turmaId: 'musicalizacao', date: '2026-02-14',
    presentStudents: ['Ana Clara Oliveira', 'Pedro Henrique Santos', 'Maria Luiza Costa', 'Gabriel Ferreira', 'Isabela Rodrigues', 'Lucas Almeida', 'Beatriz Carvalho', 'Matheus Souza', 'Laura Pereira', 'Davi Lima', 'Sofia Martins'],
    totalStudents: 12, mode: 'group',
    studentRecords: Object.fromEntries(
      ['Ana Clara Oliveira', 'Pedro Henrique Santos', 'Maria Luiza Costa', 'Gabriel Ferreira', 'Isabela Rodrigues', 'Lucas Almeida', 'Beatriz Carvalho', 'Matheus Souza', 'Laura Pereira', 'Davi Lima', 'Sofia Martins'].map(n => [n, makeStructured([], [], [], 'Continuacao da flauta doce - notas Si, La e Sol. Cantigas de roda harmonizadas.')])
    ),
  },
  // Madeiras
  {
    id: 'mad-2026-02-07', turmaId: 'madeiras', date: '2026-02-07',
    presentStudents: ['Aurora Silva', 'Henrique Duarte', 'Luana Batista', 'Caio Rezende', 'Yasmin Freitas', 'Ryan Machado', 'Elisa Fonseca'],
    totalStudents: 7, mode: 'individual',
    studentRecords: {
      'Aurora Silva': makeStructured([mg('RUBANK', ['Licao 18 / Bom'])], [mg('HINARIO', ['Hino 90 / Bom'])], [mg('ESCALAS', ['Si bemol Maior 2 oitavas / Bom'])]),
      'Henrique Duarte': makeStructured([mg('RUBANK', ['Licao 15 / Regular'])], [mg('HINARIO', ['Hino 90 / Regular'])], [mg('ESCALAS', ['Fa Maior 1 oitava / Regular'])]),
      'Luana Batista': makeStructured([mg('RUBANK', ['Licao 16 / Regular'])], [mg('HINARIO', ['Hino 90 / Estudar'])], [mg('ESCALAS', ['Mi bemol Maior 1 oitava / Estudar'])]),
      'Caio Rezende': makeStructured([mg('RUBANK', ['Licao 20 / Bom'])], [mg('HINARIO', ['Hino 90 / Bom'])], [mg('ESCALAS', ['Do Maior 2 oitavas / Bom'])]),
      'Yasmin Freitas': makeStructured([mg('RUBANK', ['Licao 14 / Estudar'])], [mg('HINARIO', ['Hino 90 / Estudar'])], [mg('ESCALAS', ['Si bemol Maior 1 oitava / Estudar'])]),
      'Ryan Machado': makeStructured([mg('RUBANK', ['Licao 17 / Regular'])], [mg('HINARIO', ['Hino 90 / Regular'])], [mg('ESCALAS', ['Fa Maior 2 oitavas / Regular'])]),
      'Elisa Fonseca': makeStructured([mg('RUBANK', ['Licao 19 / Bom'])], [mg('HINARIO', ['Hino 90 / Bom'])], [mg('ESCALAS', ['Si bemol Maior 2 oitavas / Bom'])]),
    },
  },
  // Cordas-02
  {
    id: 'c02-2026-02-07', turmaId: 'cordas-02', date: '2026-02-07',
    presentStudents: ['Manuela Vieira', 'Gustavo Correia', 'Cecilia Ramos', 'Leonardo Pinto', 'Isadora Azevedo', 'Samuel Lopes'],
    totalStudents: 6, mode: 'individual',
    studentRecords: {
      'Manuela Vieira': makeStructured([mg('SUZUKI', ['Vol.2 Licao 1 / Bom'])], [mg('HINARIO', ['Hino 200 / Bom'])], [mg('ESCALAS', ['La Maior 2 oitavas / Bom'])]),
      'Gustavo Correia': makeStructured([mg('SUZUKI', ['Vol.1 Licao 8 / Regular'])], [mg('HINARIO', ['Hino 200 / Regular'])], [mg('ESCALAS', ['Sol Maior 2 oitavas / Regular'])]),
      'Cecilia Ramos': makeStructured([mg('SUZUKI', ['Vol.1 Licao 7 / Regular'])], [mg('HINARIO', ['Hino 200 / Estudar'])], [mg('ESCALAS', ['Re Maior 1 oitava / Estudar'])]),
      'Leonardo Pinto': makeStructured([mg('SUZUKI', ['Vol.2 Licao 2 / Bom'])], [mg('HINARIO', ['Hino 200 / Bom'])], [mg('ESCALAS', ['Si bemol Maior 2 oitavas / Bom'])]),
      'Isadora Azevedo': makeStructured([mg('SUZUKI', ['Vol.1 Licao 6 / Regular'])], [mg('HINARIO', ['Hino 200 / Regular'])], [mg('ESCALAS', ['Sol Maior 1 oitava / Regular'])]),
      'Samuel Lopes': makeStructured([mg('SUZUKI', ['Vol.1 Licao 9 / Bom'])], [mg('HINARIO', ['Hino 200 / Bom'])], [mg('ESCALAS', ['La Maior 2 oitavas / Bom'])]),
    },
  },
  // Metais-02
  {
    id: 'm02-2026-02-07', turmaId: 'metais-02', date: '2026-02-07',
    presentStudents: ['Antonio Pereira', 'Carolina Martins', 'Tomas Ribeiro', 'Gabriela Goncalves', 'Pedro Lucas Araujo', 'Stella Melo'],
    totalStudents: 6, mode: 'individual',
    studentRecords: {
      'Antonio Pereira': makeStructured([mg('ALMEIDA DIAS', ['Fase 3 RITMO L1 / Bom'])], [mg('HINARIO', ['Hino 78 / Bom'])], [mg('ESCALAS', ['Mi bemol Maior 2 oitavas / Bom'])]),
      'Carolina Martins': makeStructured([mg('ALMEIDA DIAS', ['Fase 2 RITMO L3 / Regular'])], [mg('HINARIO', ['Hino 78 / Regular'])], [mg('ESCALAS', ['Si bemol Maior 1 oitava / Regular'])]),
      'Tomas Ribeiro': makeStructured([mg('ALMEIDA DIAS', ['Fase 2 RITMO L5 / Bom'])], [mg('HINARIO', ['Hino 78 / Bom'])], [mg('ESCALAS', ['Fa Maior 2 oitavas / Bom'])]),
      'Gabriela Goncalves': makeStructured([mg('ALMEIDA DIAS', ['Fase 1 RITMO L4 / Estudar'])], [mg('HINARIO', ['Hino 78 / Estudar'])], [mg('ESCALAS', ['Do Maior 1 oitava / Estudar'])]),
      'Pedro Lucas Araujo': makeStructured([mg('ALMEIDA DIAS', ['Fase 2 RITMO L4 / Regular'])], [mg('HINARIO', ['Hino 78 / Regular'])], [mg('ESCALAS', ['Si bemol Maior 2 oitavas / Regular'])]),
      'Stella Melo': makeStructured([mg('ALMEIDA DIAS', ['Fase 3 RITMO L2 / Bom'])], [mg('HINARIO', ['Hino 78 / Bom'])], [mg('ESCALAS', ['Mi bemol Maior 2 oitavas / Bom'])]),
    },
  },
  // Pratica em Conjunto
  {
    id: 'pc-2026-02-14', turmaId: 'pratica-conjunto', date: '2026-02-14',
    presentStudents: ['Ana Clara Oliveira', 'Rafael Barbosa', 'Helena Castro', 'Miguel Costa', 'Aurora Silva', 'Enzo Rocha', 'Julia Ribeiro', 'Manuela Vieira', 'Gustavo Correia', 'Henrique Duarte', 'Clara Santos', 'Antonio Pereira'],
    totalStudents: 15, mode: 'group',
    studentRecords: Object.fromEntries(
      ['Ana Clara Oliveira', 'Rafael Barbosa', 'Helena Castro', 'Miguel Costa', 'Aurora Silva', 'Enzo Rocha', 'Julia Ribeiro', 'Manuela Vieira', 'Gustavo Correia', 'Henrique Duarte', 'Clara Santos', 'Antonio Pereira'].map(n => [n, makeStructured([], [], [], 'Ensaio geral - Hinos 45, 90 e 120. Trabalho de dinamica e afinacao em grupo. Ajustes de andamento com metronomo.')])
    ),
  },
];
