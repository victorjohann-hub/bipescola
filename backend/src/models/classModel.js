/**
 * 
 * CREATE TABLE turmas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ativa', 'inativa') DEFAULT 'ativa',
    INDEX idx_nome (nome),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 */

import { query } from "../database/db.js";

export async function getClasses() {
  const sql = `
    SELECT
      id,
      nome,
      data_criacao,
      status
    FROM turmas
    ORDER BY id
  `;

  return await query(sql);
}

export async function findById(id) {
  const sql = `
    SELECT
      id,
      nome,
      data_criacao,
      status
    FROM turmas
    WHERE id = ?
  `;

  const results = await query(sql, [id]);

  return results.length > 0 ? results[0] : null;
}


export async function findByTurmaId(turmaId) {
  const sql = `
    SELECT
      id,
      nome,
      data_criacao,
      status
    FROM turma
    WHERE turma_id = ?
    ORDER BY id
  `;

  return await query(sql, [turmaId]);
}

export async function createClass({ nome }) {
  const sql = `
    INSERT INTO turmas (nome)
    VALUES (?)
  `;

  const result = await query(sql, [nome]);

  return await findById(result.insertId);
}


export async function deleteById(id) {
  const turma = await findById(id);

  if (!turma) {
    return null;
  }

  const sql = `
    DELETE FROM turmas
    WHERE id = ?
  `;

  const result = await query(sql, [id]);

  return result.affectedRows > 0 ? turma : null;
};

/* export async function updateClassById(id, nome {
  id,
  nome,
  data_criacao,
  status
}) {
  const sql = `
    UPDATE turmas
    SET
      id = ?,
      nome = ?,
      data_criacao = ?,
      status = ?
    WHERE id = ?
  `;

  await query(sql, [
    id,
    nome,
    data_criacao || null,
    status || "ativo"
  ]);

  return await findById(id);
}

export async function deleteById(id) {
  const sql = `
    DELETE FROM turmas
    WHERE id = ?
  `;

  const result = await query(sql, [id]);

  return result.affectedRows > 0;
}
 */