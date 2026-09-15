import { query } from '../database/db.js';

export async function create({ name, email, password, role, firstLogin }) {
  const sql = 'INSERT INTO users (nome, email, senha, role, firstLogin, ativo) VALUES (?, ?, ?, ?, ?, ?)';
  const result = await query(sql, [name, email, password, role, firstLogin ? 1 : 0, 'sim']);

  return {
    id: result.insertId,
    name,
    email,
    role,
    firstLogin
  };
}

export async function findByEmail(email) {
  const sql = 'SELECT * FROM users WHERE email = ?';
  const results = await query(sql, [email]);
  return results.length > 0 ? results[0] : null;
}

export async function findById(id) {
  const sql = 'SELECT * FROM users WHERE id = ?';
  const results = await query(sql, [id]);
  return results.length > 0 ? results[0] : null;
}