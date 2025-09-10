import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { FeatureFlag } from './FeatureFlag'
import { randomBytes } from 'crypto'

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  name!: string

  @Column({ unique: true, select: false })
  apiKey!: string // Unique API key for the tenant

  @OneToMany(() => FeatureFlag, (flag) => flag.tenant)
  featureFlags!: FeatureFlag[]

  // Helper to generate new API keys
  static generateApiKey() {
    return randomBytes(32).toString('hex')
  }
}
