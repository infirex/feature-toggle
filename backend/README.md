## Database Schema Changes in Production

I follow a **controlled migration workflow** using TypeORM to safely manage database schema changes in production.

### 1️⃣ Develop & Test Locally

- Create or modify **entities** in the codebase.
- Generate a migration file with:

```bash
yarn migration:generate src/migrations/DescriptiveMigrationName
```

- Review the generated SQL to ensure it is correct.
- Test migration on local/dev database.

### 2️⃣ Commit & Code Review

- Commit the migration file along with code changes.
- Perform code review to verify migration correctness.

### 3️⃣ Run Migration in Production

- Ensure the production database connection settings are correct.
- Run the migration:

```bash
yarn migration:run
```

- Migrations are tracked in the `migrations` table to prevent re-applying the same migration.

### 4️⃣ Revert if Needed

- If a migration needs to be reverted (rare), use:

```bash
yarn migration:revert
```

### 5️⃣ Best Practices

- `synchronize: false` in production — never auto-sync schemas.
- Migrations are **version-controlled**, idempotent, and reviewed.
- Always backup production DB before running critical migrations.

