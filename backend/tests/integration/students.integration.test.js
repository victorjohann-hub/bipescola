import { jest } from '@jest/globals';
import request from 'supertest';

const mockStudentService = {
  createStudent: jest.fn(),
  getStudents: jest.fn(),
  getStudentById: jest.fn(),
  getStudentsByParentId: jest.fn(),
  getStudentsByTurmaId: jest.fn(),
  updateStudent: jest.fn(),
  deleteStudent: jest.fn(),
};

jest.unstable_mockModule('../../src/services/studentService.js', () => mockStudentService);

const { default: app } = await import('../../app.js');

describe('Student Routes Integration Tests (/api/students)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/students', () => {
    it('deve retornar 400 se matricula, nome ou turma_id faltarem', async () => {
      const res = await request(app).post('/api/students').send({ matricula: 'M1' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('obrigatórios');
    });

    it('deve retornar 400 se turma_id ou id_pai não forem inteiros', async () => {
      const res1 = await request(app).post('/api/students').send({
        matricula: 'M1',
        nome: 'Aluno',
        turma_id: 'invalido',
      });
      expect(res1.status).toBe(400);

      const res2 = await request(app).post('/api/students').send({
        matricula: 'M1',
        nome: 'Aluno',
        turma_id: 1,
        id_pai: 'invalido',
      });
      expect(res2.status).toBe(400);
    });

    it('deve retornar 400 se o serviço falhar (ex: matrícula duplicada)', async () => {
      mockStudentService.createStudent.mockRejectedValueOnce(new Error('Matrícula já existe'));
      const res = await request(app).post('/api/students').send({
        matricula: 'M1',
        nome: 'Aluno',
        turma_id: 1,
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Matrícula já existe');
    });

    it('deve retornar 201 ao cadastrar com sucesso', async () => {
      mockStudentService.createStudent.mockResolvedValueOnce({
        id: 1,
        matricula: 'M100',
        nome: 'Carlos',
        turma_id: 1,
      });

      const res = await request(app).post('/api/students').send({
        matricula: 'M100',
        nome: 'Carlos',
        turma_id: 1,
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Aluno criado com sucesso');
      expect(res.body.data.id).toBe(1);
    });
  });

  describe('GET /api/students', () => {
    it('deve retornar 200 com a lista de alunos', async () => {
      mockStudentService.getStudents.mockResolvedValueOnce([{ id: 1, nome: 'Aluno' }]);
      const res = await request(app).get('/api/students');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it('deve retornar 500 se o serviço falhar', async () => {
      mockStudentService.getStudents.mockRejectedValueOnce(new Error('DB err'));
      const res = await request(app).get('/api/students');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/students/:id', () => {
    it('deve retornar 400 para ID inválido', async () => {
      const res = await request(app).get('/api/students/abc');
      expect(res.status).toBe(400);
    });

    it('deve retornar 404 se aluno não existir', async () => {
      mockStudentService.getStudentById.mockResolvedValueOnce(null);
      const res = await request(app).get('/api/students/999');
      expect(res.status).toBe(404);
    });

    it('deve retornar 200 com os dados do aluno', async () => {
      mockStudentService.getStudentById.mockResolvedValueOnce({ id: 1, nome: 'João' });
      const res = await request(app).get('/api/students/1');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(1);
    });
  });

  describe('GET /api/students/pai/:id e /turma/:id', () => {
    it('deve buscar alunos por responsável (pai)', async () => {
      mockStudentService.getStudentsByParentId.mockResolvedValueOnce([{ id: 1 }]);
      const res = await request(app).get('/api/students/pai/5');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);

      const resErr = await request(app).get('/api/students/pai/abc');
      expect(resErr.status).toBe(400);
    });

    it('deve buscar alunos por turma', async () => {
      mockStudentService.getStudentsByTurmaId.mockResolvedValueOnce([{ id: 2 }]);
      const res = await request(app).get('/api/students/turma/3');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);

      const resErr = await request(app).get('/api/students/turma/abc');
      expect(resErr.status).toBe(400);
    });
  });

  describe('PUT /api/students/:id', () => {
    it('deve validar ID e campos obrigatórios', async () => {
      const res1 = await request(app).put('/api/students/abc').send({});
      expect(res1.status).toBe(400);

      const res2 = await request(app).put('/api/students/1').send({ matricula: 'M1' });
      expect(res2.status).toBe(400);
    });

    it('deve retornar 404 se aluno não existir', async () => {
      mockStudentService.getStudentById.mockResolvedValueOnce(null);
      const res = await request(app).put('/api/students/99').send({
        matricula: 'M1',
        nome: 'Aluno',
        turma_id: 1,
      });
      expect(res.status).toBe(404);
    });

    it('deve retornar 200 ao atualizar aluno', async () => {
      mockStudentService.getStudentById.mockResolvedValueOnce({ id: 1 });
      mockStudentService.updateStudent.mockResolvedValueOnce({ id: 1, nome: 'Aluno Editado' });

      const res = await request(app).put('/api/students/1').send({
        matricula: 'M1',
        nome: 'Aluno Editado',
        turma_id: 1,
      });
      expect(res.status).toBe(200);
      expect(res.body.data.nome).toBe('Aluno Editado');
    });
  });

  describe('DELETE /api/students/:id', () => {
    it('deve retornar 400 para ID inválido', async () => {
      const res = await request(app).delete('/api/students/abc');
      expect(res.status).toBe(400);
    });

    it('deve retornar 404 se aluno não existir', async () => {
      mockStudentService.getStudentById.mockResolvedValueOnce(null);
      const res = await request(app).delete('/api/students/99');
      expect(res.status).toBe(404);
    });

    it('deve retornar 200 ao excluir aluno', async () => {
      mockStudentService.getStudentById.mockResolvedValueOnce({ id: 1 });
      mockStudentService.deleteStudent.mockResolvedValueOnce(true);

      const res = await request(app).delete('/api/students/1');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Aluno excluído com sucesso');
    });
  });
});
