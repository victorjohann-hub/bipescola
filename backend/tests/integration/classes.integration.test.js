import { jest } from '@jest/globals';
import request from 'supertest';
import { authHeader } from '../helpers/testUtils.js';

const mockClassService = {
  createClass: jest.fn(),
  getClasses: jest.fn(),
  getClassById: jest.fn(),
  updateClassById: jest.fn(),
  deleteClassById: jest.fn(),
};

jest.unstable_mockModule('../../src/services/classService.js', () => mockClassService);

const { default: app } = await import('../../app.js');

describe('Class / Turmas Routes Integration Tests (/api/class, /api/classes, /api/turmas)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/class', () => {
    it('deve retornar 401 se não autenticado', async () => {
      const res = await request(app).post('/api/class').send({ nome: '1º Ano A' });
      expect(res.status).toBe(401);
    });

    it('deve retornar 403 se usuário não for ADM', async () => {
      const headers = authHeader({ role: 'PROF' });
      const res = await request(app).post('/api/class').set(headers).send({ nome: '1º Ano A' });
      expect(res.status).toBe(403);
    });

    it('deve retornar 400 se nome não for informado', async () => {
      const headers = authHeader({ role: 'ADM' });
      const res = await request(app).post('/api/class').set(headers).send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('nome da turma é obrigatório');
    });

    it('deve retornar 201 ao criar turma com sucesso', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockClassService.createClass.mockResolvedValueOnce({
        turma: { id: 1, nome: '1º Ano A' },
      });

      const res = await request(app).post('/api/class').set(headers).send({ nome: '1º Ano A' });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Turma criada');
      expect(res.body.data.id).toBe(1);
    });

    it('deve retornar 500 se o serviço falhar', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockClassService.createClass.mockRejectedValueOnce(new Error('Duplicate class'));
      const res = await request(app).post('/api/class').set(headers).send({ nome: '1º Ano A' });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Duplicate class');
    });
  });

  describe('GET /api/class e aliases', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).get('/api/class');
      expect(res.status).toBe(401);
    });

    it('deve retornar 403 se role for PARENT', async () => {
      const headers = authHeader({ role: 'PARENT' });
      const res = await request(app).get('/api/class').set(headers);
      expect(res.status).toBe(403);
    });

    it('deve permitir acesso para ADM, PROF e PORTEIRO', async () => {
      mockClassService.getClasses.mockResolvedValue([{ id: 1, nome: '1º Ano' }]);

      for (const role of ['ADM', 'PROF', 'PORTEIRO']) {
        const headers = authHeader({ role });
        const res = await request(app).get('/api/class').set(headers);
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
      }
    });

    it('deve funcionar através dos aliases /api/classes e /api/turmas', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockClassService.getClasses.mockResolvedValue([{ id: 1, nome: '1º Ano' }]);

      const res1 = await request(app).get('/api/classes').set(headers);
      expect(res1.status).toBe(200);

      const res2 = await request(app).get('/api/turmas').set(headers);
      expect(res2.status).toBe(200);
    });

    it('deve retornar 500 se ocorrer erro no serviço', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockClassService.getClasses.mockRejectedValueOnce(new Error('DB failure'));
      const res = await request(app).get('/api/class').set(headers);
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/class/:id', () => {
    it('deve retornar 400 para ID inválido', async () => {
      const headers = authHeader({ role: 'ADM' });
      const res = await request(app).get('/api/class/abc').set(headers);
      expect(res.status).toBe(400);
    });

    it('deve retornar 404 se turma não for encontrada', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockClassService.getClassById.mockResolvedValueOnce(null);
      const res = await request(app).get('/api/class/99').set(headers);
      expect(res.status).toBe(404);
      expect(res.body.message).toContain('Turma não encontrada');
    });

    it('deve retornar 200 com os dados da turma', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockClassService.getClassById.mockResolvedValueOnce({ id: 1, nome: '1º Ano' });
      const res = await request(app).get('/api/class/1').set(headers);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(1);
    });

    it('deve retornar 500 se ocorrer erro', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockClassService.getClassById.mockRejectedValueOnce(new Error('Crash'));
      const res = await request(app).get('/api/class/1').set(headers);
      expect(res.status).toBe(500);
    });
  });

  describe('PUT /api/class/:id', () => {
    it('deve retornar 403 se usuário não for ADM', async () => {
      const headers = authHeader({ role: 'PROF' });
      const res = await request(app).put('/api/class/1').set(headers).send({ nome: 'Novo' });
      expect(res.status).toBe(403);
    });

    it('deve retornar 400 se ID for inválido', async () => {
      const headers = authHeader({ role: 'ADM' });
      const res = await request(app).put('/api/class/abc').set(headers).send({ nome: 'Novo' });
      expect(res.status).toBe(400);
    });

    it('deve retornar 404 se turma não for encontrada', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockClassService.updateClassById.mockResolvedValueOnce(null);
      const res = await request(app).put('/api/class/99').set(headers).send({ nome: 'Novo' });
      expect(res.status).toBe(404);
    });

    it('deve retornar 200 com turma atualizada', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockClassService.updateClassById.mockResolvedValueOnce({ id: 1, nome: 'Turma Atualizada', status: 'ativa' });
      const res = await request(app).put('/api/class/1').set(headers).send({ nome: 'Turma Atualizada' });
      expect(res.status).toBe(200);
      expect(res.body.data.nome).toBe('Turma Atualizada');
    });

    it('deve retornar 500 se ocorrer falha', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockClassService.updateClassById.mockRejectedValueOnce(new Error('DB err'));
      const res = await request(app).put('/api/class/1').set(headers).send({ nome: 'Turma' });
      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /api/class/:id', () => {
    it('deve retornar 403 se usuário não for ADM', async () => {
      const headers = authHeader({ role: 'PROF' });
      const res = await request(app).delete('/api/class/1').set(headers);
      expect(res.status).toBe(403);
    });

    it('deve retornar 400 se ID for inválido', async () => {
      const headers = authHeader({ role: 'ADM' });
      const res = await request(app).delete('/api/class/abc').set(headers);
      expect(res.status).toBe(400);
    });

    it('deve retornar 404 se turma não existir', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockClassService.deleteClassById.mockResolvedValueOnce(null);
      const res = await request(app).delete('/api/class/99').set(headers);
      expect(res.status).toBe(404);
    });

    it('deve retornar 200 ao deletar com sucesso', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockClassService.deleteClassById.mockResolvedValueOnce({ id: 1, nome: '1º Ano' });
      const res = await request(app).delete('/api/class/1').set(headers);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Turma deletada');
    });

    it('deve retornar 500 se ocorrer erro', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockClassService.deleteClassById.mockRejectedValueOnce(new Error('FK constraint error'));
      const res = await request(app).delete('/api/class/1').set(headers);
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Erro ao deletar turma');
    });
  });
});
