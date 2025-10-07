import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createStorage(folder) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(__dirname, '..', 'uploads', folder));
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
}

export function blogImageUpload() {
  return multer({
    storage: createStorage('blogs'),
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        cb(new Error('Only image uploads are allowed'));
        return;
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  });
}

export function workImagesUpload() {
  return multer({
    storage: createStorage('works'),
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        cb(new Error('Only image uploads are allowed'));
        return;
      }
      cb(null, true);
    },
    limits: { fileSize: 8 * 1024 * 1024 },
  });
}
