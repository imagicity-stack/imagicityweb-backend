import Joi from 'joi';

export const createBlogSchema = Joi.object({
  title: Joi.string().min(3).max(120).required(),
  excerpt: Joi.string().min(10).max(280).required(),
  content: Joi.string().min(20).required()
});

export const updateBlogSchema = createBlogSchema.fork(
  ['title', 'excerpt', 'content'],
  (schema) => schema.optional()
);
