import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../../src/middlewares/authMiddleware.js';

describe('authMiddleware Unit Tests', () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret_key';
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  it('deve retornar 401 se nenhum cabeçalho authorization for enviado', () => {
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token não informado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 401 se o cabeçalho não iniciar com Bearer', () => {
    const req = { headers: { authorization: 'Basic 123456' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token não informado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 500 se JWT_SECRET não estiver configurado', () => {
    delete process.env.JWT_SECRET;

    const req = { headers: { authorization: 'Bearer valid.token.here' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'JWT_SECRET não configurado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 401 se o token for inválido', () => {
    const req = { headers: { authorization: 'Bearer invalid_token' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve anexar req.user e chamar next() com token válido', () => {
    const token = jwt.sign({ id: 10, role: 'PROF' }, 'test_secret_key');
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe(10);
    expect(req.user.role).toBe('PROF');
  });
});
