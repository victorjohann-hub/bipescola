import { query } from "../database/db.js";

const SELECT_POST = `
  SELECT
    p.id,
    p.titulo,
    p.conteudo,
    p.autor_id,
    u.nome AS autor_nome,
    p.destinatario_id,
    d.nome AS destinatario_nome,
    p.data_criacao,
    p.data_atualizacao
  FROM posts p
  INNER JOIN users u ON u.id = p.autor_id
  LEFT JOIN users d ON d.id = p.destinatario_id
`;

export async function createPost({ titulo, conteudo, autor_id, destinatario_id = null }) {
  const sql = `
    INSERT INTO posts
      (titulo, conteudo, autor_id, destinatario_id)
    VALUES (?, ?, ?, ?)
  `;

  const result = await query(sql, [
    titulo,
    conteudo,
    autor_id,
    destinatario_id
  ]);

  return await findById(result.insertId);
}

// Se forUserId for informado (perfil PARENT), retorna so avisos gerais
// (destinatario_id NULL) ou direcionados a esse usuario.
export async function findAll({ forUserId = null } = {}) {
  if (forUserId !== null) {
    return await query(
      `${SELECT_POST}
       WHERE p.destinatario_id IS NULL OR p.destinatario_id = ?
       ORDER BY p.data_criacao DESC`,
      [forUserId]
    );
  }

  return await query(`${SELECT_POST} ORDER BY p.data_criacao DESC`);
}

export async function findById(id) {
  const results = await query(`${SELECT_POST} WHERE p.id = ?`, [id]);

  return results.length > 0 ? results[0] : null;
}

// destinatario_id: undefined = mantem o atual; null = aviso geral; numero = direciona.
export async function updatePost(id, { titulo, conteudo, destinatario_id }) {
  const sets = ["titulo = ?", "conteudo = ?"];
  const params = [titulo, conteudo];

  if (destinatario_id !== undefined) {
    sets.push("destinatario_id = ?");
    params.push(destinatario_id);
  }

  sets.push("data_atualizacao = CURRENT_TIMESTAMP");
  params.push(id);

  await query(`UPDATE posts SET ${sets.join(", ")} WHERE id = ?`, params);

  return await findById(id);
}

export async function deletePost(id) {
  const sql = `
    DELETE FROM posts
    WHERE id = ?
  `;

  const result = await query(sql, [id]);

  return result.affectedRows > 0;
}
