import Fastify from 'fastify';
import cors from '@fastify/cors';
import 'dotenv/config';
import tasksRoutes from './routes/tasks.js';
import { pool } from './db.js';

const app = Fastify({ logger: true });
const { CORS_ORIGIN, PORT} = process.env
await app.register(cors, {
  origin: CORS_ORIGIN || 'http://localhost:5173',
});

// Garante a tabela e a coluna "description" (bancos criados antes dessa versão)
async function ensureSchema() {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      due_date DATE NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);
    const [cols] = await pool.query("SHOW COLUMNS FROM tasks LIKE 'description'");
    if (cols.length === 0) {
      await pool.query('ALTER TABLE tasks ADD COLUMN description TEXT NULL AFTER title');
      app.log.info('Coluna "description" adicionada à tabela tasks.');
    }
  } catch (err) {
    app.log.warn(`Não foi possível verificar o banco agora (${err.code || err.message}).`);
  }
}
await ensureSchema();

app.get('/health', async () => ({ status: 'ok' }));

await app.register(tasksRoutes);

const port = Number(PORT) || 3333;

try {
  await app.listen({ port, host: '0.0.0.0' });
  console.log(`Servidor rodando em http://localhost:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

