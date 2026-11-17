// Cria o banco (se nao existir) e aplica database/schema-producao.sql.
// Uso: defina DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_SSL e DB_NAME e rode: node aplicar-schema.mjs
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const { DB_HOST, DB_PORT = '3306', DB_USER, DB_PASSWORD = '', DB_NAME = 'bipescola', DB_SSL } = process.env;

if (!DB_HOST || !DB_USER) {
  console.error('Defina DB_HOST, DB_USER e DB_PASSWORD antes de rodar.');
  process.exit(1);
}

const schemaPath = fileURLToPath(new URL('../database/schema-producao.sql', import.meta.url));
const schema = fs.readFileSync(schemaPath, 'utf8').replace(/^﻿/, '');

const conn = await mysql.createConnection({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  ssl: DB_SSL === 'true' ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
  multipleStatements: true,
});

try {
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await conn.query(`USE \`${DB_NAME}\``);

  const [existing] = await conn.query('SHOW TABLES');
  if (existing.length > 0) {
    console.log(`O banco "${DB_NAME}" ja tem ${existing.length} tabela(s). Nada foi alterado.`);
  } else {
    await conn.query(schema);
    const [created] = await conn.query('SHOW TABLES');
    console.log(`Banco "${DB_NAME}" pronto. Tabelas criadas:`);
    for (const row of created) console.log(' -', Object.values(row)[0]);
  }
} catch (error) {
  console.error('Falhou:', error.code, '-', error.message);
  process.exitCode = 1;
} finally {
  await conn.end();
}
