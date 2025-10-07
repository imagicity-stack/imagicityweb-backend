import { nanoid } from 'nanoid';

import DataStore from '../storage/dataStore.js';

const COLLECTION = 'services';

export async function listServices(_req, res) {
  const services = await DataStore.getCollection(COLLECTION);
  res.json(services);
}

export async function getService(req, res) {
  const services = await DataStore.getCollection(COLLECTION);
  const service = services.find((item) => item.id === req.params.id);

  if (!service) {
    res.status(404).json({ message: 'Service not found' });
    return;
  }

  res.json(service);
}

export async function createService(req, res, next) {
  try {
    const service = {
      id: nanoid(),
      name: req.body.name,
      summary: req.body.summary,
      description: req.body.description,
      highlight: req.body.highlight ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await DataStore.appendToCollection(COLLECTION, service);
    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
}

export async function updateService(req, res, next) {
  try {
    const services = await DataStore.getCollection(COLLECTION);
    const index = services.findIndex((item) => item.id === req.params.id);

    if (index === -1) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    const updated = {
      ...services[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    services[index] = updated;
    await DataStore.saveCollection(COLLECTION, services);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteService(req, res, next) {
  try {
    const services = await DataStore.getCollection(COLLECTION);
    const index = services.findIndex((item) => item.id === req.params.id);

    if (index === -1) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    services.splice(index, 1);
    await DataStore.saveCollection(COLLECTION, services);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
