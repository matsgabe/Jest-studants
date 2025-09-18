import { jest, describe, beforeEach, it, expect } from "@jest/globals";

let evaluation, grades, students;

describe("Módulo de Avaliação", () => {
  beforeEach(async () => {
    jest.resetModules();

    jest.unstable_mockModule("./../src/grades.js", () => ({
      calculateAverage: jest.fn(),
    }));

    jest.unstable_mockModule("./../src/students.js", () => ({
      getAllStudents: jest.fn(),
    }));

    evaluation = await import("./../src/evaluation.js");
    grades = await import("./../src/grades.js");
    students = await import("./../src/students.js");
  });

  it('getStatusByAverage deve retornar "Aprovado"', () => {
    expect(evaluation.getStatusByAverage(7)).toBe("Aprovado");
    expect(evaluation.getStatusByAverage(8.5)).toBe("Aprovado");
  });

  it('getStatusByAverage deve retornar "Recuperação"', () => {
    expect(evaluation.getStatusByAverage(5)).toBe("Recuperação");
    expect(evaluation.getStatusByAverage(6.9)).toBe("Recuperação");
  });

  it('getStatusByAverage deve retornar "Reprovado"', () => {
    expect(evaluation.getStatusByAverage(4.9)).toBe("Reprovado");
    expect(evaluation.getStatusByAverage(0)).toBe("Reprovado");
  });

  it('getPerformanceLabel deve retornar "Excelente"', () => {
    expect(evaluation.getPerformanceLabel(9)).toBe("Excelente");
    expect(evaluation.getPerformanceLabel(10)).toBe("Excelente");
  });

  it('getPerformanceLabel deve retornar "Bom"', () => {
    expect(evaluation.getPerformanceLabel(7)).toBe("Bom");
    expect(evaluation.getPerformanceLabel(8.9)).toBe("Bom");
  });

  it('getPerformanceLabel deve retornar "Regular"', () => {
    expect(evaluation.getPerformanceLabel(5)).toBe("Regular");
    expect(evaluation.getPerformanceLabel(6.9)).toBe("Regular");
  });

  it('getPerformanceLabel deve retornar "Ruim"', () => {
    expect(evaluation.getPerformanceLabel(4.9)).toBe("Ruim");
    expect(evaluation.getPerformanceLabel(0)).toBe("Ruim");
  });

  it("generateReport deve gerar o relatório correto do aluno", () => {
    grades.calculateAverage.mockReturnValue(8.5);

    const report = evaluation.generateReport(1);
    expect(report).toEqual({
      average: 8.5,
      status: "Aprovado",
      performance: "Bom",
    });
    expect(grades.calculateAverage).toHaveBeenCalledWith(1);
  });

  it("filterByPerformance deve filtrar alunos por desempenho", () => {
    const mockStudents = [
      { id: 1, name: "Excelente Aluno" },
      { id: 2, name: "Bom Aluno" },
      { id: 3, name: "Excelente Aluno 2" },
    ];

    students.getAllStudents.mockReturnValue(mockStudents);
    grades.calculateAverage.mockImplementation((studentId) => {
      if (studentId === 1) return 9.5;
      if (studentId === 2) return 8.0;
      if (studentId === 3) return 9.0;
      return 0;
    });

    const excelentes = evaluation.filterByPerformance("Excelente");
    expect(excelentes).toHaveLength(2);
    expect(excelentes.map((s) => s.name)).toContain("Excelente Aluno");
    expect(excelentes.map((s) => s.name)).toContain("Excelente Aluno 2");
  });
});
