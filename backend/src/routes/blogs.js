import { Router } from 'express';

import {
  createBlog,
  deleteBlog,
  getBlog,
  listBlogs,
  updateBlog,
} from '../controllers/blogsController.js';
import validateBody from '../middleware/validate.js';
import cleanupUploads from '../middleware/cleanupUploads.js';
import { blogImageUpload } from '../middleware/upload.js';
import { createBlogSchema, updateBlogSchema } from '../validators/blogValidator.js';

const router = Router();
const upload = blogImageUpload();

router.get('/', listBlogs);
router.get('/:id', getBlog);

router.post(
  '/',
  upload.single('image'),
  validateBody(createBlogSchema, {
    onError: (req) => cleanupUploads(req),
  }),
  createBlog
);

router.put(
  '/:id',
  upload.single('image'),
  validateBody(updateBlogSchema, {
    onError: (req) => cleanupUploads(req),
  }),
  updateBlog
);

router.delete('/:id', deleteBlog);

export default router;
