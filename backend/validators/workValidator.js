import Joi from 'joi';

import { normalizeRemoveList, normalizeTags } from '../utils/normalizers.js';

const tagSchema = Joi.string().min(2).max(40);

function tagsField() {
  return Joi.any()
    .default([])
    .custom((value, helpers) => {
      const parsed = normalizeTags(value);
      for (const tag of parsed) {
        const { error } = tagSchema.validate(tag);
        if (error) {
          return helpers.error('any.invalid', { message: error.message });
        }
      }
      return parsed;
    }, 'tags normalization');
}

const removeImagesField = Joi.any().custom((value, helpers) => {
  const parsed = normalizeRemoveList(value);
  for (const item of parsed) {
    if (typeof item !== 'string' || !item.trim()) {
      return helpers.error('any.invalid', { message: 'Invalid image reference' });
    }
  }
  return parsed;
}, 'remove images normalization');

export const createWorkSchema = Joi.object({
  title: Joi.string().min(3).max(120).required(),
  client: Joi.string().min(2).max(100).optional(),
  summary: Joi.string().min(10).max(250).required(),
  description: Joi.string().min(20).required(),
  tags: tagsField(),
});

export const updateWorkSchema = createWorkSchema.fork(
  ['title', 'client', 'summary', 'description', 'tags'],
  (schema) => schema.optional()
).append({
  removeImages: removeImagesField.optional(),
});
