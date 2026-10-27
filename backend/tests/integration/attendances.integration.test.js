import { jest } from '@jest/globals';
import request from 'supertest';
import { authHeader } from '../helpers/testUtils.js';

const mockAttendanceService = {
  markAttendance: jest.fn(),
  getAttendanceByStudent: jest.fn(),
  getAttendanceByDate: jest.fn(),
  getAttendanceById: jest.fn(),
  updateAttendance: jest.fn(),
  deleteAttendance: jest.fn(),
  getAttendanceHistory: jest.fn(),
};

jest.unstable_mockModule('../../src/services/attendanceService.js', () => mockAttendanceService);

const { default: app } = await import('../../app.js');

describe('Attendance Routes Integration Tests (/api/attendances)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/attendances', () => {
    it('deve retornar 401 se não autenticado', async () => {
      const res = await request(app).post('/api/attendances').send({});
      expect(res.status).toBe(401);
    });

    it('deve retornar 403 se o perfil for PARENT', async () => {
      const headers = authHeader({ role: 'PARENT' });
      const res = await request(app).post('/api/attendances').set(headers).send({
        aluno_id: 1,
        data: '2026-10-27',
        presente: true,
      });
      expect(res.status).toBe(403);
    });

    it('deve retornar 400 se aluno_id, data ou presente não forem enviados', async () => {
      const headers = authHeader({ role: 'PORTEIRO' });
      const res = await request(app).post('/api/attendances').set(headers).send({
        aluno_id: 1,
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('obrigatórios');
    });

    it('deve retornar 409 se a presença já estiver registrada (ER_DUP_ENTRY)', async () => {
      const headers = authHeader({ role: 'PROF' });
      const dupError = new Error('Duplicate');
      dupError.code = 'ER_DUP_ENTRY';
      mockAttendanceService.markAttendance.mockRejectedValueOnce(dupError);

      const res = await request(app).post('/api/attendances').set(headers).send({
        aluno_id: 1,
        data: '2026-10-27',
        presente: true,
      });
      expect(res.status).toBe(409);
      expect(res.body.error).toContain('já foi registrada');
    });

    it('deve retornar 201 ao registrar presença com sucesso', async () => {
      const headers = authHeader({ id: 2, role: 'PORTEIRO' });
      mockAttendanceService.markAttendance.mockResolvedValueOnce({
        id: 10,
        aluno_id: 1,
        data: '2026-10-27',
        presente: 1,
        registrado_por: 2,
      });

      const res = await request(app).post('/api/attendances').set(headers).send({
        aluno_id: 1,
        data: '2026-10-27',
        presente: true,
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toContain('Presença registrada com sucesso');
      expect(res.body.data.id).toBe(10);
    });

    it('deve retornar 500 para erro inesperado no serviço', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockAttendanceService.markAttendance.mockRejectedValueOnce(new Error('DB connection loss'));

      const res = await request(app).post('/api/attendances').set(headers).send({
        aluno_id: 1,
        data: '2026-10-27',
        presente: true,
      });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Erro ao registrar presença');
    });
  });

  describe('GET /api/attendances/historico', () => {
    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).get('/api/attendances/historico');
      expect(res.status).toBe(401);
    });

    it('deve retornar 403 se usuário for PARENT', async () => {
      const headers = authHeader({ role: 'PARENT' });
      const res = await request(app).get('/api/attendances/historico').set(headers);
      expect(res.status).toBe(403);
    });

    it('deve retornar 200 com resumo e registros para perfis autorizados', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockAttendanceService.getAttendanceHistory.mockResolvedValueOnce({
        resumo: {
          totalRegistros: 2,
          totalPresentes: 2,
          totalFaltas: 0,
          taxaComparecimento: '100%',
        },
        registros: [{ id: 1 }, { id: 2 }],
      });

      const res = await request(app)
        .get('/api/attendances/historico?data_inicio=2026-10-01&data_fim=2026-10-31')
        .set(headers);

      expect(res.status).toBe(200);
      expect(res.body.resumo.taxaComparecimento).toBe('100%');
    });

    it('deve retornar 500 se o serviço falhar', async () => {
      const headers = authHeader({ role: 'PROF' });
      mockAttendanceService.getAttendanceHistory.mockRejectedValueOnce(new Error('Crash'));

      const res = await request(app).get('/api/attendances/historico').set(headers);
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/attendances/aluno/:id e /data/:data', () => {
    it('deve retornar 400 para ID do aluno inválido', async () => {
      const headers = authHeader({ role: 'PARENT' });
      const res = await request(app).get('/api/attendances/aluno/abc').set(headers);
      expect(res.status).toBe(400);
    });

    it('deve retornar 200 com presenças do aluno', async () => {
      const headers = authHeader({ role: 'PARENT' });
      mockAttendanceService.getAttendanceByStudent.mockResolvedValueOnce([{ id: 1, presente: 1 }]);

      const res = await request(app).get('/api/attendances/aluno/1').set(headers);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('deve retornar 200 com presenças da data', async () => {
      const headers = authHeader({ role: 'PROF' });
      mockAttendanceService.getAttendanceByDate.mockResolvedValueOnce([{ id: 1, data: '2026-10-27' }]);

      const res = await request(app).get('/api/attendances/data/2026-10-27').set(headers);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('deve retornar 500 se o serviço de aluno ou data falhar', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockAttendanceService.getAttendanceByStudent.mockRejectedValueOnce(new Error('err'));
      const res1 = await request(app).get('/api/attendances/aluno/1').set(headers);
      expect(res1.status).toBe(500);

      mockAttendanceService.getAttendanceByDate.mockRejectedValueOnce(new Error('err'));
      const res2 = await request(app).get('/api/attendances/data/2026-10-27').set(headers);
      expect(res2.status).toBe(500);
    });
  });

  describe('GET /api/attendances/:id', () => {
    it('deve retornar 400 se ID for inválido', async () => {
      const headers = authHeader({ role: 'ADM' });
      const res = await request(app).get('/api/attendances/abc').set(headers);
      expect(res.status).toBe(400);
    });

    it('deve retornar 404 se presença não existir', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockAttendanceService.getAttendanceById.mockResolvedValueOnce(null);

      const res = await request(app).get('/api/attendances/999').set(headers);
      expect(res.status).toBe(404);
    });

    it('deve retornar 200 com os dados da presença', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockAttendanceService.getAttendanceById.mockResolvedValueOnce({ id: 1, presente: 1 });

      const res = await request(app).get('/api/attendances/1').set(headers);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
    });
  });

  describe('PUT /api/attendances/:id', () => {
    it('deve retornar 403 se usuário for PORTEIRO ou PARENT', async () => {
      const headers = authHeader({ role: 'PORTEIRO' });
      const res = await request(app).put('/api/attendances/1').set(headers).send({
        data: '2026-10-27',
        presente: true,
      });
      expect(res.status).toBe(403);
    });

    it('deve retornar 400 se faltar data ou presente', async () => {
      const headers = authHeader({ role: 'PROF' });
      const res = await request(app).put('/api/attendances/1').set(headers).send({ data: '2026-10-27' });
      expect(res.status).toBe(400);
    });

    it('deve retornar 404 se registro não for encontrado', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockAttendanceService.updateAttendance.mockResolvedValueOnce(null);

      const res = await request(app).put('/api/attendances/999').set(headers).send({
        data: '2026-10-27',
        presente: false,
      });
      expect(res.status).toBe(404);
    });

    it('deve retornar 200 ao atualizar presença com sucesso', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockAttendanceService.updateAttendance.mockResolvedValueOnce({ id: 1, presente: 0 });

      const res = await request(app).put('/api/attendances/1').set(headers).send({
        data: '2026-10-27',
        presente: false,
      });
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(1);
    });
  });

  describe('DELETE /api/attendances/:id', () => {
    it('deve retornar 403 se não for ADM', async () => {
      const headers = authHeader({ role: 'PROF' });
      const res = await request(app).delete('/api/attendances/1').set(headers);
      expect(res.status).toBe(403);
    });

    it('deve retornar 404 se registro não existir', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockAttendanceService.deleteAttendance.mockResolvedValueOnce(false);

      const res = await request(app).delete('/api/attendances/999').set(headers);
      expect(res.status).toBe(404);
    });

    it('deve retornar 200 ao excluir com sucesso', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockAttendanceService.deleteAttendance.mockResolvedValueOnce(true);

      const res = await request(app).delete('/api/attendances/1').set(headers);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Presença excluída com sucesso');
    });
  });
});
