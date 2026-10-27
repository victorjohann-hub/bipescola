import { jest } from '@jest/globals';

const mockQuery = jest.fn();

jest.unstable_mockModule('../../src/database/db.js', () => ({
  default: { getConnection: jest.fn() },
  query: mockQuery,
  getConnection: jest.fn(),
}));

const userModel = await import('../../src/models/userModel.js');
const classModel = await import('../../src/models/classModel.js');
const postModel = await import('../../src/models/postModel.js');
const studentModel = await import('../../src/models/studentModel.js');
const attendanceModel = await import('../../src/models/attendanceModel.js');

describe('Models Unit Tests (db queries)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('userModel', () => {
    it('create deve inserir e buscar por insertId', async () => {
      mockQuery.mockResolvedValueOnce({ insertId: 7 }); // INSERT
      mockQuery.mockResolvedValueOnce([{ id: 7, nome: 'Ana', email: 'ana@teste.com' }]); // findById

      const user = await userModel.create({ nome: 'Ana', email: 'ana@teste.com', senha: 'hash', firstLogin: true });

      expect(mockQuery).toHaveBeenCalledTimes(2);
      expect(user).toEqual({ id: 7, nome: 'Ana', email: 'ana@teste.com' });
    });

    it('findAll deve retornar lista de usuários', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
      const res = await userModel.findAll();
      expect(res).toHaveLength(2);
    });

    it('findByEmail deve retornar o primeiro resultado ou null', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1, email: 'a@a.com' }]);
      expect(await userModel.findByEmail('a@a.com')).toEqual({ id: 1, email: 'a@a.com' });

      mockQuery.mockResolvedValueOnce([]);
      expect(await userModel.findByEmail('inexistente@a.com')).toBeNull();
    });

    it('findById deve retornar usuário ou null', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 3 }]);
      expect(await userModel.findById(3)).toEqual({ id: 3 });

      mockQuery.mockResolvedValueOnce([]);
      expect(await userModel.findById(99)).toBeNull();
    });

    it('findByRole deve filtrar pela role', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1, role: 'ADM' }]);
      const res = await userModel.findByRole('ADM');
      expect(res).toEqual([{ id: 1, role: 'ADM' }]);
    });

    it('updateRoleById deve atualizar role e retornar o usuário atualizado', async () => {
      mockQuery.mockResolvedValueOnce({ affectedRows: 1 });
      mockQuery.mockResolvedValueOnce([{ id: 1, role: 'PROF' }]);

      const res = await userModel.updateRoleById(1, 'PROF');
      expect(res).toEqual({ id: 1, role: 'PROF' });
    });

    it('updateById deve atualizar nome e email e retornar findById', async () => {
      mockQuery.mockResolvedValueOnce({ affectedRows: 1 });
      mockQuery.mockResolvedValueOnce([{ id: 1, nome: 'Novo', email: 'novo@teste.com' }]);

      const res = await userModel.updateById(1, { nome: 'Novo', email: 'novo@teste.com' });
      expect(res).toEqual({ id: 1, nome: 'Novo', email: 'novo@teste.com' });
    });

    it('deleteById deve retornar true se affectedRows > 0', async () => {
      mockQuery.mockResolvedValueOnce({ affectedRows: 1 });
      expect(await userModel.deleteById(1)).toBe(true);

      mockQuery.mockResolvedValueOnce({ affectedRows: 0 });
      expect(await userModel.deleteById(99)).toBe(false);
    });

    it('updatePassword deve atualizar a senha e limpar reset_token', async () => {
      mockQuery.mockResolvedValueOnce({ affectedRows: 1 });
      expect(await userModel.updatePassword(1, 'novohash')).toBe(true);
    });

    it('saveResetToken deve persistir o token', async () => {
      mockQuery.mockResolvedValueOnce({ affectedRows: 1 });
      expect(await userModel.saveResetToken(1, 'token123', new Date())).toBe(true);
    });

    it('findByResetToken deve retornar o usuário com token válido', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1, email: 'teste@a.com' }]);
      expect(await userModel.findByResetToken('teste@a.com', 'token123')).toEqual({ id: 1, email: 'teste@a.com' });

      mockQuery.mockResolvedValueOnce([]);
      expect(await userModel.findByResetToken('teste@a.com', 'invalido')).toBeNull();
    });

    it('updatePhoto deve atualizar foto', async () => {
      mockQuery.mockResolvedValueOnce({ affectedRows: 1 });
      expect(await userModel.updatePhoto(1, 'http://foto.png')).toBe(true);
    });

    it('findPasswordById deve retornar id, email e senha', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1, email: 'a@a.com', senha: 'hash' }]);
      expect(await userModel.findPasswordById(1)).toEqual({ id: 1, email: 'a@a.com', senha: 'hash' });

      mockQuery.mockResolvedValueOnce([]);
      expect(await userModel.findPasswordById(99)).toBeNull();
    });
  });

  describe('classModel', () => {
    it('getClasses deve retornar lista de turmas', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1, nome: 'Turma A' }]);
      expect(await classModel.getClasses()).toEqual([{ id: 1, nome: 'Turma A' }]);
    });

    it('findById deve retornar turma ou null', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1, nome: 'Turma A' }]);
      expect(await classModel.findById(1)).toEqual({ id: 1, nome: 'Turma A' });

      mockQuery.mockResolvedValueOnce([]);
      expect(await classModel.findById(99)).toBeNull();
    });

    it('createClass deve inserir e retornar findById', async () => {
      mockQuery.mockResolvedValueOnce({ insertId: 5 });
      mockQuery.mockResolvedValueOnce([{ id: 5, nome: 'Turma B' }]);

      expect(await classModel.createClass({ nome: 'Turma B' })).toEqual({ id: 5, nome: 'Turma B' });
    });

    it('deleteById deve verificar se existe antes de deletar', async () => {
      mockQuery.mockResolvedValueOnce([]); // findById null
      expect(await classModel.deleteById(99)).toBeNull();

      mockQuery.mockResolvedValueOnce([{ id: 2, nome: 'Turma C' }]); // findById ok
      mockQuery.mockResolvedValueOnce({ affectedRows: 1 }); // DELETE ok
      expect(await classModel.deleteById(2)).toEqual({ id: 2, nome: 'Turma C' });
    });

    it('updateClassById deve atualizar e retornar findById', async () => {
      mockQuery.mockResolvedValueOnce({ affectedRows: 1 });
      mockQuery.mockResolvedValueOnce([{ id: 2, nome: 'Turma C2', status: 'inativa' }]);

      const res = await classModel.updateClassById(2, { nome: 'Turma C2', status: 'inativa' });
      expect(res).toEqual({ id: 2, nome: 'Turma C2', status: 'inativa' });
    });
  });

  describe('postModel', () => {
    it('createPost deve criar e retornar findById', async () => {
      mockQuery.mockResolvedValueOnce({ insertId: 10 });
      mockQuery.mockResolvedValueOnce([{ id: 10, titulo: 'Aviso 1' }]);

      const res = await postModel.createPost({ titulo: 'Aviso 1', conteudo: 'Texto', autor_id: 1 });
      expect(res).toEqual({ id: 10, titulo: 'Aviso 1' });
    });

    it('findAll deve filtrar por forUserId quando informado', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1 }]);
      await postModel.findAll({ forUserId: 5 });
      const sqlCalled = mockQuery.mock.calls[0][0];
      expect(sqlCalled).toContain('destinatario_id IS NULL OR p.destinatario_id = ?');

      mockQuery.mockResolvedValueOnce([{ id: 2 }]);
      await postModel.findAll();
      const sqlAll = mockQuery.mock.calls[1][0];
      expect(sqlAll).not.toContain('p.destinatario_id = ?');
    });

    it('findById deve retornar post ou null', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1, titulo: 'Aviso' }]);
      expect(await postModel.findById(1)).toEqual({ id: 1, titulo: 'Aviso' });

      mockQuery.mockResolvedValueOnce([]);
      expect(await postModel.findById(99)).toBeNull();
    });

    it('updatePost deve lidar com destinatario_id definido ou indefinido', async () => {
      mockQuery.mockResolvedValueOnce({ affectedRows: 1 });
      mockQuery.mockResolvedValueOnce([{ id: 1, titulo: 'T1' }]);
      await postModel.updatePost(1, { titulo: 'T1', conteudo: 'C1', destinatario_id: 2 });
      expect(mockQuery.mock.calls[0][0]).toContain('destinatario_id = ?');

      mockQuery.mockResolvedValueOnce({ affectedRows: 1 });
      mockQuery.mockResolvedValueOnce([{ id: 1, titulo: 'T2' }]);
      await postModel.updatePost(1, { titulo: 'T2', conteudo: 'C2' });
      expect(mockQuery.mock.calls[2][0]).not.toContain('destinatario_id = ?');
    });

    it('deletePost deve retornar boolean de affectedRows', async () => {
      mockQuery.mockResolvedValueOnce({ affectedRows: 1 });
      expect(await postModel.deletePost(1)).toBe(true);

      mockQuery.mockResolvedValueOnce({ affectedRows: 0 });
      expect(await postModel.deletePost(99)).toBe(false);
    });
  });

  describe('studentModel', () => {
    it('findAll deve listar alunos', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1, nome: 'Aluno' }]);
      expect(await studentModel.findAll()).toEqual([{ id: 1, nome: 'Aluno' }]);
    });

    it('findById deve buscar aluno por id', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1, nome: 'Aluno' }]);
      expect(await studentModel.findById(1)).toEqual({ id: 1, nome: 'Aluno' });

      mockQuery.mockResolvedValueOnce([]);
      expect(await studentModel.findById(99)).toBeNull();
    });

    it('findByParentId deve buscar alunos de um pai', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1, id_pai: 5 }]);
      expect(await studentModel.findByParentId(5)).toEqual([{ id: 1, id_pai: 5 }]);
    });

    it('findByTurmaId deve buscar alunos de uma turma', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1, turma_id: 3 }]);
      expect(await studentModel.findByTurmaId(3)).toEqual([{ id: 1, turma_id: 3 }]);
    });

    it('create deve inserir e retornar findById', async () => {
      mockQuery.mockResolvedValueOnce({ insertId: 10 });
      mockQuery.mockResolvedValueOnce([{ id: 10, matricula: 'M10' }]);

      const res = await studentModel.create({ matricula: 'M10', nome: 'Aluno 10', turma_id: 1 });
      expect(res).toEqual({ id: 10, matricula: 'M10' });
    });

    it('updateById deve atualizar e retornar findById', async () => {
      mockQuery.mockResolvedValueOnce({ affectedRows: 1 });
      mockQuery.mockResolvedValueOnce([{ id: 10, matricula: 'M10', nome: 'Nome Novo' }]);

      const res = await studentModel.updateById(10, {
        matricula: 'M10',
        nome: 'Nome Novo',
        turma_id: 1,
      });
      expect(res).toEqual({ id: 10, matricula: 'M10', nome: 'Nome Novo' });
    });

    it('deleteById deve retornar se deletou', async () => {
      mockQuery.mockResolvedValueOnce({ affectedRows: 1 });
      expect(await studentModel.deleteById(10)).toBe(true);
    });
  });

  describe('attendanceModel', () => {
    it('createAttendance deve inserir e retornar findById', async () => {
      mockQuery.mockResolvedValueOnce({ insertId: 20 });
      mockQuery.mockResolvedValueOnce([{ id: 20, presente: 1 }]);

      const res = await attendanceModel.createAttendance({
        aluno_id: 1,
        data: '2026-10-27',
        presente: true,
        registrado_por: 2,
      });
      expect(res).toEqual({ id: 20, presente: 1 });
    });

    it('findById, findByStudentId, findByDate devem buscar presenças', async () => {
      mockQuery.mockResolvedValueOnce([{ id: 1 }]);
      expect(await attendanceModel.findById(1)).toEqual({ id: 1 });

      mockQuery.mockResolvedValueOnce([]);
      expect(await attendanceModel.findById(99)).toBeNull();

      mockQuery.mockResolvedValueOnce([{ id: 2 }]);
      expect(await attendanceModel.findByStudentId(5)).toEqual([{ id: 2 }]);

      mockQuery.mockResolvedValueOnce([{ id: 3 }]);
      expect(await attendanceModel.findByDate('2026-10-27')).toEqual([{ id: 3 }]);
    });

    it('findByFilters deve aplicar filtros dinamicamente (data exata, intervalo, aluno, turma, presente)', async () => {
      // 1. Data exata
      mockQuery.mockResolvedValueOnce([]);
      await attendanceModel.findByFilters({ data: '2026-10-27' });
      expect(mockQuery.mock.calls[0][0]).toContain('AND p.data = ?');

      // 2. Data início e fim
      mockQuery.mockResolvedValueOnce([]);
      await attendanceModel.findByFilters({ data_inicio: '2026-10-01', data_fim: '2026-10-31' });
      expect(mockQuery.mock.calls[1][0]).toContain('AND p.data BETWEEN ? AND ?');

      // 3. Somente data início
      mockQuery.mockResolvedValueOnce([]);
      await attendanceModel.findByFilters({ data_inicio: '2026-10-01' });
      expect(mockQuery.mock.calls[2][0]).toContain('AND p.data >= ?');

      // 4. Somente data fim
      mockQuery.mockResolvedValueOnce([]);
      await attendanceModel.findByFilters({ data_fim: '2026-10-31' });
      expect(mockQuery.mock.calls[3][0]).toContain('AND p.data <= ?');

      // 5. Aluno, turma e presente boolean
      mockQuery.mockResolvedValueOnce([]);
      await attendanceModel.findByFilters({ aluno_id: 1, turma_id: 2, presente: 'true' });
      const sql5 = mockQuery.mock.calls[4][0];
      expect(sql5).toContain('AND p.aluno_id = ?');
      expect(sql5).toContain('AND a.turma_id = ?');
      expect(sql5).toContain('AND p.presente = ?');
    });

    it('updateAttendance deve atualizar presença e retornar findById', async () => {
      mockQuery.mockResolvedValueOnce({ affectedRows: 1 });
      mockQuery.mockResolvedValueOnce([{ id: 1, presente: 0 }]);

      const res = await attendanceModel.updateAttendance(1, { data: '2026-10-27', presente: false });
      expect(res).toEqual({ id: 1, presente: 0 });
    });

    it('deleteAttendance deve retornar boolean', async () => {
      mockQuery.mockResolvedValueOnce({ affectedRows: 1 });
      expect(await attendanceModel.deleteAttendance(1)).toBe(true);
    });
  });
});
