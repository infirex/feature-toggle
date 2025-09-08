// // backend/src/models/FeatureFlag.ts
// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   ManyToOne,
//   Column,
//   UpdateDateColumn,
//   Unique
// } from 'typeorm'
// import { Tenant } from './Tenant'
// import { Feature } from './Feature'

// @Entity()
// @Unique(['tenant', 'feature', 'env'])
// export class FeatureFlag {
//   @PrimaryGeneratedColumn()
//   id: number

//   @ManyToOne(() => Tenant, (tenant) => tenant.feature_flags)
//   tenant: Tenant

//   @ManyToOne(() => Feature, (feature) => feature.feature_flags)
//   feature: Feature

//   @Column()
//   env: string

//   @Column({ default: false })
//   enabled: boolean

//   @Column({ type: 'jsonb', default: {} })
//   strategy: any

//   @UpdateDateColumn()
//   updated_at: Date
// }
