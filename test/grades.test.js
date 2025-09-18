import { jest, describe, beforeEach, test, expect } from "@jest/globals";

let grades, students;

describe("Gerenciamento de Notas", () => {
  let student;

  beforeEach(async () => {
    jest.resetModules();
    jest.unstable_mockModule("./../src/students.js", () => ({
      getStudentById: jest.fn(),
    }));

    grades = await import("./../src/grades.js");
    students = await import("./../src/students.js");

    student = { id: 1, name: "Estudante Teste", grades: [] };
    students.getStudentById.mockImplementation((id) => {
      if (id === student.id) {
        return student;
      }
      return undefined;
    });
  });

  test("Adiciona uma nota válida", () => {
    grades.addGrade(1, 8);
    expect(student.grades).toHaveLength(1);
    expect(student.grades[0]).toBe(8);
  });

  test("Erro ao adicionar nota inválida", () => {
    expect(() => grades.addGrade(1, -1)).toThrow("Nota inválida");
    expect(() => grades.addGrade(1, 11)).toThrow("Nota inválida");
  });

  test("Nota para aluno inexistente", () => {
    students.getStudentById.mockReturnValue(undefined);
    expect(() => grades.addGrade(99, 8)).toThrow("Aluno não encontrado");
  });

  test("Remover nota", () => {
    student.grades.push(7, 8, 9);
    grades.removeGrade(1, 1);
    expect(student.grades).toEqual([7, 9]);
  });

  test("Erro ao remover nota inexistente", () => {
    student.grades.push(10);
    expect(() => grades.removeGrade(1, 5)).toThrow("Nota não encontrada");
  });

  test("Retornar notas de um aluno", () => {
    student.grades.push(5, 6, 7);
    const result = grades.getGrades(1);
    expect(result).toEqual([5, 6, 7]);
    result.push(8);
    expect(student.grades).toEqual([5, 6, 7]);
  });

  test("Array vazio para aluno sem nota", () => {
    expect(grades.getGrades(1)).toEqual([]);
  });

  test("Filtrar nota por categoria", () => {
    student.grades.push(4, 8, 9, 6);
    const aprovadas = grades.getGradesByCategory(1, (grade) => grade >= 7);
    expect(aprovadas).toEqual([8, 9]);
  });

  test("Calcular Média", () => {
    student.grades.push(5, 7, 9);
    expect(grades.calculateAverage(1)).toBe(7);
  });

  test("Retorna 0 para aluno sem nota", () => {
    expect(grades.calculateAverage(1)).toBe(0);
  });

  test("Calcula média com vírgula", () => {
    student.grades.push(7, 8);
    expect(grades.calculateWeightedAverage(1)).toBeCloseTo(7.666);
  });
});
