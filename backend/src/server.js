import http from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'fs-extra';

import app from './app.js';

const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureDirectories() {
  const basePath = path.join(__dirname, '..');
  await fs.ensureDir(path.join(basePath, 'uploads', 'blogs'));
  await fs.ensureDir(path.join(basePath, 'uploads', 'works'));
  await fs.ensureDir(path.join(basePath, 'data'));
}

async function startServer() {
  await ensureDirectories();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${PORT}`);
  });
}

startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', error);
  process.exit(1);
});
