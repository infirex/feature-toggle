import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { FeatureFlag } from './FeatureFlag'

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  name!: string

  @OneToMany(() => FeatureFlag, (flag) => flag.tenant)
  featureFlags!: FeatureFlag[]
}
