import {
  addStudent,
  editStudentName,
  removeStudent,
  getAllStudents,
  getStudentByName,
  getStudentById,
  resetStudents,
} from "./../src/students.js";

describe("Gerenciamento de alunos", () => {
  beforeEach(() => {
    resetStudents();
  });

  it("Deve adicionar um novo aluno", () => {
    const student = { id: 1, name: "Matheus Gabriel" };
    addStudent(student);
    expect(getAllStudents()).toHaveLength(1);
    expect(getStudentById(1)).toEqual({ ...student, grades: [] });
  });

  it("Validar ID duplicado", () => {
    const student = { id: 1, name: "Matheus Gabriel" };
    addStudent(student);
    expect(() => addStudent(student)).toThrow("ID duplicado");
  });

  it("Deve aditar o nome do aluno", () => {
    const student = { id: 1, name: "Matheus Gabriel" };
    addStudent(student);
    editStudentName(1, "Matsgabe");
    expect(getStudentById(1).name).toBe("Matsgabe");
  });

  it("Erro ao editar aluno inexistente", () => {
    expect(() => editStudentName(99, "Nome Inexistente")).toThrow(
      "Aluno não encontrado"
    );
  });

  it("Remover aluno", () => {
    const student = { id: 1, name: "Matheus Gabriel" };
    addStudent(student);
    removeStudent(1);
    expect(getAllStudents()).toHaveLength(0);
  });

  it("Erro ao remover aluno inexistente", () => {
    expect(() => removeStudent(2)).toThrow("Aluno não encontrado");
  });

  it("Retorna todos os alunos", () => {
    addStudent({ id: 1, name: "Matheus" });
    addStudent({ id: 2, name: "Gabriel" });
    addStudent({ id: 3, name: "Silva" });
    expect(getAllStudents()).toHaveLength(3);
  });

  it("Realiza a busca pelo nome", () => {
    addStudent({ id: 1, name: "Matheus Gabriel" });
    addStudent({ id: 2, name: "Matsgabe" });
    const result = getStudentByName("Matheus");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Matheus Gabriel");
  });

  it("Realiza a busca pelo ID", () => {
    const student = { id: 1, name: "Matheus Gabriel" };
    addStudent(student);
    expect(getStudentById(1)).toEqual({ ...student, grades: [] });
  });

  it("Reseta a lista de alunos", () => {
    addStudent({ id: 1, name: "Matheus Gabriel" });
    resetStudents();
    expect(getAllStudents()).toHaveLength(0);
  });
});
