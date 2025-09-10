# Feature Toggle Frontend

This is the **frontend client** for the Feature Toggle system.
It is built using **Vite + TypeScript** and communicates with the backend APIs.

---

## Scripts

Available commands in `package.json`:

* **`yarn dev`**
  Starts the development server with hot-reload.

  ```bash
  yarn dev
  ```

  The app will be available at [http://localhost:5173](http://localhost:5173).

* **`yarn build`**
  Builds the frontend for production.

  ```bash
  yarn build
  ```

  The compiled files will be in the `dist/` folder.

* **`yarn preview`**
  Serves the production build locally for testing.

  ```bash
  yarn preview
  ```

* **`yarn lint`**
  Runs ESLint to check for code style and linting errors.

  ```bash
  yarn lint
  ```

---

## Development Workflow

1. Make sure the backend (Node.js + Postgres + Redis) is running via `docker-compose`.
2. Start the frontend:

   ```bash
   yarn dev
   ```
3. Login via the provided login form.

   * You will need a **tenant API key** (from backend seed script).
   * And a **JWT access\_token** (via `/auth/login`).
4. Other UI flows (feature management, audit logs, etc.) are **not yet implemented**.

---

## Production Deployment

1. Build the app:

   ```bash
   yarn build
   ```
2. Serve the `dist/` folder using a static server (e.g., `nginx`, `Vercel`, or any hosting provider).
3. Ensure the frontend’s `VITE_API_URL` matches your backend API URL in production.

---

## Notes

* 🔑 The frontend depends on **API key + JWT authentication** from the backend.
* 📌 At the moment, **only the login flow is functional**. Other frontend functionality is not yet implemented.