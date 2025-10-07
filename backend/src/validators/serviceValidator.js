import Joi from 'joi';

export const createServiceSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  summary: Joi.string().min(10).max(200).required(),
  description: Joi.string().min(20).required(),
  highlight: Joi.string().min(3).max(60).optional()
});

export const updateServiceSchema = createServiceSchema.fork(
  ['name', 'summary', 'description', 'highlight'],
  (schema) => schema.optional()
);
