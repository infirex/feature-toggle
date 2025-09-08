// // backend/src/models/Tenant.ts
// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm'
// import { FeatureFlag } from './FeatureFlag'

// @Entity()
// export class Tenant {
//   @PrimaryGeneratedColumn()
//   id: number

//   @Column({ unique: true })
//   name: string

//   @CreateDateColumn()
//   created_at: Date

//   @OneToMany(() => FeatureFlag, (flag) => flag.tenant)
//   feature_flags: FeatureFlag[]
// }
