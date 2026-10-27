import { jest } from '@jest/globals';
import { roleMiddleware } from '../../src/middlewares/roleMiddleware.js';

describe('roleMiddleware Unit Tests', () => {
  it('deve retornar 401 se req.user não existir', () => {
    const middleware = roleMiddleware('ADM', 'PROF');
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não autenticado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 403 se a role do usuário não for permitida', () => {
    const middleware = roleMiddleware('ADM');
    const req = { user: { id: 2, role: 'PARENT' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next() se a role do usuário estiver entre as permitidas', () => {
    const middleware = roleMiddleware('ADM', 'PROF', 'PORTEIRO');
    const req = { user: { id: 3, role: 'PORTEIRO' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
