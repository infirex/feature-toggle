# Feature Toggle Service

````markdown
A multi-tenant feature toggle service with environment-specific feature flags, audit logging, JWT authentication, Redis caching, and observability (Prometheus + Grafana).

---

## 🏗️ Project Structure

- `src/` – Source code (controllers, services, entities, helpers)
- `src/models/` – TypeORM entities
- `src/migrations/` – Database migration scripts
- `src/__tests__/` – Unit and integration tests
- `docker-compose.yml` – Services for local dev/prod
- `.env` – Environment variables

---
````

---
## API Documentation

You can access the full API documentation [here](https://documenter.getpostman.com/view/48180481/2sB3HnLzq6).

---

## ⚙️ Docker Setup

This project uses Docker Compose to run the full stack:

- **Backend (Node.js + Express + TypeScript)**
- **PostgreSQL** – Primary DB
- **Redis** – Caching and rate limiting
- **Prometheus + Grafana** – Observability

### Start All Services

```bash
docker-compose up -d
````

### Backend

```bash
# In development mode
yarn dev

# In production mode (inside Docker)
yarn start
```

### PostgreSQL

* Host: `postgres`
* Port: `5432`
* User: `admin`
* Password: `admin123`
* Database: `feature_toggle`

### Redis

* Host: `redis`
* Port: `6379`

---

## 🔑 Environment Variables

| Variable         | Description                       | Default            |
| ---------------- | --------------------------------- | ------------------ |
| `NODE_ENV`       | Environment (dev/prod)            | `prod`             |
| `DB_USER`        | PostgreSQL username               | `admin`            |
| `DB_PASSWORD`    | PostgreSQL password               | `admin123`         |
| `DB_NAME`        | PostgreSQL database name          | `feature_toggle`   |
| `DB_HOST`        | PostgreSQL host                   | `postgres`         |
| `DB_PORT`        | PostgreSQL port                   | `5432`             |
| `REDIS_HOST`     | Redis host                        | `redis`            |
| `REDIS_PORT`     | Redis port                        | `6379`             |
| `JWT_SECRET`     | Secret key for JWT                | `SUPER_SECRET_KEY` |
| `JWT_EXPIRES_IN` | JWT expiration (e.g., `1h`, `7d`) | `1h`               |
| `PORT`           | Backend listening port            | `3050`             |

---

## 🛠️ Database

### Initialize / Seed DB

```bash
# Clear database
yarn clear-db

# Seed tenants and features
yarn seed
```

### TypeORM Migrations

```bash
# Generate migration
yarn migration:generate src/migrations/NameOfMigration

# Run migrations
yarn migration:run

# Revert last migration
yarn migration:revert
```

---

## 🔐 Authentication

* JWT-based authentication
* Tenant identification via **API Key**
* Example header for API requests:

```
Authorization: Bearer <JWT_TOKEN>
x-api-key: <TENANT_API_KEY>
```

---

## 🚀 API Endpoints

| Method | Route                | Description                                     |
| ------ | -------------------- | ----------------------------------------------- |
| POST   | `/api/auth/register` | Register new user                               |
| POST   | `/api/auth/login`    | Login and get JWT                               |
| GET    | `/features`          | Get feature flags (supports tenant & env query) |
| POST   | `/features`          | Create or update a feature flag                 |
| DELETE | `/features`          | Delete a feature flag                           |
| POST   | `/features/promote`  | Promote flags from one environment to another   |
| GET    | `/audit-logs`        | Paginated audit logs                            |

---

## 📊 Observability

* Prometheus: `http://localhost:9090`
* Grafana: `http://localhost:3000` (admin/admin123)

> Metrics include request logging, errors, and feature flag fetches.

---

## 🧪 Testing

* Uses **Jest** for unit and integration tests.
* Run tests:

```bash
yarn test
yarn test:watch
```

* Make sure to **seed test DB** before running integration tests.

---

## 📝 Notes

* Tenants must have a unique API key (`apiKey`) generated in seed script.
* Feature flags support multiple environments (`dev`, `staging`, `prod`).
* Audit logs track all changes with `actor`, `before`, `after` states.
* Rate limiting per tenant is implemented using Redis (burst + sustained quotas).


## 💡 Important Details

* **Getting API Keys:** API keys are generated during the seed script and printed to the console. You must use the printed API key for the corresponding tenant in requests.
* **Request Validation:** All incoming requests from clients are validated. (DTOs or libraries like `express-validator` can be used.)
* **Redis Usage:** Redis cache is currently used **only for rate limiting**; caching of feature flags or other entities is not yet implemented.

* **Tenant API Keys:** Each tenant has **exactly one API key**, which is used for all tenant-based operations.
* **Testing Setup:** Tests were intended to run on **in-memory SQLite**, but due to errors, tests currently run against the **real Postgres database**.

