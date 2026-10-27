import { jest } from '@jest/globals';

const mockClassModel = {
  createClass: jest.fn(),
  getClasses: jest.fn(),
  findById: jest.fn(),
  deleteById: jest.fn(),
  updateClassById: jest.fn(),
};

jest.unstable_mockModule('../../src/models/classModel.js', () => mockClassModel);

const classService = await import('../../src/services/classService.js');

describe('classService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createClass deve retornar o objeto turma criado', async () => {
    mockClassModel.createClass.mockResolvedValueOnce({ id: 1, nome: '1A' });
    const result = await classService.createClass({ nome: '1A' });
    expect(result).toEqual({ turma: { id: 1, nome: '1A' } });
    expect(mockClassModel.createClass).toHaveBeenCalledWith({ nome: '1A' });
  });

  it('getClasses deve retornar a lista de turmas', async () => {
    mockClassModel.getClasses.mockResolvedValueOnce([{ id: 1, nome: '1A' }]);
    const result = await classService.getClasses();
    expect(result).toEqual([{ id: 1, nome: '1A' }]);
  });

  it('getClassById deve buscar por id', async () => {
    mockClassModel.findById.mockResolvedValueOnce({ id: 2, nome: '2A' });
    const result = await classService.getClassById(2);
    expect(result).toEqual({ id: 2, nome: '2A' });
    expect(mockClassModel.findById).toHaveBeenCalledWith(2);
  });

  it('deleteClassById deve deletar por id', async () => {
    mockClassModel.deleteById.mockResolvedValueOnce({ id: 2, nome: '2A' });
    const result = await classService.deleteClassById(2);
    expect(result).toEqual({ id: 2, nome: '2A' });
    expect(mockClassModel.deleteById).toHaveBeenCalledWith(2);
  });

  it('updateClassById deve atualizar por id', async () => {
    mockClassModel.updateClassById.mockResolvedValueOnce({ id: 2, nome: '2B', status: 'ativa' });
    const result = await classService.updateClassById(2, { nome: '2B', status: 'ativa' });
    expect(result).toEqual({ id: 2, nome: '2B', status: 'ativa' });
    expect(mockClassModel.updateClassById).toHaveBeenCalledWith(2, { nome: '2B', status: 'ativa' });
  });
});
