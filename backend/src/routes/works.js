import { Router } from 'express';

import {
  createWork,
  deleteWork,
  getWork,
  listWorks,
  updateWork,
} from '../controllers/worksController.js';
import cleanupUploads from '../middleware/cleanupUploads.js';
import validateBody from '../middleware/validate.js';
import { workImagesUpload } from '../middleware/upload.js';
import { createWorkSchema, updateWorkSchema } from '../validators/workValidator.js';

const router = Router();
const upload = workImagesUpload();

router.get('/', listWorks);
router.get('/:id', getWork);

router.post(
  '/',
  upload.array('images', 10),
  validateBody(createWorkSchema, {
    onError: (req) => cleanupUploads(req),
  }),
  createWork
);

router.put(
  '/:id',
  upload.array('images', 10),
  validateBody(updateWorkSchema, {
    allowUnknown: true,
    onError: (req) => cleanupUploads(req),
  }),
  updateWork
);

router.delete('/:id', deleteWork);

export default router;
