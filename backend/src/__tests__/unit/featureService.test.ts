// **NOTE**: I couldn't use mock datasource here because of config issues so I'm using the real one

import { AppDataSource } from '../../helpers/dataSource'
import { featureService } from '../../services'

beforeAll(async () => {
  await AppDataSource.initialize()
})

describe('FeatureService', () => {
  it('should create a new feature flag', async () => {
    const flag = await featureService.createOrUpdateFlag('zebra', 'dev', 'new_dashboard', true)
    expect(flag.enabled).toBe(true)
  })

  it('should update an existing feature flag', async () => {
    const flag = await featureService.createOrUpdateFlag('zebra', 'dev', 'new_dashboard', false)
    expect(flag.enabled).toBe(false)
  })

  it('should promote feature flags', async () => {
    await featureService.promoteFlags('zebra', ['new_dashboard'], 'dev', 'prod')
  })

  it('should delete a feature flag', async () => {
    await featureService.deleteFlag('zebra', 'dev', 'new_dashboard')
  })

  afterAll(async () => {
    await AppDataSource.destroy()
  })
})
