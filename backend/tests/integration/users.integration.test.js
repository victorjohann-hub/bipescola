import { jest } from '@jest/globals';
import request from 'supertest';
import { createToken, authHeader } from '../helpers/testUtils.js';

const mockUserService = {
  createUser: jest.fn(),
  loginUser: jest.fn(),
  getUsers: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  changePassword: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  updateUserPhoto: jest.fn(),
};

jest.unstable_mockModule('../../src/services/userService.js', () => mockUserService);

const { default: app } = await import('../../app.js');

describe('User Routes Integration Tests (/api/users)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users/login', () => {
    it('deve retornar 400 se email ou senha não forem fornecidos', async () => {
      const res = await request(app).post('/api/users/login').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'email e senha são obrigatórios');
    });

    it('deve retornar 401 se credenciais forem inválidas', async () => {
      mockUserService.loginUser.mockRejectedValueOnce(new Error('Email ou senha inválidos'));
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'errado@teste.com', senha: 'wrong' });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Email ou senha inválidos');
    });

    it('deve retornar 200 com token e dados do usuário se login for bem sucedido', async () => {
      mockUserService.loginUser.mockResolvedValueOnce({
        token: 'fake_jwt_token',
        user: { id: 1, nome: 'Admin', email: 'admin@teste.com', role: 'ADM' },
      });

      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'admin@teste.com', senha: '123' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBe('fake_jwt_token');
      expect(res.body.user.email).toBe('admin@teste.com');
    });
  });

  describe('POST /api/users', () => {
    it('deve retornar 400 se nome ou email estiverem ausentes', async () => {
      const res = await request(app).post('/api/users').send({ nome: 'João' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'nome e email são obrigatórios');
    });

    it('deve retornar 400 se o service lançar erro (ex: duplicidade)', async () => {
      mockUserService.createUser.mockRejectedValueOnce(new Error('Email já cadastrado'));
      const res = await request(app)
        .post('/api/users')
        .send({ nome: 'João', email: 'joao@teste.com' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Email já cadastrado');
    });

    it('deve retornar 201 com dados do usuário criado e senha temporária', async () => {
      mockUserService.createUser.mockResolvedValueOnce({
        user: { id: 2, nome: 'João', email: 'joao@teste.com', role: 'PARENT' },
        tempPassword: 'tempPassword123',
      });

      const res = await request(app)
        .post('/api/users')
        .send({ nome: 'João', email: 'joao@teste.com' });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Conta criada');
      expect(res.body.data.id).toBe(2);
      expect(res.body.tempPassword).toBe('tempPassword123');
    });
  });

  describe('GET /api/users', () => {
    it('deve retornar 200 e lista de usuários', async () => {
      mockUserService.getUsers.mockResolvedValueOnce([{ id: 1, nome: 'Admin' }]);
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it('deve retornar 500 se o serviço falhar', async () => {
      mockUserService.getUsers.mockRejectedValueOnce(new Error('DB failure'));
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Não foi possível listar os usuários');
    });
  });

  describe('GET /api/users/:id', () => {
    it('deve retornar 400 para ID inválido', async () => {
      const res = await request(app).get('/api/users/abc');
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('ID do usuário inválido');
    });

    it('deve retornar 404 se o usuário não for encontrado', async () => {
      mockUserService.getUserById.mockResolvedValueOnce(null);
      const res = await request(app).get('/api/users/999');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Usuário não encontrado');
    });

    it('deve retornar 200 com os dados do usuário', async () => {
      mockUserService.getUserById.mockResolvedValueOnce({ id: 1, nome: 'Admin' });
      const res = await request(app).get('/api/users/1');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(1);
    });

    it('deve retornar 500 se ocorrer erro interno', async () => {
      mockUserService.getUserById.mockRejectedValueOnce(new Error('Crash'));
      const res = await request(app).get('/api/users/1');
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Não foi possível buscar o usuário');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('deve retornar 400 para ID inválido', async () => {
      const res = await request(app).put('/api/users/xyz').send({ nome: 'A', email: 'a@a.com' });
      expect(res.status).toBe(400);
    });

    it('deve retornar 400 se nome ou email estiverem vazios', async () => {
      const res = await request(app).put('/api/users/1').send({ nome: '' });
      expect(res.status).toBe(400);
    });

    it('deve retornar 404 se o usuário não existir', async () => {
      mockUserService.getUserById.mockResolvedValueOnce(null);
      const res = await request(app).put('/api/users/999').send({ nome: 'A', email: 'a@a.com' });
      expect(res.status).toBe(404);
    });

    it('deve retornar 200 ao atualizar com sucesso', async () => {
      mockUserService.getUserById.mockResolvedValueOnce({ id: 1 });
      mockUserService.updateUser.mockResolvedValueOnce({ id: 1, nome: 'Novo Nome', email: 'novo@a.com' });

      const res = await request(app).put('/api/users/1').send({ nome: 'Novo Nome', email: 'novo@a.com' });
      expect(res.status).toBe(200);
      expect(res.body.data.nome).toBe('Novo Nome');
    });

    it('deve retornar 500 se ocorrer erro', async () => {
      mockUserService.getUserById.mockRejectedValueOnce(new Error('DB err'));
      const res = await request(app).put('/api/users/1').send({ nome: 'N', email: 'n@n.com' });
      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).delete('/api/users/2');
      expect(res.status).toBe(401);
    });

    it('deve retornar 403 se usuário não for ADM', async () => {
      const headers = authHeader({ id: 3, role: 'PROF' });
      const res = await request(app).delete('/api/users/2').set(headers);
      expect(res.status).toBe(403);
    });

    it('deve retornar 403 se o ADM tentar deletar sua própria conta', async () => {
      const headers = authHeader({ id: 1, role: 'ADM' });
      const res = await request(app).delete('/api/users/1').set(headers);
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('ADM não pode excluir a própria conta');
    });

    it('deve retornar 404 se o usuário a deletar não existir', async () => {
      const headers = authHeader({ id: 1, role: 'ADM' });
      mockUserService.getUserById.mockResolvedValueOnce(null);

      const res = await request(app).delete('/api/users/99').set(headers);
      expect(res.status).toBe(404);
    });

    it('deve retornar 200 ao excluir com sucesso', async () => {
      const headers = authHeader({ id: 1, role: 'ADM' });
      mockUserService.getUserById.mockResolvedValueOnce({ id: 2 });
      mockUserService.deleteUser.mockResolvedValueOnce(true);

      const res = await request(app).delete('/api/users/2').set(headers);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Usuário excluído com sucesso');
    });

    it('deve retornar 500 se o serviço falhar', async () => {
      const headers = authHeader({ id: 1, role: 'ADM' });
      mockUserService.getUserById.mockRejectedValueOnce(new Error('Crash'));

      const res = await request(app).delete('/api/users/2').set(headers);
      expect(res.status).toBe(500);
    });
  });

  describe('PUT /api/users/change-password', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).put('/api/users/change-password').send({});
      expect(res.status).toBe(401);
    });

    it('deve retornar 400 se faltar senhaAtual ou novaSenha', async () => {
      const headers = authHeader({ id: 1 });
      const res = await request(app)
        .put('/api/users/change-password')
        .set(headers)
        .send({ senhaAtual: '123' });
      expect(res.status).toBe(400);
    });

    it('deve retornar 400 se novaSenha tiver menos de 8 caracteres', async () => {
      const headers = authHeader({ id: 1 });
      const res = await request(app)
        .put('/api/users/change-password')
        .set(headers)
        .send({ senhaAtual: '12345678', novaSenha: 'curta' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('pelo menos 8 caracteres');
    });

    it('deve retornar 400 se a senha atual for incorreta', async () => {
      const headers = authHeader({ id: 1 });
      mockUserService.changePassword.mockRejectedValueOnce(new Error('Senha atual incorreta'));

      const res = await request(app)
        .put('/api/users/change-password')
        .set(headers)
        .send({ senhaAtual: 'errada123', novaSenha: 'novasenha123' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Senha atual incorreta');
    });

    it('deve retornar 200 com sucesso ao alterar senha', async () => {
      const headers = authHeader({ id: 1 });
      mockUserService.changePassword.mockResolvedValueOnce(true);

      const res = await request(app)
        .put('/api/users/change-password')
        .set(headers)
        .send({ senhaAtual: 'correta123', novaSenha: 'novasenha123' });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Senha alterada com sucesso');
    });
  });

  describe('POST /api/users/forgot-password e reset-password', () => {
    it('forgot-password deve retornar 400 se email não for enviado', async () => {
      const res = await request(app).post('/api/users/forgot-password').send({});
      expect(res.status).toBe(400);
    });

    it('forgot-password deve retornar 200 com mensagem informativa', async () => {
      mockUserService.forgotPassword.mockResolvedValueOnce(true);
      const res = await request(app)
        .post('/api/users/forgot-password')
        .send({ email: 'user@teste.com' });
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('instruções para redefinir a senha');
    });

    it('reset-password deve retornar 400 se faltar campos ou senha curta', async () => {
      const res1 = await request(app).post('/api/users/reset-password').send({});
      expect(res1.status).toBe(400);

      const res2 = await request(app).post('/api/users/reset-password').send({
        email: 'a@a.com',
        token: 'tok',
        novaSenha: '123',
      });
      expect(res2.status).toBe(400);
      expect(res2.body.error).toContain('pelo menos 8 caracteres');
    });

    it('reset-password deve retornar 400 se token for inválido', async () => {
      mockUserService.resetPassword.mockRejectedValueOnce(new Error('Token inválido ou expirado'));
      const res = await request(app).post('/api/users/reset-password').send({
        email: 'a@a.com',
        token: 'invalido',
        novaSenha: 'novasenha123',
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Token inválido ou expirado');
    });

    it('reset-password deve retornar 200 no sucesso', async () => {
      mockUserService.resetPassword.mockResolvedValueOnce(true);
      const res = await request(app).post('/api/users/reset-password').send({
        email: 'a@a.com',
        token: 'valido',
        novaSenha: 'novasenha123',
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Senha redefinida com sucesso');
    });
  });

  describe('PUT /api/users/:id/photo', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).put('/api/users/1/photo').send({ foto: 'data' });
      expect(res.status).toBe(401);
    });

    it('deve retornar 400 com ID inválido ou foto ausente', async () => {
      const headers = authHeader({ id: 1, role: 'ADM' });
      const res1 = await request(app).put('/api/users/abc/photo').set(headers).send({ foto: 'a' });
      expect(res1.status).toBe(400);

      const res2 = await request(app).put('/api/users/1/photo').set(headers).send({});
      expect(res2.status).toBe(400);
    });

    it('deve retornar 403 se usuário tentar atualizar foto de outro sem ser ADM', async () => {
      const headers = authHeader({ id: 5, role: 'PARENT' });
      const res = await request(app).put('/api/users/10/photo').set(headers).send({ foto: 'http' });
      expect(res.status).toBe(403);
      expect(res.body.error).toContain('Você só pode atualizar sua própria foto');
    });

    it('deve retornar 200 quando o próprio usuário atualiza a foto', async () => {
      const headers = authHeader({ id: 5, role: 'PARENT' });
      mockUserService.updateUserPhoto.mockResolvedValueOnce({ id: 5, foto: 'http://foto.png' });

      const res = await request(app)
        .put('/api/users/5/photo')
        .set(headers)
        .send({ foto: 'http://foto.png' });
      expect(res.status).toBe(200);
      expect(res.body.data.foto).toBe('http://foto.png');
    });
  });
});
