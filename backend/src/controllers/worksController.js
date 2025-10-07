import path from 'node:path';
import fs from 'fs-extra';
import { nanoid } from 'nanoid';

import DataStore from '../storage/dataStore.js';
import { normalizeRemoveList, normalizeTags } from '../utils/normalizers.js';

const COLLECTION = 'works';
const uploadsRoot = path.join(process.cwd(), 'uploads', 'works');

function toPublicPaths(files = []) {
  return files.map((file) => `/uploads/works/${file}`);
}

export async function listWorks(_req, res) {
  const works = await DataStore.getCollection(COLLECTION);
  res.json(works);
}

export async function getWork(req, res) {
  const works = await DataStore.getCollection(COLLECTION);
  const work = works.find((item) => item.id === req.params.id);

  if (!work) {
    res.status(404).json({ message: 'Work not found' });
    return;
  }

  res.json(work);
}

export async function createWork(req, res, next) {
  try {
    const id = nanoid();
    const images = toPublicPaths(req.files?.map((file) => file.filename) ?? []);
    const timestamp = new Date().toISOString();

    const work = {
      id,
      title: req.body.title,
      client: req.body.client ?? null,
      summary: req.body.summary,
      description: req.body.description,
      tags: normalizeTags(req.body.tags),
      images,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await DataStore.appendToCollection(COLLECTION, work);
    res.status(201).json(work);
  } catch (error) {
    next(error);
  }
}

export async function updateWork(req, res, next) {
  try {
    const works = await DataStore.getCollection(COLLECTION);
    const index = works.findIndex((item) => item.id === req.params.id);

    if (index === -1) {
      res.status(404).json({ message: 'Work not found' });
      return;
    }

    const existing = works[index];
    let images = existing.images ?? [];

    if (req.files?.length) {
      const newPublicPaths = toPublicPaths(req.files.map((file) => file.filename));
      images = [...images, ...newPublicPaths];
    }

    const removeList = normalizeRemoveList(req.body.removeImages);
    if (removeList.length) {
      const removeSet = new Set(removeList);
      const remaining = [];
      for (const image of images) {
        if (removeSet.has(image)) {
          const filename = path.basename(image);
          await fs.remove(path.join(uploadsRoot, filename));
        } else {
          remaining.push(image);
        }
      }
      images = remaining;
    }

    const hasTags = Object.prototype.hasOwnProperty.call(req.body, 'tags');
    const updated = {
      ...existing,
      title: req.body.title ?? existing.title,
      client: req.body.client ?? existing.client,
      summary: req.body.summary ?? existing.summary,
      description: req.body.description ?? existing.description,
      tags: hasTags ? normalizeTags(req.body.tags) : existing.tags,
      images,
      updatedAt: new Date().toISOString(),
    };

    works[index] = updated;
    await DataStore.saveCollection(COLLECTION, works);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteWork(req, res, next) {
  try {
    const works = await DataStore.getCollection(COLLECTION);
    const index = works.findIndex((item) => item.id === req.params.id);

    if (index === -1) {
      res.status(404).json({ message: 'Work not found' });
      return;
    }

    const [removed] = works.splice(index, 1);

    for (const image of removed.images ?? []) {
      const filename = path.basename(image);
      await fs.remove(path.join(uploadsRoot, filename));
    }

    await DataStore.saveCollection(COLLECTION, works);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
