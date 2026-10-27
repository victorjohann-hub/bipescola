import jwt from 'jsonwebtoken';

export const TEST_JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

export function createToken(payload = {}, secret = TEST_JWT_SECRET) {
  const defaultPayload = {
    id: 1,
    role: 'ADM',
    ...payload,
  };
  return jwt.sign(defaultPayload, secret, { expiresIn: '1h' });
}

export function authHeader(payload = {}) {
  const token = createToken(payload);
  return { Authorization: `Bearer ${token}` };
}
