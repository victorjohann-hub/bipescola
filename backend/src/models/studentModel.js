import { query } from "../database/db.js";

export async function findAll() {
  const sql = `
    SELECT
      a.id,
      a.matricula,
      a.nome,
      a.aniversario,
      a.turma_id,
      t.nome AS turma_nome,
      a.id_pai,
      a.faltas,
      a.data_criacao,
      a.data_atualizacao,
      a.status
    FROM alunos a
    LEFT JOIN turmas t ON t.id = a.turma_id
    ORDER BY a.nome ASC
  `;

  return await query(sql);
}

export async function findById(id) {
  const sql = `
    SELECT
      a.id,
      a.matricula,
      a.nome,
      a.aniversario,
      a.turma_id,
      t.nome AS turma_nome,
      a.id_pai,
      a.faltas,
      a.data_criacao,
      a.data_atualizacao,
      a.status
    FROM alunos a
    LEFT JOIN turmas t ON t.id = a.turma_id
    WHERE a.id = ?
  `;

  const results = await query(sql, [id]);

  return results.length > 0 ? results[0] : null;
}

export async function findByParentId(parentId) {
  const sql = `
    SELECT
      a.id,
      a.matricula,
      a.nome,
      a.aniversario,
      a.turma_id,
      t.nome AS turma_nome,
      a.id_pai,
      a.faltas,
      a.data_criacao,
      a.data_atualizacao,
      a.status
    FROM alunos a
    LEFT JOIN turmas t ON t.id = a.turma_id
    WHERE a.id_pai = ?
    ORDER BY a.nome ASC
  `;

  return await query(sql, [parentId]);
}

export async function findByTurmaId(turmaId) {
  const sql = `
    SELECT
      a.id,
      a.matricula,
      a.nome,
      a.aniversario,
      a.turma_id,
      t.nome AS turma_nome,
      a.id_pai,
      a.faltas,
      a.data_criacao,
      a.data_atualizacao,
      a.status
    FROM alunos a
    LEFT JOIN turmas t ON t.id = a.turma_id
    WHERE a.turma_id = ?
    ORDER BY a.nome ASC
  `;

  return await query(sql, [turmaId]);
}

export async function create({
  matricula,
  nome,
  aniversario,
  turma_id,
  id_pai,
  faltas,
  status
}) {
  const sql = `
    INSERT INTO alunos
      (matricula, nome, aniversario, turma_id, id_pai, faltas, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const result = await query(sql, [
    matricula,
    nome,
    aniversario || null,
    turma_id,
    id_pai ?? null,
    faltas ?? 0,
    status || "ativo"
  ]);

  return await findById(result.insertId);
}

export async function updateById(id, fields) {
  const existing = await findById(id);
  if (!existing) return null;

  const matricula = fields.matricula !== undefined ? fields.matricula : existing.matricula;
  const nome = fields.nome !== undefined ? fields.nome : existing.nome;
  const aniversario = fields.aniversario !== undefined ? fields.aniversario : existing.aniversario;
  const turma_id = fields.turma_id !== undefined ? fields.turma_id : existing.turma_id;
  const id_pai = fields.id_pai !== undefined ? fields.id_pai : existing.id_pai;
  const faltas = fields.faltas !== undefined ? fields.faltas : existing.faltas;
  const status = fields.status !== undefined ? fields.status : existing.status;

  const sql = `
    UPDATE alunos
    SET
      matricula = ?,
      nome = ?,
      aniversario = ?,
      turma_id = ?,
      id_pai = ?,
      faltas = ?,
      status = ?
    WHERE id = ?
  `;

  await query(sql, [
    matricula,
    nome,
    aniversario || null,
    turma_id,
    id_pai ?? null,
    faltas ?? 0,
    status || "ativo",
    id
  ]);

  return await findById(id);
}

export async function deleteById(id) {
  const sql = `
    DELETE FROM alunos
    WHERE id = ?
  `;

  const result = await query(sql, [id]);

  return result.affectedRows > 0;
}
