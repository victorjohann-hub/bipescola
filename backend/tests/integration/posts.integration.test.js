import { jest } from '@jest/globals';
import request from 'supertest';
import { authHeader } from '../helpers/testUtils.js';

const mockPostService = {
  createPost: jest.fn(),
  getPosts: jest.fn(),
  getPostById: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

const mockUserModel = {
  findById: jest.fn(),
};

jest.unstable_mockModule('../../src/services/postService.js', () => mockPostService);
jest.unstable_mockModule('../../src/models/userModel.js', () => mockUserModel);

const { default: app } = await import('../../app.js');

describe('Post Routes Integration Tests (/api/posts)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/posts', () => {
    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).post('/api/posts').send({});
      expect(res.status).toBe(401);
    });

    it('deve retornar 403 se usuário for PARENT ou PORTEIRO', async () => {
      const headers = authHeader({ role: 'PARENT' });
      const res = await request(app).post('/api/posts').set(headers).send({
        titulo: 'Aviso',
        conteudo: 'Texto',
      });
      expect(res.status).toBe(403);
    });

    it('deve retornar 400 se titulo ou conteudo não forem informados', async () => {
      const headers = authHeader({ role: 'PROF' });
      const res = await request(app).post('/api/posts').set(headers).send({ titulo: 'Só titulo' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('obrigatórios');
    });

    it('deve retornar 400 se destinatario_id for inválido ou não for PARENT', async () => {
      const headers = authHeader({ role: 'PROF' });

      // ID não numérico
      const res1 = await request(app)
        .post('/api/posts')
        .set(headers)
        .send({ titulo: 'T', conteudo: 'C', destinatario_id: 'invalido' });
      expect(res1.status).toBe(400);
      expect(res1.body.error).toBe('destinatario_id inválido');

      // Usuário não encontrado ou não PARENT
      mockUserModel.findById.mockResolvedValueOnce({ id: 2, role: 'PROF' });
      const res2 = await request(app)
        .post('/api/posts')
        .set(headers)
        .send({ titulo: 'T', conteudo: 'C', destinatario_id: 2 });
      expect(res2.status).toBe(400);
      expect(res2.body.error).toContain('deve ser um responsável (PARENT)');
    });

    it('deve retornar 201 ao criar post geral (destinatario_id nulo/ausente/todos)', async () => {
      const headers = authHeader({ id: 1, role: 'ADM' });
      mockPostService.createPost.mockResolvedValueOnce({
        id: 1,
        titulo: 'Reunião',
        conteudo: 'Amanhã',
        autor_id: 1,
        destinatario_id: null,
      });

      const res = await request(app)
        .post('/api/posts')
        .set(headers)
        .send({ titulo: 'Reunião', conteudo: 'Amanhã', destinatario_id: 'todos' });

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBe(1);
    });

    it('deve retornar 201 ao criar post direcionado a um responsável', async () => {
      const headers = authHeader({ id: 1, role: 'PROF' });
      mockUserModel.findById.mockResolvedValueOnce({ id: 10, role: 'PARENT' });
      mockPostService.createPost.mockResolvedValueOnce({
        id: 2,
        titulo: 'Aviso Individual',
        conteudo: 'Atenção',
        autor_id: 1,
        destinatario_id: 10,
      });

      const res = await request(app)
        .post('/api/posts')
        .set(headers)
        .send({ titulo: 'Aviso Individual', conteudo: 'Atenção', destinatario_id: 10 });

      expect(res.status).toBe(201);
      expect(res.body.data.destinatario_id).toBe(10);
    });
  });

  describe('GET /api/posts', () => {
    it('deve filtrar posts para PARENT', async () => {
      const headers = authHeader({ id: 7, role: 'PARENT' });
      mockPostService.getPosts.mockResolvedValueOnce([{ id: 1, destinatario_id: 7 }]);

      const res = await request(app).get('/api/posts').set(headers);
      expect(res.status).toBe(200);
      expect(mockPostService.getPosts).toHaveBeenCalledWith({ forUserId: 7 });
    });

    it('deve retornar todos os posts para ADM/PROF', async () => {
      const headers = authHeader({ id: 1, role: 'ADM' });
      mockPostService.getPosts.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);

      const res = await request(app).get('/api/posts').set(headers);
      expect(res.status).toBe(200);
      expect(mockPostService.getPosts).toHaveBeenCalledWith({ forUserId: null });
    });

    it('deve retornar 500 se o serviço falhar', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockPostService.getPosts.mockRejectedValueOnce(new Error('DB err'));
      const res = await request(app).get('/api/posts').set(headers);
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/posts/:id', () => {
    it('deve retornar 400 se ID for inválido', async () => {
      const headers = authHeader({ role: 'ADM' });
      const res = await request(app).get('/api/posts/abc').set(headers);
      expect(res.status).toBe(400);
    });

    it('deve retornar 404 se post não existir', async () => {
      const headers = authHeader({ role: 'ADM' });
      mockPostService.getPostById.mockResolvedValueOnce(null);
      const res = await request(app).get('/api/posts/99').set(headers);
      expect(res.status).toBe(404);
    });

    it('deve retornar 404 se PARENT tentar ver post direcionado a outro usuário', async () => {
      const headers = authHeader({ id: 5, role: 'PARENT' });
      mockPostService.getPostById.mockResolvedValueOnce({ id: 10, destinatario_id: 8 });

      const res = await request(app).get('/api/posts/10').set(headers);
      expect(res.status).toBe(404);
    });

    it('deve retornar 200 quando PARENT visualiza post próprio ou geral', async () => {
      const headers = authHeader({ id: 5, role: 'PARENT' });
      mockPostService.getPostById.mockResolvedValueOnce({ id: 10, destinatario_id: 5 });

      const res = await request(app).get('/api/posts/10').set(headers);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(10);
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('deve retornar 403 se usuário tentar editar post de outro sem ser ADM', async () => {
      const headers = authHeader({ id: 2, role: 'PROF' });
      mockPostService.getPostById.mockResolvedValueOnce({ id: 1, autor_id: 5 });

      const res = await request(app)
        .put('/api/posts/1')
        .set(headers)
        .send({ titulo: 'Edit', conteudo: 'Text' });

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('Você não pode editar este post');
    });

    it('deve permitir que o próprio autor edite o post', async () => {
      const headers = authHeader({ id: 2, role: 'PROF' });
      mockPostService.getPostById.mockResolvedValueOnce({ id: 1, autor_id: 2 });
      mockPostService.updatePost.mockResolvedValueOnce({ id: 1, titulo: 'Editado', conteudo: 'Novo' });

      const res = await request(app)
        .put('/api/posts/1')
        .set(headers)
        .send({ titulo: 'Editado', conteudo: 'Novo' });

      expect(res.status).toBe(200);
      expect(res.body.data.titulo).toBe('Editado');
    });

    it('deve permitir que ADM edite post de qualquer autor', async () => {
      const headers = authHeader({ id: 1, role: 'ADM' });
      mockPostService.getPostById.mockResolvedValueOnce({ id: 1, autor_id: 9 });
      mockPostService.updatePost.mockResolvedValueOnce({ id: 1, titulo: 'Modificado por ADM', conteudo: 'Novo' });

      const res = await request(app)
        .put('/api/posts/1')
        .set(headers)
        .send({ titulo: 'Modificado por ADM', conteudo: 'Novo' });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('deve retornar 403 se tentar excluir post de outro sem ser ADM', async () => {
      const headers = authHeader({ id: 2, role: 'PROF' });
      mockPostService.getPostById.mockResolvedValueOnce({ id: 1, autor_id: 3 });

      const res = await request(app).delete('/api/posts/1').set(headers);
      expect(res.status).toBe(403);
      expect(res.body.error).toContain('Você não pode excluir este post');
    });

    it('deve permitir que o autor ou ADM exclua o post', async () => {
      const headers = authHeader({ id: 2, role: 'PROF' });
      mockPostService.getPostById.mockResolvedValueOnce({ id: 1, autor_id: 2 });
      mockPostService.deletePost.mockResolvedValueOnce(true);

      const res = await request(app).delete('/api/posts/1').set(headers);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Post excluído com sucesso');
    });
  });
});
