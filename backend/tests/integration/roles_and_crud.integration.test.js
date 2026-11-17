import { jest } from '@jest/globals';
import request from 'supertest';
import { authHeader } from '../helpers/testUtils.js';

const mockAdmService = {
  createAdm: jest.fn(),
  getAdms: jest.fn(),
  updateAdm: jest.fn(),
  deleteAdm: jest.fn(),
};

const mockProfessorService = {
  createProfessor: jest.fn(),
  getProfessors: jest.fn(),
  getProfessorById: jest.fn(),
  updateProfessor: jest.fn(),
  deleteProfessor: jest.fn(),
};

const mockParentService = {
  createParent: jest.fn(),
  getParents: jest.fn(),
  updateParent: jest.fn(),
  deleteParent: jest.fn(),
};

jest.unstable_mockModule('../../src/services/admService.js', () => mockAdmService);
jest.unstable_mockModule('../../src/services/professorService.js', () => mockProfessorService);
jest.unstable_mockModule('../../src/services/parentService.js', () => mockParentService);

const { default: app } = await import('../../app.js');

describe('Roles CRUD Integration Tests (/api/adms, /api/professors, /api/parents, global errors)', () => {
  const admHeaders = authHeader({ id: 1, role: 'ADM' });
  const profHeaders = authHeader({ id: 2, role: 'PROF' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ADMs (/api/adms)', () => {
    it('POST /api/adms deve validar permissão, campos e criar ADM', async () => {
      const resNoAuth = await request(app).post('/api/adms').send({});
      expect(resNoAuth.status).toBe(401);

      const resBad = await request(app).post('/api/adms').set(admHeaders).send({});
      expect(resBad.status).toBe(400);

      mockAdmService.createAdm.mockRejectedValueOnce(new Error('Email duplicado'));
      const resErr = await request(app).post('/api/adms').set(admHeaders).send({ nome: 'Adm', email: 'adm@escola.com' });
      expect(resErr.status).toBe(400);

      mockAdmService.createAdm.mockResolvedValueOnce({
        user: { id: 1, nome: 'Adm', email: 'adm@escola.com', role: 'ADM' },
        tempPassword: 'pass',
      });
      const resOk = await request(app).post('/api/adms').set(admHeaders).send({ nome: 'Adm', email: 'adm@escola.com' });
      expect(resOk.status).toBe(201);
      expect(resOk.body.data.role).toBe('ADM');
    });

    it('GET /api/adms e GET /api/adms/:id', async () => {
      mockAdmService.getAdms.mockResolvedValue([{ id: 1, nome: 'Adm' }]);

      const resList = await request(app).get('/api/adms').set(admHeaders);
      expect(resList.status).toBe(200);

      const resBadId = await request(app).get('/api/adms/abc').set(admHeaders);
      expect(resBadId.status).toBe(400);

      const resNotFound = await request(app).get('/api/adms/999').set(admHeaders);
      expect(resNotFound.status).toBe(404);

      const resFound = await request(app).get('/api/adms/1').set(admHeaders);
      expect(resFound.status).toBe(200);
      expect(resFound.body.data.id).toBe(1);

      mockAdmService.getAdms.mockRejectedValueOnce(new Error('DB err'));
      const resErr = await request(app).get('/api/adms').set(admHeaders);
      expect(resErr.status).toBe(500);

      mockAdmService.getAdms.mockRejectedValueOnce(new Error('DB err'));
      const resErrId = await request(app).get('/api/adms/1').set(admHeaders);
      expect(resErrId.status).toBe(500);
    });

    it('PUT /api/adms/:id valida ID, campos, existência e atualiza', async () => {
      const resBadId = await request(app).put('/api/adms/abc').set(admHeaders).send({ nome: 'A', email: 'a@a.com' });
      expect(resBadId.status).toBe(400);

      const resMissing = await request(app).put('/api/adms/1').set(admHeaders).send({ nome: '' });
      expect(resMissing.status).toBe(400);

      mockAdmService.getAdms.mockResolvedValue([{ id: 1, nome: 'Adm' }]);
      const resNotFound = await request(app).put('/api/adms/99').set(admHeaders).send({ nome: 'A', email: 'a@a.com' });
      expect(resNotFound.status).toBe(404);

      mockAdmService.getAdms.mockResolvedValue([{ id: 1, nome: 'Adm' }]);
      mockAdmService.updateAdm.mockResolvedValueOnce({ id: 1, nome: 'Adm Novo', email: 'adm@novo.com' });
      const resOk = await request(app).put('/api/adms/1').set(admHeaders).send({ nome: 'Adm Novo', email: 'adm@novo.com' });
      expect(resOk.status).toBe(200);
      expect(resOk.body.data.nome).toBe('Adm Novo');

      mockAdmService.getAdms.mockRejectedValueOnce(new Error('Err'));
      const resErr = await request(app).put('/api/adms/1').set(admHeaders).send({ nome: 'A', email: 'a@a.com' });
      expect(resErr.status).toBe(500);
    });

    it('DELETE /api/adms/:id valida ID, permissão, existência e remove', async () => {
      const resNoAuth = await request(app).delete('/api/adms/2');
      expect(resNoAuth.status).toBe(401);

      const resForbidden = await request(app).delete('/api/adms/2').set(profHeaders);
      expect(resForbidden.status).toBe(403);

      const resBadId = await request(app).delete('/api/adms/abc').set(admHeaders);
      expect(resBadId.status).toBe(400);

      mockAdmService.getAdms.mockResolvedValue([{ id: 1 }]);
      const resNotFound = await request(app).delete('/api/adms/99').set(admHeaders);
      expect(resNotFound.status).toBe(404);

      mockAdmService.getAdms.mockResolvedValue([{ id: 2, nome: 'Adm 2' }]);
      mockAdmService.deleteAdm.mockResolvedValueOnce(false);
      const resFailDelete = await request(app).delete('/api/adms/2').set(admHeaders);
      expect(resFailDelete.status).toBe(404);

      mockAdmService.getAdms.mockResolvedValue([{ id: 2, nome: 'Adm 2' }]);
      mockAdmService.deleteAdm.mockResolvedValueOnce(true);
      const resOk = await request(app).delete('/api/adms/2').set(admHeaders);
      expect(resOk.status).toBe(200);
      expect(resOk.body.message).toContain('excluído');

      mockAdmService.getAdms.mockRejectedValueOnce(new Error('Err'));
      const resErr = await request(app).delete('/api/adms/2').set(admHeaders);
      expect(resErr.status).toBe(500);
    });
  });

  describe('Professors (/api/professors)', () => {
    it('POST /api/professors deve validar e criar professor', async () => {
      const resBad = await request(app).post('/api/professors').set(admHeaders).send({});
      expect(resBad.status).toBe(400);

      mockProfessorService.createProfessor.mockRejectedValueOnce(new Error('Email duplicado'));
      const resErr = await request(app).post('/api/professors').set(admHeaders).send({ nome: 'Prof', email: 'p@p.com' });
      expect(resErr.status).toBe(400);

      mockProfessorService.createProfessor.mockResolvedValueOnce({
        user: { id: 3, nome: 'Prof', email: 'prof@escola.com', role: 'PROF' },
        tempPassword: 'pass',
      });
      const resOk = await request(app).post('/api/professors').set(admHeaders).send({ nome: 'Prof', email: 'prof@escola.com' });
      expect(resOk.status).toBe(201);
      expect(resOk.body.data.role).toBe('PROF');
    });

    it('GET /api/professors e GET /api/professors/:id', async () => {
      mockProfessorService.getProfessors.mockResolvedValue([{ id: 3, nome: 'Prof' }]);
      const resList = await request(app).get('/api/professors').set(admHeaders);
      expect(resList.status).toBe(200);

      const resBadId = await request(app).get('/api/professors/abc').set(admHeaders);
      expect(resBadId.status).toBe(400);

      mockProfessorService.getProfessorById.mockResolvedValueOnce(null);
      const resNotFound = await request(app).get('/api/professors/99').set(admHeaders);
      expect(resNotFound.status).toBe(404);

      mockProfessorService.getProfessorById.mockResolvedValueOnce({ id: 3, nome: 'Prof' });
      const resFound = await request(app).get('/api/professors/3').set(admHeaders);
      expect(resFound.status).toBe(200);
      expect(resFound.body.data.id).toBe(3);

      mockProfessorService.getProfessors.mockRejectedValueOnce(new Error('Err'));
      expect((await request(app).get('/api/professors').set(admHeaders)).status).toBe(500);

      mockProfessorService.getProfessorById.mockRejectedValueOnce(new Error('Err'));
      expect((await request(app).get('/api/professors/3').set(admHeaders)).status).toBe(500);
    });

    it('PUT /api/professors/:id e DELETE /api/professors/:id', async () => {
      const resBadId = await request(app).put('/api/professors/abc').set(admHeaders).send({ nome: 'A', email: 'a@a.com' });
      expect(resBadId.status).toBe(400);

      const resMissing = await request(app).put('/api/professors/3').set(admHeaders).send({});
      expect(resMissing.status).toBe(400);

      mockProfessorService.getProfessorById.mockResolvedValueOnce(null);
      const resNotFound = await request(app).put('/api/professors/99').set(admHeaders).send({ nome: 'A', email: 'a@a.com' });
      expect(resNotFound.status).toBe(404);

      mockProfessorService.getProfessorById.mockResolvedValue({ id: 3 });
      mockProfessorService.updateProfessor.mockResolvedValueOnce({ id: 3, nome: 'Prof Edit' });
      const resPut = await request(app).put('/api/professors/3').set(admHeaders).send({ nome: 'Prof Edit', email: 'p@p.com' });
      expect(resPut.status).toBe(200);

      mockProfessorService.getProfessorById.mockRejectedValueOnce(new Error('Err'));
      expect((await request(app).put('/api/professors/3').set(admHeaders).send({ nome: 'A', email: 'a@a.com' })).status).toBe(500);

      const resBadDelId = await request(app).delete('/api/professors/abc').set(admHeaders);
      expect(resBadDelId.status).toBe(400);

      mockProfessorService.getProfessorById.mockResolvedValueOnce(null);
      const resDelNotFound = await request(app).delete('/api/professors/99').set(admHeaders);
      expect(resDelNotFound.status).toBe(404);

      mockProfessorService.getProfessorById.mockResolvedValueOnce({ id: 3 });
      mockProfessorService.deleteProfessor.mockResolvedValueOnce(false);
      const resDelFail = await request(app).delete('/api/professors/3').set(admHeaders);
      expect(resDelFail.status).toBe(404);

      mockProfessorService.getProfessorById.mockResolvedValueOnce({ id: 3 });
      mockProfessorService.deleteProfessor.mockResolvedValueOnce(true);
      const resDel = await request(app).delete('/api/professors/3').set(admHeaders);
      expect(resDel.status).toBe(200);

      mockProfessorService.getProfessorById.mockRejectedValueOnce(new Error('Err'));
      expect((await request(app).delete('/api/professors/3').set(admHeaders)).status).toBe(500);
    });
  });

  describe('Parents (/api/parents)', () => {
    it('POST /api/parents deve validar e criar responsável', async () => {
      const resBad = await request(app).post('/api/parents').set(admHeaders).send({});
      expect(resBad.status).toBe(400);

      mockParentService.createParent.mockRejectedValueOnce(new Error('Err'));
      const resErr = await request(app).post('/api/parents').set(admHeaders).send({ nome: 'Pai', email: 'p@p.com' });
      expect(resErr.status).toBe(500);

      mockParentService.createParent.mockResolvedValueOnce({
        user: { id: 4, nome: 'Pai', email: 'pai@escola.com', role: 'PARENT' },
        tempPassword: 'pass',
      });
      const resOk = await request(app).post('/api/parents').set(admHeaders).send({ nome: 'Pai', email: 'pai@escola.com' });
      expect(resOk.status).toBe(201);
      expect(resOk.body.data.role).toBe('PARENT');
    });

    it('GET /api/parents deve listar responsáveis', async () => {
      mockParentService.getParents.mockResolvedValue([{ id: 4 }]);
      const res = await request(app).get('/api/parents').set(admHeaders);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);

      mockParentService.getParents.mockRejectedValueOnce(new Error('Err'));
      expect((await request(app).get('/api/parents').set(admHeaders)).status).toBe(500);
    });

    it('PUT /api/parents/:id deve atualizar responsável existente', async () => {
      const resBadId = await request(app).put('/api/parents/abc').set(admHeaders).send({ nome: 'P', email: 'p@p.com' });
      expect(resBadId.status).toBe(400);

      const resMissing = await request(app).put('/api/parents/4').set(admHeaders).send({});
      expect(resMissing.status).toBe(400);

      mockParentService.getParents.mockResolvedValue([{ id: 4 }]);
      const resNotFound = await request(app).put('/api/parents/99').set(admHeaders).send({ nome: 'P', email: 'p@p.com' });
      expect(resNotFound.status).toBe(404);

      mockParentService.getParents.mockResolvedValue([{ id: 4 }]);
      mockParentService.updateParent.mockResolvedValueOnce({ id: 4, nome: 'Pai Edit' });
      const res = await request(app).put('/api/parents/4').set(admHeaders).send({ nome: 'Pai Edit', email: 'pai@novo.com' });
      expect(res.status).toBe(200);
      expect(res.body.data.nome).toBe('Pai Edit');

      mockParentService.getParents.mockRejectedValueOnce(new Error('Err'));
      expect((await request(app).put('/api/parents/4').set(admHeaders).send({ nome: 'P', email: 'p@p.com' })).status).toBe(500);
    });

    it('DELETE /api/parents/:id exige ADM e remove', async () => {
      const resBadId = await request(app).delete('/api/parents/abc').set(admHeaders);
      expect(resBadId.status).toBe(400);

      mockParentService.getParents.mockResolvedValue([{ id: 4 }]);
      const resNotFound = await request(app).delete('/api/parents/99').set(admHeaders);
      expect(resNotFound.status).toBe(404);

      mockParentService.getParents.mockResolvedValue([{ id: 4 }]);
      mockParentService.deleteParent.mockResolvedValueOnce(false);
      const resFailDel = await request(app).delete('/api/parents/4').set(admHeaders);
      expect(resFailDel.status).toBe(404);

      mockParentService.getParents.mockResolvedValue([{ id: 4 }]);
      mockParentService.deleteParent.mockResolvedValueOnce(true);
      const res = await request(app).delete('/api/parents/4').set(admHeaders);
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('excluído com sucesso');

      mockParentService.getParents.mockRejectedValueOnce(new Error('Err'));
      expect((await request(app).delete('/api/parents/4').set(admHeaders)).status).toBe(500);
    });
  });

  describe('Global Error & 404 Handlers', () => {
    it('deve retornar 404 JSON para rota inexistente', async () => {
      const res = await request(app).get('/api/rota-completamente-inexistente');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Rota não encontrada' });
    });

    it('deve retornar 400 JSON se o JSON enviado for malformado', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send('{ "email": "malformed_json');
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });
});
