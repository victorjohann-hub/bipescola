import { jest } from '@jest/globals';

const mockStudentModel = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByParentId: jest.fn(),
  findByTurmaId: jest.fn(),
  create: jest.fn(),
  updateById: jest.fn(),
  deleteById: jest.fn(),
};

jest.unstable_mockModule('../../src/models/studentModel.js', () => mockStudentModel);

const studentService = await import('../../src/services/studentService.js');

describe('studentService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getStudents deve chamar findAll', async () => {
    mockStudentModel.findAll.mockResolvedValueOnce([{ id: 1, nome: 'Aluno' }]);
    expect(await studentService.getStudents()).toEqual([{ id: 1, nome: 'Aluno' }]);
  });

  it('getStudentById deve chamar findById', async () => {
    mockStudentModel.findById.mockResolvedValueOnce({ id: 1, nome: 'Aluno' });
    expect(await studentService.getStudentById(1)).toEqual({ id: 1, nome: 'Aluno' });
    expect(mockStudentModel.findById).toHaveBeenCalledWith(1);
  });

  it('getStudentsByParentId deve chamar findByParentId', async () => {
    mockStudentModel.findByParentId.mockResolvedValueOnce([{ id: 1 }]);
    expect(await studentService.getStudentsByParentId(10)).toEqual([{ id: 1 }]);
    expect(mockStudentModel.findByParentId).toHaveBeenCalledWith(10);
  });

  it('getStudentsByTurmaId deve chamar findByTurmaId', async () => {
    mockStudentModel.findByTurmaId.mockResolvedValueOnce([{ id: 2 }]);
    expect(await studentService.getStudentsByTurmaId(3)).toEqual([{ id: 2 }]);
    expect(mockStudentModel.findByTurmaId).toHaveBeenCalledWith(3);
  });

  it('createStudent deve chamar create', async () => {
    const data = { matricula: 'M1', nome: 'Aluno 1', turma_id: 1 };
    mockStudentModel.create.mockResolvedValueOnce({ id: 5, ...data });
    expect(await studentService.createStudent(data)).toEqual({ id: 5, ...data });
    expect(mockStudentModel.create).toHaveBeenCalledWith(data);
  });

  it('updateStudent deve chamar updateById', async () => {
    const data = { matricula: 'M1', nome: 'Aluno Edit', turma_id: 1 };
    mockStudentModel.updateById.mockResolvedValueOnce({ id: 5, ...data });
    expect(await studentService.updateStudent(5, data)).toEqual({ id: 5, ...data });
    expect(mockStudentModel.updateById).toHaveBeenCalledWith(5, data);
  });

  it('deleteStudent deve chamar deleteById', async () => {
    mockStudentModel.deleteById.mockResolvedValueOnce(true);
    expect(await studentService.deleteStudent(5)).toBe(true);
    expect(mockStudentModel.deleteById).toHaveBeenCalledWith(5);
  });
});
