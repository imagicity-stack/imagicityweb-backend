import path from 'node:path';
import fs from 'fs-extra';

export default async function cleanupUploads(req) {
  const files = [];

  if (req.file) {
    files.push(req.file);
  }

  if (Array.isArray(req.files)) {
    files.push(...req.files);
  } else if (req.files && typeof req.files === 'object') {
    for (const value of Object.values(req.files)) {
      if (Array.isArray(value)) {
        files.push(...value);
      } else if (value) {
        files.push(value);
      }
    }
  }

  await Promise.all(
    files.map((file) => fs.remove(path.join(file.destination, file.filename)))
  );
}
