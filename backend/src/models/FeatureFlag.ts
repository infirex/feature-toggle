import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { Tenant } from './Tenant'
import { Feature } from './Feature'

@Entity('feature_flags')
export class FeatureFlag {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Tenant, (tenant) => tenant.featureFlags, { onDelete: 'CASCADE' })
  tenant!: Tenant

  @ManyToOne(() => Feature, (feature) => feature.flags, { onDelete: 'CASCADE' })
  feature!: Feature

  @Column()
  env!: string // dev, staging, prod

  @Column({ default: false })
  enabled!: boolean

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
