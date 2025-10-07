import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import blogsRouter from './routes/blogs.js';
import servicesRouter from './routes/services.js';
import worksRouter from './routes/works.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/blogs', blogsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/works', worksRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  if (err instanceof multer.MulterError) {
    res.status(400).json({
      message: err.message,
    });
    return;
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    details: err.details || undefined,
  });
});

export default app;
