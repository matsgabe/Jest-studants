import { jest, describe, beforeEach, expect, it } from "@jest/globals";

let utils, students;

describe("Módulo de Utilitários", () => {
  beforeEach(async () => {
    jest.resetModules();

    jest.unstable_mockModule("./../src/students.js", () => ({
      getAllStudents: jest.fn(),
      resetStudents: jest.fn(),
      addStudent: jest.fn(),
    }));

    utils = await import("./../src/utils.js");
    students = await import("./../src/students.js");
  });

  it("exportStudentsToJSON deve exportar a lista de alunos para JSON", () => {
    const mockStudentList = [
      { id: 1, name: "Matheus", grades: [8, 9] },
      { id: 2, name: "Gabriel", grades: [7, 6] },
    ];
    students.getAllStudents.mockReturnValue(mockStudentList);

    const json = utils.exportStudentsToJSON();
    const expectedJson = JSON.stringify(mockStudentList, null, 2);
    expect(json).toBe(expectedJson);
  });

  it("importStudentsFromJSON deve importar alunos de um JSON válido", () => {
    const mockStudentList = [
      { id: 1, name: "Matsgabe" },
      { id: 2, name: "Silva" },
    ];
    const json = JSON.stringify(mockStudentList);

    utils.importStudentsFromJSON(json);

    expect(students.resetStudents).toHaveBeenCalledTimes(1);
    expect(students.addStudent).toHaveBeenCalledTimes(2);
    expect(students.addStudent).toHaveBeenNthCalledWith(
      1,
      mockStudentList[0],
      expect.anything(),
      expect.anything()
    );
    expect(students.addStudent).toHaveBeenNthCalledWith(
      2,
      mockStudentList[1],
      expect.anything(),
      expect.anything()
    );
  });

  it("importStudentsFromJSON deve lançar um erro para JSON inválido", () => {
    const invalidJson = '{"invalid": true}';
    expect(() => utils.importStudentsFromJSON(invalidJson)).toThrow(
      "Formato inválido"
    );
  });

  it("importStudentsFromJSON deve lançar um erro para string JSON mal formatada", () => {
    const malformedJson = '[{id: 1, name: "test"}]';
    expect(() => utils.importStudentsFromJSON(malformedJson)).toThrow(
      /Erro ao importar JSON/
    );
  });
});
