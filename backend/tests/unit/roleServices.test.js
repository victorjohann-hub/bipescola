import { jest } from '@jest/globals';

const mockUserModel = {
  updateRoleById: jest.fn(),
  findByRole: jest.fn(),
  updateById: jest.fn(),
  deleteById: jest.fn(),
  findById: jest.fn(),
};

const mockUserService = {
  createUser: jest.fn(),
};

jest.unstable_mockModule('../../src/models/userModel.js', () => mockUserModel);
jest.unstable_mockModule('../../src/services/userService.js', () => mockUserService);

const admService = await import('../../src/services/admService.js');
const parentService = await import('../../src/services/parentService.js');
const professorService = await import('../../src/services/professorService.js');

describe('Role Services (adm, parent, professor) Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('admService', () => {
    it('createAdm deve criar usuário e atualizar role para ADM', async () => {
      mockUserService.createUser.mockResolvedValueOnce({
        user: { id: 10, nome: 'Adm' },
        tempPassword: 'pass',
      });
      mockUserModel.updateRoleById.mockResolvedValueOnce({ id: 10, nome: 'Adm', role: 'ADM' });

      const result = await admService.createAdm({ nome: 'Adm', email: 'adm@escola.com' });
      expect(result).toEqual({
        user: { id: 10, nome: 'Adm', role: 'ADM' },
        tempPassword: 'pass',
      });
      expect(mockUserModel.updateRoleById).toHaveBeenCalledWith(10, 'ADM');
    });

    it('getAdms, updateAdm, deleteAdm devem chamar userModel', async () => {
      mockUserModel.findByRole.mockResolvedValueOnce([{ id: 10 }]);
      mockUserModel.updateById.mockResolvedValueOnce({ id: 10, nome: 'Novo' });
      mockUserModel.deleteById.mockResolvedValueOnce(true);

      expect(await admService.getAdms()).toEqual([{ id: 10 }]);
      expect(mockUserModel.findByRole).toHaveBeenCalledWith('ADM');
      expect(await admService.updateAdm(10, { nome: 'Novo' })).toEqual({ id: 10, nome: 'Novo' });
      expect(await admService.deleteAdm(10)).toBe(true);
    });
  });

  describe('parentService', () => {
    it('createParent deve criar usuário e atualizar role para PARENT', async () => {
      mockUserService.createUser.mockResolvedValueOnce({
        user: { id: 20, nome: 'Pai' },
        tempPassword: 'pass',
      });
      mockUserModel.updateRoleById.mockResolvedValueOnce({ id: 20, nome: 'Pai', role: 'PARENT' });

      const result = await parentService.createParent({ nome: 'Pai', email: 'pai@escola.com' });
      expect(result).toEqual({
        user: { id: 20, nome: 'Pai', role: 'PARENT' },
        tempPassword: 'pass',
      });
      expect(mockUserModel.updateRoleById).toHaveBeenCalledWith(20, 'PARENT');
    });

    it('getParents, updateParent, deleteParent devem chamar userModel', async () => {
      mockUserModel.findByRole.mockResolvedValueOnce([{ id: 20 }]);
      mockUserModel.updateById.mockResolvedValueOnce({ id: 20, nome: 'Novo Pai' });
      mockUserModel.deleteById.mockResolvedValueOnce(true);

      expect(await parentService.getParents()).toEqual([{ id: 20 }]);
      expect(mockUserModel.findByRole).toHaveBeenCalledWith('PARENT');
      expect(await parentService.updateParent(20, { nome: 'Novo Pai' })).toEqual({ id: 20, nome: 'Novo Pai' });
      expect(await parentService.deleteParent(20)).toBe(true);
    });
  });

  describe('professorService', () => {
    it('createProfessor deve criar usuário e atualizar role para PROF', async () => {
      mockUserService.createUser.mockResolvedValueOnce({
        user: { id: 30, nome: 'Prof' },
        tempPassword: 'pass',
      });
      mockUserModel.updateRoleById.mockResolvedValueOnce({ id: 30, nome: 'Prof', role: 'PROF' });

      const result = await professorService.createProfessor({ nome: 'Prof', email: 'prof@escola.com' });
      expect(result).toEqual({
        user: { id: 30, nome: 'Prof', role: 'PROF' },
        tempPassword: 'pass',
      });
      expect(mockUserModel.updateRoleById).toHaveBeenCalledWith(30, 'PROF');
    });

    it('getProfessors deve buscar pela role PROF', async () => {
      mockUserModel.findByRole.mockResolvedValueOnce([{ id: 30 }]);
      expect(await professorService.getProfessors()).toEqual([{ id: 30 }]);
      expect(mockUserModel.findByRole).toHaveBeenCalledWith('PROF');
    });

    it('getProfessorById deve retornar null se não encontrado ou se não for PROF', async () => {
      mockUserModel.findById.mockResolvedValueOnce(null);
      expect(await professorService.getProfessorById(99)).toBeNull();

      mockUserModel.findById.mockResolvedValueOnce({ id: 40, role: 'ADM' });
      expect(await professorService.getProfessorById(40)).toBeNull();
    });

    it('getProfessorById deve retornar o professor se a role for PROF', async () => {
      mockUserModel.findById.mockResolvedValueOnce({ id: 30, role: 'PROF' });
      expect(await professorService.getProfessorById(30)).toEqual({ id: 30, role: 'PROF' });
    });

    it('updateProfessor e deleteProfessor devem chamar userModel', async () => {
      mockUserModel.updateById.mockResolvedValueOnce({ id: 30, nome: 'Prof Novo' });
      mockUserModel.deleteById.mockResolvedValueOnce(true);

      expect(await professorService.updateProfessor(30, { nome: 'Prof Novo' })).toEqual({ id: 30, nome: 'Prof Novo' });
      expect(await professorService.deleteProfessor(30)).toBe(true);
    });
  });
});
