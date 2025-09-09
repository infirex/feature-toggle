import { config } from 'dotenv'
import { join } from 'path'
config({ path: join(__dirname, '../.env') })

import 'reflect-metadata'
import { AppDataSource } from './helpers/dataSource'
import { User, Feature, FeatureFlag, Tenant, AuditLog } from './models'

async function clearDatabase() {
  await AppDataSource.initialize()
  console.log('Data Source initialized. Clearing database...')

  const entities = [FeatureFlag, Feature, Tenant, User, AuditLog]

  for (const entity of entities) {
    const repo = AppDataSource.getRepository(entity)
    // Truncate table and restart ID sequence
    await repo.query(`TRUNCATE TABLE "${repo.metadata.tableName}" RESTART IDENTITY CASCADE;`)
    console.log(`Table ${repo.metadata.tableName} truncated`)
  }

  console.log('All tables cleared!')
  await AppDataSource.destroy()
  process.exit(0)
}

clearDatabase().catch((err) => {
  console.error('Error clearing database:', err)
  process.exit(1)
})
