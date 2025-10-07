import path from 'node:path';
import fs from 'fs-extra';
import { nanoid } from 'nanoid';

import DataStore from '../storage/dataStore.js';

const COLLECTION = 'blogs';
const uploadsRoot = path.join(process.cwd(), 'uploads', 'blogs');

function withPublicImagePath(filename) {
  return filename ? `/uploads/blogs/${filename}` : null;
}

export async function listBlogs(_req, res) {
  const blogs = await DataStore.getCollection(COLLECTION);
  res.json(blogs);
}

export async function getBlog(req, res, next) {
  try {
    const blogs = await DataStore.getCollection(COLLECTION);
    const blog = blogs.find((item) => item.id === req.params.id);

    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    res.json(blog);
  } catch (error) {
    next(error);
  }
}

export async function createBlog(req, res, next) {
  try {
    const id = nanoid();
    const timestamp = new Date().toISOString();
    const filename = req.file?.filename ?? null;

    const blog = {
      id,
      title: req.body.title,
      excerpt: req.body.excerpt,
      content: req.body.content,
      image: withPublicImagePath(filename),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await DataStore.appendToCollection(COLLECTION, blog);

    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
}

export async function updateBlog(req, res, next) {
  try {
    const blogs = await DataStore.getCollection(COLLECTION);
    const blogIndex = blogs.findIndex((item) => item.id === req.params.id);

    if (blogIndex === -1) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    const existing = blogs[blogIndex];
    let imagePath = existing.image;

    if (req.file?.filename) {
      imagePath = withPublicImagePath(req.file.filename);
      if (existing.image) {
        const previousFilename = path.basename(existing.image);
        await fs.remove(path.join(uploadsRoot, previousFilename));
      }
    }

    const updated = {
      ...existing,
      ...req.body,
      image: imagePath,
      updatedAt: new Date().toISOString(),
    };

    blogs[blogIndex] = updated;
    await DataStore.saveCollection(COLLECTION, blogs);

    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteBlog(req, res, next) {
  try {
    const blogs = await DataStore.getCollection(COLLECTION);
    const blogIndex = blogs.findIndex((item) => item.id === req.params.id);

    if (blogIndex === -1) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    const [removed] = blogs.splice(blogIndex, 1);
    if (removed.image) {
      const filename = path.basename(removed.image);
      await fs.remove(path.join(uploadsRoot, filename));
    }

    await DataStore.saveCollection(COLLECTION, blogs);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
