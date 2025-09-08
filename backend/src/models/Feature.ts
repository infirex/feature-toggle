// // backend/src/models/Feature.ts
// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm'
// import { FeatureFlag } from './FeatureFlag'

// @Entity()
// export class Feature {
//   @PrimaryGeneratedColumn()
//   id: number

//   @Column({ unique: true })
//   name: string

//   @Column({ nullable: true })
//   description: string

//   @CreateDateColumn()
//   created_at: Date

//   @OneToMany(() => FeatureFlag, (flag) => flag.feature)
//   feature_flags: FeatureFlag[]
// }
