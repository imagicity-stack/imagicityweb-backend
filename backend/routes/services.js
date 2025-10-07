import { Router } from 'express';

import {
  createService,
  deleteService,
  getService,
  listServices,
  updateService,
} from '../controllers/servicesController.js';
import validateBody from '../middleware/validate.js';
import {
  createServiceSchema,
  updateServiceSchema,
} from '../validators/serviceValidator.js';

const router = Router();

router.get('/', listServices);
router.get('/:id', getService);

router.post('/', validateBody(createServiceSchema), createService);

router.put(
  '/:id',
  validateBody(updateServiceSchema, { allowUnknown: true }),
  updateService
);

router.delete('/:id', deleteService);

export default router;
