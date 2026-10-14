import { query } from '../database/db.js';

export async function create({ nome, email, senha, firstLogin }) {
  const sql = `
    INSERT INTO users
      (nome, email, senha, firstLogin, ativo)
    VALUES (?, ?, ?, ?, ?)
  `;

  const result = await query(sql, [
    nome,
    email,
    senha,
    firstLogin ? 1 : 0,
    'sim'
  ]);

  return await findById(result.insertId);
}

export async function findAll() {
  const sql = `
    SELECT
      id,
      nome,
      email,
      role,
      foto,
      firstLogin,
      aniversario,
      data_criacao,
      data_atualizacao,
      ativo
    FROM users
    ORDER BY id
  `;

  return await query(sql);
}

export async function findByEmail(email) {
  const sql = 'SELECT * FROM users WHERE email = ?';
  const results = await query(sql, [email]);

  return results.length > 0 ? results[0] : null;
}

export async function findById(id) {
  const sql = `
    SELECT
      id,
      nome,
      email,
      role,
      foto,
      firstLogin,
      aniversario,
      data_criacao,
      data_atualizacao,
      ativo
    FROM users
    WHERE id = ?
  `;

  const results = await query(sql, [id]);

  return results.length > 0 ? results[0] : null;
}

export async function findByRole(role) {
  const sql = `
    SELECT
      id,
      nome,
      email,
      role,
      foto,
      firstLogin,
      aniversario,
      data_criacao,
      data_atualizacao,
      ativo
    FROM users
    WHERE role = ?
    ORDER BY id
  `;

  return await query(sql, [role]);
}

export async function updateRoleById(id, role) {
  const sql = `
    UPDATE users
    SET
      role = ?,
      data_atualizacao = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  await query(sql, [role, id]);

  return await findById(id);
}

export async function updateById(id, { nome, email }) {
  const sql = `
    UPDATE users
    SET
      nome = ?,
      email = ?,
      data_atualizacao = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  await query(sql, [nome, email, id]);

  return await findById(id);
}

export async function deleteById(id) {
  const sql = `
    DELETE FROM users
    WHERE id = ?
  `;

  const result = await query(sql, [id]);

  return result.affectedRows > 0;
}

export async function updatePassword(id, senhaHash) {
  const sql = `
    UPDATE users
    SET senha = ?, firstLogin = 0,
        reset_token = NULL,
        reset_token_expires = NULL,
        data_atualizacao = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  const result = await query(sql, [senhaHash, id]);
  return result.affectedRows > 0;
}

export async function saveResetToken(id, token, expiresAt) {
  const sql = `
    UPDATE users
    SET reset_token = ?, reset_token_expires = ?
    WHERE id = ?
  `;

  const result = await query(sql, [token, expiresAt, id]);
  return result.affectedRows > 0;
}

export async function findByResetToken(email, token) {
  const sql = `
    SELECT id, email
    FROM users
    WHERE email = ?
      AND reset_token = ?
      AND reset_token_expires > NOW()
  `;

  const results = await query(sql, [email, token]);
  return results.length > 0 ? results[0] : null;
}

export async function updatePhoto(id, foto) {
  const sql = `
    UPDATE users
    SET foto = ?, data_atualizacao = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  const result = await query(sql, [foto, id]);
  return result.affectedRows > 0;
}

export async function findPasswordById(id) {
  const sql = 'SELECT id, email, senha FROM users WHERE id = ?';
  const results = await query(sql, [id]);
  return results.length > 0 ? results[0] : null;
}
