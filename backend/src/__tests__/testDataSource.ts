// I couldn't use mock datasource here because of config issues so I'm using the real one

// import { DataSource } from 'typeorm'
// import { Tenant, Feature, FeatureFlag, User, AuditLog } from '../models'

// export const testDataSource = new DataSource({
//   type: 'sqlite',
//   database: ':memory:',
//   synchronize: true,
//   dropSchema: true,
//   entities: [Tenant, Feature, FeatureFlag, User, AuditLog],
//   logging: false
// })

// export async function seedTestData() {
//   const tenantRepo = testDataSource.getRepository(Tenant)
//   const featureRepo = testDataSource.getRepository(Feature)

//   // Tenants
//   const tenants = ['zebra', 'lion', 'tiger']
//   for (const name of tenants) {
//     const existing = await tenantRepo.findOne({ where: { name } })
//     if (!existing) {
//       const tenant = tenantRepo.create({
//         name,
//         apiKey: Tenant.generateApiKey() // generate a unique API key
//       })
//       await tenantRepo.save(tenant)
//       console.log(`Tenant created: ${name}, API Key: ${tenant.apiKey}`)
//     }
//   }

//   // Features
//   const features = ['new_dashboard', 'beta_feature', 'dark_mode']
//   for (const key of features) {
//     const existing = await featureRepo.findOne({ where: { key } })
//     if (!existing) {
//       const feature = featureRepo.create({ key, description: `${key} feature` })
//       await featureRepo.save(feature)
//       console.log(`Feature created: ${key}`)
//     }
//   }

//   console.log('Seeding finished!')
// }
