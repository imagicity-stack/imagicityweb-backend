import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'database.json');

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { blogs: [], services: [], works: [] };
    }
    throw error;
  }
}

async function writeData(data) {
  await fs.outputJson(DATA_FILE, data, { spaces: 2 });
}

export default class DataStore {
  static async getCollection(key) {
    const data = await readData();
    return data[key] || [];
  }

  static async saveCollection(key, collection) {
    const data = await readData();
    data[key] = collection;
    await writeData(data);
    return data[key];
  }

  static async appendToCollection(key, item) {
    const collection = await DataStore.getCollection(key);
    collection.push(item);
    await DataStore.saveCollection(key, collection);
    return item;
  }
}
