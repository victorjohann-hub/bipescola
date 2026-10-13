import { query } from './src/database/db.js';

try {
  await query("ALTER TABLE users MODIFY COLUMN role ENUM('PROF','ADM','PARENT','PORTEIRO') NOT NULL DEFAULT 'PARENT'");

  await query(`
    ALTER TABLE users
      ADD COLUMN reset_token VARCHAR(255) NULL,
      ADD COLUMN reset_token_expires DATETIME NULL,
      ADD COLUMN foto VARCHAR(255) NULL
  `);

  console.log('Alterações no banco concluídas!');
} catch (error) {
  console.error('Erro:', error.message);
} finally {
  process.exit();
}
