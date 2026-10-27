import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';

const mockUserModel = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findByRole: jest.fn(),
  updateRoleById: jest.fn(),
  updateById: jest.fn(),
  deleteById: jest.fn(),
  updatePassword: jest.fn(),
  saveResetToken: jest.fn(),
  findByResetToken: jest.fn(),
  updatePhoto: jest.fn(),
  findPasswordById: jest.fn(),
};

const mockSendMail = jest.fn();
const mockNodemailer = {
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail,
  })),
};

jest.unstable_mockModule('../../src/models/userModel.js', () => mockUserModel);
jest.unstable_mockModule('nodemailer', () => ({ default: mockNodemailer }));

const userService = await import('../../src/services/userService.js');

describe('userService Unit Tests', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, JWT_SECRET: 'test_jwt_secret', NODE_ENV: 'test' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('createUser', () => {
    it('deve gerar senha temporária com hash e cadastrar usuário', async () => {
      mockUserModel.create.mockResolvedValueOnce({
        id: 1,
        nome: 'João',
        email: 'joao@teste.com',
        role: 'PARENT',
      });

      const result = await userService.createUser({ nome: 'João', email: 'joao@teste.com' });

      expect(mockUserModel.create).toHaveBeenCalledTimes(1);
      const callArg = mockUserModel.create.mock.calls[0][0];
      expect(callArg.nome).toBe('João');
      expect(callArg.email).toBe('joao@teste.com');
      expect(callArg.firstLogin).toBe(true);
      expect(typeof result.tempPassword).toBe('string');
      expect(result.tempPassword.length).toBeGreaterThan(0);
      expect(result.user.id).toBe(1);
    });

    it('deve atualizar o papel se role for diferente de PARENT', async () => {
      mockUserModel.create.mockResolvedValueOnce({
        id: 2,
        nome: 'Porteiro',
        email: 'port@teste.com',
        role: 'PARENT',
      });
      mockUserModel.updateRoleById.mockResolvedValueOnce({
        id: 2,
        nome: 'Porteiro',
        email: 'port@teste.com',
        role: 'PORTEIRO',
      });

      const res = await userService.createUser({
        nome: 'Porteiro',
        email: 'port@teste.com',
        role: 'PORTEIRO',
      });

      expect(res.user.role).toBe('PORTEIRO');
      expect(mockUserModel.updateRoleById).toHaveBeenCalledWith(2, 'PORTEIRO');
    });
  });

  describe('loginUser', () => {
    it('deve falhar se o usuário não for encontrado', async () => {
      mockUserModel.findByEmail.mockResolvedValueOnce(null);

      await expect(
        userService.loginUser({ email: 'inexistente@teste.com', senha: '123' })
      ).rejects.toThrow('Email ou senha inválidos');
    });

    it('deve falhar se a senha estiver incorreta', async () => {
      const hash = await bcrypt.hash('senhaCorreta', 10);
      mockUserModel.findByEmail.mockResolvedValueOnce({
        id: 1,
        email: 'user@teste.com',
        senha: hash,
        role: 'ADM',
      });

      await expect(
        userService.loginUser({ email: 'user@teste.com', senha: 'senhaErrada' })
      ).rejects.toThrow('Email ou senha inválidos');
    });

    it('deve falhar se JWT_SECRET não estiver configurado', async () => {
      delete process.env.JWT_SECRET;
      const hash = await bcrypt.hash('minhasenha', 10);
      mockUserModel.findByEmail.mockResolvedValueOnce({
        id: 1,
        email: 'user@teste.com',
        senha: hash,
        role: 'ADM',
      });

      await expect(
        userService.loginUser({ email: 'user@teste.com', senha: 'minhasenha' })
      ).rejects.toThrow('JWT_SECRET não configurado');
    });

    it('deve retornar token e dados do usuário com credenciais válidas', async () => {
      const hash = await bcrypt.hash('minhasenha', 10);
      mockUserModel.findByEmail.mockResolvedValueOnce({
        id: 5,
        nome: 'Admin',
        email: 'admin@teste.com',
        senha: hash,
        role: 'ADM',
        foto: 'foto.jpg',
      });

      const result = await userService.loginUser({ email: 'admin@teste.com', senha: 'minhasenha' });

      expect(result.token).toBeDefined();
      expect(result.user).toEqual({
        id: 5,
        nome: 'Admin',
        email: 'admin@teste.com',
        role: 'ADM',
        foto: 'foto.jpg',
      });
    });
  });

  describe('getUsers, getUserById, updateUser, deleteUser', () => {
    it('deve chamar os respectivos métodos do userModel', async () => {
      mockUserModel.findAll.mockResolvedValueOnce([{ id: 1 }]);
      mockUserModel.findById.mockResolvedValueOnce({ id: 1 });
      mockUserModel.updateById.mockResolvedValueOnce({ id: 1, nome: 'Novo' });
      mockUserModel.deleteById.mockResolvedValueOnce(true);

      expect(await userService.getUsers()).toEqual([{ id: 1 }]);
      expect(await userService.getUserById(1)).toEqual({ id: 1 });
      expect(await userService.updateUser(1, { nome: 'Novo' })).toEqual({ id: 1, nome: 'Novo' });
      expect(await userService.deleteUser(1)).toBe(true);
    });
  });

  describe('changePassword', () => {
    it('deve falhar se o usuário não for encontrado', async () => {
      mockUserModel.findPasswordById.mockResolvedValueOnce(null);

      await expect(
        userService.changePassword(999, 'atual', 'novaSenhaLonga')
      ).rejects.toThrow('Usuário não encontrado');
    });

    it('deve falhar se a senha atual for incorreta', async () => {
      const hash = await bcrypt.hash('senhaReal', 10);
      mockUserModel.findPasswordById.mockResolvedValueOnce({
        id: 1,
        email: 'teste@teste.com',
        senha: hash,
      });

      await expect(
        userService.changePassword(1, 'senhaIncorreta', 'novaSenhaLonga')
      ).rejects.toThrow('Senha atual incorreta');
    });

    it('deve falhar se o updatePassword retornar false', async () => {
      const hash = await bcrypt.hash('senhaReal', 10);
      mockUserModel.findPasswordById.mockResolvedValueOnce({
        id: 1,
        email: 'teste@teste.com',
        senha: hash,
      });
      mockUserModel.updatePassword.mockResolvedValueOnce(false);

      await expect(
        userService.changePassword(1, 'senhaReal', 'novaSenhaLonga')
      ).rejects.toThrow('Não foi possível atualizar a senha');
    });

    it('deve trocar a senha com sucesso', async () => {
      const hash = await bcrypt.hash('senhaReal', 10);
      mockUserModel.findPasswordById.mockResolvedValueOnce({
        id: 1,
        email: 'teste@teste.com',
        senha: hash,
      });
      mockUserModel.updatePassword.mockResolvedValueOnce(true);

      const result = await userService.changePassword(1, 'senhaReal', 'novaSenhaLonga');
      expect(result).toBe(true);
      expect(mockUserModel.updatePassword).toHaveBeenCalledTimes(1);
    });
  });

  describe('forgotPassword', () => {
    it('deve retornar true sem erro se o email não existir', async () => {
      mockUserModel.findByEmail.mockResolvedValueOnce(null);

      const result = await userService.forgotPassword('inexistente@teste.com');
      expect(result).toBe(true);
      expect(mockUserModel.saveResetToken).not.toHaveBeenCalled();
    });

    it('deve logar token em desenvolvimento quando RESET_TOKEN_LOG for true', async () => {
      process.env.RESET_TOKEN_LOG = 'true';
      process.env.NODE_ENV = 'development';
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      mockUserModel.findByEmail.mockResolvedValueOnce({ id: 1, email: 'dev@teste.com' });
      mockUserModel.saveResetToken.mockResolvedValueOnce(true);

      const result = await userService.forgotPassword('dev@teste.com');
      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('deve lançar erro se configuração SMTP estiver incompleta', async () => {
      process.env.RESET_TOKEN_LOG = 'false';
      process.env.NODE_ENV = 'production';
      delete process.env.SMTP_HOST;

      mockUserModel.findByEmail.mockResolvedValueOnce({ id: 1, email: 'prod@teste.com' });
      mockUserModel.saveResetToken.mockResolvedValueOnce(true);

      await expect(userService.forgotPassword('prod@teste.com')).rejects.toThrow(
        'Configuração SMTP incompleta'
      );
    });

    it('deve enviar email via nodemailer quando SMTP configurado', async () => {
      process.env.RESET_TOKEN_LOG = 'false';
      process.env.NODE_ENV = 'production';
      process.env.SMTP_HOST = 'smtp.teste.com';
      process.env.SMTP_USER = 'user@teste.com';
      process.env.SMTP_PASS = 'secret';
      mockSendMail.mockResolvedValueOnce({ messageId: '123' });

      mockUserModel.findByEmail.mockResolvedValueOnce({ id: 1, email: 'prod@teste.com' });
      mockUserModel.saveResetToken.mockResolvedValueOnce(true);

      const result = await userService.forgotPassword('prod@teste.com');
      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetPassword', () => {
    it('deve falhar se token for inválido ou expirado', async () => {
      mockUserModel.findByResetToken.mockResolvedValueOnce(null);

      await expect(
        userService.resetPassword('email@teste.com', 'token_invalido', 'novasenha123')
      ).rejects.toThrow('Token inválido ou expirado');
    });

    it('deve falhar se a atualização da senha no banco falhar', async () => {
      mockUserModel.findByResetToken.mockResolvedValueOnce({ id: 10, email: 'email@teste.com' });
      mockUserModel.updatePassword.mockResolvedValueOnce(false);

      await expect(
        userService.resetPassword('email@teste.com', 'token_valido', 'novasenha123')
      ).rejects.toThrow('Não foi possível redefinir a senha');
    });

    it('deve redefinir a senha com sucesso', async () => {
      mockUserModel.findByResetToken.mockResolvedValueOnce({ id: 10, email: 'email@teste.com' });
      mockUserModel.updatePassword.mockResolvedValueOnce(true);

      const result = await userService.resetPassword('email@teste.com', 'token_valido', 'novasenha123');
      expect(result).toBe(true);
      expect(mockUserModel.updatePassword).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateUserPhoto', () => {
    it('deve falhar se foto não puder ser atualizada', async () => {
      mockUserModel.updatePhoto.mockResolvedValueOnce(false);

      await expect(
        userService.updateUserPhoto(1, 'http://foto.png')
      ).rejects.toThrow('Usuário não encontrado ou foto não atualizada');
    });

    it('deve atualizar e retornar o usuário atualizado', async () => {
      mockUserModel.updatePhoto.mockResolvedValueOnce(true);
      mockUserModel.findById.mockResolvedValueOnce({ id: 1, foto: 'http://foto.png' });

      const result = await userService.updateUserPhoto(1, 'http://foto.png');
      expect(result).toEqual({ id: 1, foto: 'http://foto.png' });
    });
  });
});
