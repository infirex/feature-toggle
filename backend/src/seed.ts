import { config } from 'dotenv'
import { join } from 'path'
config({ path: join(__dirname, '../.env') })

import { AppDataSource } from './helpers/dbHelpers'
import { Feature, Tenant } from './models'
import { randomUUID } from 'crypto'

async function seed() {
  await AppDataSource.initialize()

  const tenantRepo = AppDataSource.getRepository(Tenant)
  const featureRepo = AppDataSource.getRepository(Feature)

  // Tenants
  const tenants = ['zebra', 'lion', 'tiger']
  for (const name of tenants) {
    const existing = await tenantRepo.findOne({ where: { name } })
    if (!existing) {
      const tenant = tenantRepo.create({
        name,
        apiKey: randomUUID() // generate a unique API key
      })
      await tenantRepo.save(tenant)
      console.log(`Tenant created: ${name}, API Key: ${tenant.apiKey}`)
    }
  }

  // Features
  const features = ['new_dashboard', 'beta_feature', 'dark_mode']
  for (const key of features) {
    const existing = await featureRepo.findOne({ where: { key } })
    if (!existing) {
      const feature = featureRepo.create({ key, description: `${key} feature` })
      await featureRepo.save(feature)
      console.log(`Feature created: ${key}`)
    }
  }

  console.log('Seeding finished!')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
