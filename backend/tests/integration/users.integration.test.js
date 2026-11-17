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
  const admHeaders = authHeader({ id: 1, role: 'ADM' });
  const profHeaders = authHeader({ id: 2, role: 'PROF' });
  const user1Headers = authHeader({ id: 1, role: 'PARENT' });

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
    it('deve retornar 401 sem token de autenticação', async () => {
      const res = await request(app).post('/api/users').send({ nome: 'João', email: 'joao@teste.com' });
      expect(res.status).toBe(401);
    });

    it('deve retornar 403 se usuário não for ADM', async () => {
      const res = await request(app).post('/api/users').set(profHeaders).send({ nome: 'João', email: 'joao@teste.com' });
      expect(res.status).toBe(403);
    });

    it('deve retornar 400 se nome ou email estiverem ausentes', async () => {
      const res = await request(app).post('/api/users').set(admHeaders).send({ nome: 'João' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'nome e email são obrigatórios');
    });

    it('deve retornar 400 se o service lançar erro (ex: duplicidade)', async () => {
      mockUserService.createUser.mockRejectedValueOnce(new Error('Email já cadastrado'));
      const res = await request(app)
        .post('/api/users')
        .set(admHeaders)
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
        .set(admHeaders)
        .send({ nome: 'João', email: 'joao@teste.com' });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Conta criada');
      expect(res.body.data.id).toBe(2);
      expect(res.body.tempPassword).toBe('tempPassword123');
    });
  });

  describe('GET /api/users', () => {
    it('deve retornar 401 sem token de autenticação', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(401);
    });

    it('deve retornar 403 se usuário não for ADM', async () => {
      const res = await request(app).get('/api/users').set(profHeaders);
      expect(res.status).toBe(403);
    });

    it('deve retornar 200 e lista de usuários para ADM', async () => {
      mockUserService.getUsers.mockResolvedValueOnce([{ id: 1, nome: 'Admin' }]);
      const res = await request(app).get('/api/users').set(admHeaders);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it('deve retornar 500 se o serviço falhar', async () => {
      mockUserService.getUsers.mockRejectedValueOnce(new Error('DB failure'));
      const res = await request(app).get('/api/users').set(admHeaders);
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Não foi possível listar os usuários');
    });
  });

  describe('GET /api/users/:id', () => {
    it('deve retornar 401 sem token de autenticação', async () => {
      const res = await request(app).get('/api/users/1');
      expect(res.status).toBe(401);
    });

    it('deve retornar 400 para ID inválido', async () => {
      const res = await request(app).get('/api/users/abc').set(admHeaders);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('ID do usuário inválido');
    });

    it('deve retornar 404 se o usuário não for encontrado', async () => {
      mockUserService.getUserById.mockResolvedValueOnce(null);
      const res = await request(app).get('/api/users/999').set(admHeaders);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Usuário não encontrado');
    });

    it('deve retornar 403 se usuário comum tentar ver perfil de outro usuário', async () => {
      const res = await request(app).get('/api/users/99').set(user1Headers);
      expect(res.status).toBe(403);
    });

    it('deve retornar 200 com os dados do usuário para o próprio usuário ou ADM', async () => {
      mockUserService.getUserById.mockResolvedValueOnce({ id: 1, nome: 'Admin' });
      const res = await request(app).get('/api/users/1').set(admHeaders);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(1);
    });

    it('deve retornar 500 se ocorrer erro interno', async () => {
      mockUserService.getUserById.mockRejectedValueOnce(new Error('Crash'));
      const res = await request(app).get('/api/users/1').set(admHeaders);
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Não foi possível buscar o usuário');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('deve retornar 401 sem token de autenticação', async () => {
      const res = await request(app).put('/api/users/1').send({ nome: 'A', email: 'a@a.com' });
      expect(res.status).toBe(401);
    });

    it('deve retornar 400 para ID inválido', async () => {
      const res = await request(app).put('/api/users/xyz').set(admHeaders).send({ nome: 'A', email: 'a@a.com' });
      expect(res.status).toBe(400);
    });

    it('deve retornar 400 se nome ou email estiverem vazios', async () => {
      const res = await request(app).put('/api/users/1').set(admHeaders).send({ nome: '' });
      expect(res.status).toBe(400);
    });

    it('deve retornar 404 se o usuário não existir', async () => {
      mockUserService.getUserById.mockResolvedValueOnce(null);
      const res = await request(app).put('/api/users/999').set(admHeaders).send({ nome: 'A', email: 'a@a.com' });
      expect(res.status).toBe(404);
    });

    it('deve retornar 200 ao atualizar com sucesso', async () => {
      mockUserService.getUserById.mockResolvedValueOnce({ id: 1 });
      mockUserService.updateUser.mockResolvedValueOnce({ id: 1, nome: 'Novo Nome', email: 'novo@a.com' });

      const res = await request(app).put('/api/users/1').set(admHeaders).send({ nome: 'Novo Nome', email: 'novo@a.com' });
      expect(res.status).toBe(200);
      expect(res.body.data.nome).toBe('Novo Nome');
    });

    it('deve retornar 500 se ocorrer erro', async () => {
      mockUserService.getUserById.mockRejectedValueOnce(new Error('DB err'));
      const res = await request(app).put('/api/users/1').set(admHeaders).send({ nome: 'N', email: 'n@n.com' });
      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).delete('/api/users/2');
      expect(res.status).toBe(401);
    });

    it('deve retornar 403 se usuário não for ADM', async () => {
      const res = await request(app).delete('/api/users/2').set(profHeaders);
      expect(res.status).toBe(403);
    });

    it('deve retornar 403 se o ADM tentar deletar sua própria conta', async () => {
      const res = await request(app).delete('/api/users/1').set(admHeaders);
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('ADM não pode excluir a própria conta');
    });

    it('deve retornar 404 se o usuário a deletar não existir', async () => {
      mockUserService.getUserById.mockResolvedValueOnce(null);
      const res = await request(app).delete('/api/users/99').set(admHeaders);
      expect(res.status).toBe(404);
    });

    it('deve retornar 200 ao excluir com sucesso', async () => {
      mockUserService.getUserById.mockResolvedValueOnce({ id: 2 });
      mockUserService.deleteUser.mockResolvedValueOnce(true);

      const res = await request(app).delete('/api/users/2').set(admHeaders);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Usuário excluído com sucesso');
    });

    it('deve retornar 500 se o serviço falhar', async () => {
      mockUserService.getUserById.mockResolvedValueOnce({ id: 2 });
      mockUserService.deleteUser.mockRejectedValueOnce(new Error('Crash'));

      const res = await request(app).delete('/api/users/2').set(admHeaders);
      expect(res.status).toBe(500);
    });
  });

  describe('PUT /api/users/change-password', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app).put('/api/users/change-password').send({});
      expect(res.status).toBe(401);
    });

    it('deve retornar 400 se campos faltarem', async () => {
      const res = await request(app).put('/api/users/change-password').set(admHeaders).send({});
      expect(res.status).toBe(400);
    });

    it('deve retornar 400 se nova senha tiver menos de 8 caracteres', async () => {
      const res = await request(app)
        .put('/api/users/change-password')
        .set(admHeaders)
        .send({ senhaAtual: '12345678', novaSenha: '123' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('8 caracteres');
    });

    it('deve retornar 400 se senha atual estiver incorreta', async () => {
      mockUserService.changePassword.mockRejectedValueOnce(new Error('Senha atual incorreta'));
      const res = await request(app)
        .put('/api/users/change-password')
        .set(admHeaders)
        .send({ senhaAtual: 'errada123', novaSenha: 'novasenha123' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Senha atual incorreta');
    });

    it('deve retornar 200 ao alterar a senha com sucesso', async () => {
      mockUserService.changePassword.mockResolvedValueOnce(true);
      const res = await request(app)
        .put('/api/users/change-password')
        .set(admHeaders)
        .send({ senhaAtual: 'certa123', novaSenha: 'novasenha123' });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Senha alterada com sucesso');
    });
  });

  describe('POST /api/users/forgot-password e reset-password', () => {
    it('forgot-password deve validar email', async () => {
      const resBad = await request(app).post('/api/users/forgot-password').send({});
      expect(resBad.status).toBe(400);

      mockUserService.forgotPassword.mockResolvedValueOnce(true);
      const resOk = await request(app).post('/api/users/forgot-password').send({ email: 'user@teste.com' });
      expect(resOk.status).toBe(200);

      mockUserService.forgotPassword.mockRejectedValueOnce(new Error('SMTP err'));
      const resErr = await request(app).post('/api/users/forgot-password').send({ email: 'user@teste.com' });
      expect(resErr.status).toBe(500);
    });

    it('reset-password deve validar campos e redefinir senha', async () => {
      const resBad = await request(app).post('/api/users/reset-password').send({});
      expect(resBad.status).toBe(400);

      const resShort = await request(app).post('/api/users/reset-password').send({
        email: 'u@u.com',
        token: 'tok',
        novaSenha: '123',
      });
      expect(resShort.status).toBe(400);

      mockUserService.resetPassword.mockRejectedValueOnce(new Error('Token inválido ou expirado'));
      const resInvalid = await request(app).post('/api/users/reset-password').send({
        email: 'u@u.com',
        token: 'tok',
        novaSenha: 'novasenha123',
      });
      expect(resInvalid.status).toBe(400);

      mockUserService.resetPassword.mockResolvedValueOnce(true);
      const resOk = await request(app).post('/api/users/reset-password').send({
        email: 'u@u.com',
        token: 'tok',
        novaSenha: 'novasenha123',
      });
      expect(resOk.status).toBe(200);
      expect(resOk.body.message).toBe('Senha redefinida com sucesso');
    });
  });

  describe('PUT /api/users/:id/photo', () => {
    it('deve validar token, ID, foto e permissão', async () => {
      const resNoAuth = await request(app).put('/api/users/1/photo').send({ foto: 'url' });
      expect(resNoAuth.status).toBe(401);

      const resBadId = await request(app).put('/api/users/abc/photo').set(admHeaders).send({ foto: 'url' });
      expect(resBadId.status).toBe(400);

      const resNoPhoto = await request(app).put('/api/users/1/photo').set(admHeaders).send({});
      expect(resNoPhoto.status).toBe(400);

      // Usuário tentando atualizar foto de outro sem ser ADM
      const resOtherUser = await request(app).put('/api/users/99/photo').set(user1Headers).send({ foto: 'url' });
      expect(resOtherUser.status).toBe(403);

      mockUserService.updateUserPhoto.mockResolvedValueOnce({ id: 1, foto: 'http://foto.png' });
      const resOk = await request(app).put('/api/users/1/photo').set(admHeaders).send({ foto: 'http://foto.png' });
      expect(resOk.status).toBe(200);
      expect(resOk.body.data.foto).toBe('http://foto.png');
    });
  });
});
