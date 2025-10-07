# Imagicity Backend

A standalone Node.js + Express API designed to power the Imagicity front-end. The service
focuses on three domains: blogs, services (for the stack menu), and work showcases with
support for multiple images.

## Features

- **Blogs** – Create, list, update, and delete blog posts. Each post supports an optional
  cover image and rich content body.
- **Services** – Manage the services that populate the stack menu, including detailed
  descriptions and highlight callouts.
- **Works** – Upload project case studies with multi-image galleries, descriptive copy,
  and optional client metadata.
- **File uploads** – Image uploads are stored locally under `/uploads` with static hosting
  enabled for retrieval.
- **Validation & Security** – Payloads are validated with Joi, Helmet hardens HTTP headers,
  and CORS is enabled for easy integration with the existing front-end.

## Getting Started

```bash
cd backend
npm install
npm run dev
```

The API listens on port `5000` by default. Use the `PORT` environment variable to override
when deploying to AWS Elastic Beanstalk or another platform.

### Environment Variables

Create a `.env` file if you need to customise the runtime:

```
PORT=8080
```

Additional configuration (database URLs, CDN buckets, etc.) can be layered in as the
project evolves.

## API Overview

### Blogs

| Method | Endpoint        | Description                 |
| ------ | --------------- | --------------------------- |
| GET    | `/api/blogs`    | List all blog posts         |
| GET    | `/api/blogs/:id`| Retrieve a single post      |
| POST   | `/api/blogs`    | Create a post (supports `multipart/form-data` with `image`) |
| PUT    | `/api/blogs/:id`| Update a post and optionally replace its image |
| DELETE | `/api/blogs/:id`| Remove a post and its image |

### Services

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | `/api/services`    | List available services  |
| GET    | `/api/services/:id`| Retrieve a service entry |
| POST   | `/api/services`    | Create a new service     |
| PUT    | `/api/services/:id`| Update a service         |
| DELETE | `/api/services/:id`| Remove a service         |

### Works

| Method | Endpoint        | Description                                                          |
| ------ | --------------- | -------------------------------------------------------------------- |
| GET    | `/api/works`    | List all works                                                       |
| GET    | `/api/works/:id`| Retrieve a single work entry                                         |
| POST   | `/api/works`    | Create a work entry (use `multipart/form-data` with `images[]`)      |
| PUT    | `/api/works/:id`| Update a work, append new images, or remove existing gallery images  |
| DELETE | `/api/works/:id`| Remove a work and all stored images                                  |

When updating works you can send a `removeImages` array (JSON string or repeated fields)
with the public image paths to delete from the gallery.

## Data Storage

For portability, the backend persists data to `data/database.json`. This file is created
automatically on first run. The structure is intentionally simple so it can be replaced
with a database layer (PostgreSQL, DynamoDB, etc.) without disrupting the route contracts.

## Deployment Notes

- The entry point is `src/server.js`.
- Uploads live under `/uploads` and are served as static assets; ensure the directory is
  writable on the deployment target.
- Elastic Beanstalk Node.js environments will pick up the `start` script automatically.

Feel free to extend the controllers to integrate with your preferred storage services or
cloud-native pipelines as the project scales.
