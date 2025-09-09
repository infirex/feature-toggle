import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { FeatureFlag } from './FeatureFlag'

@Entity('features')
export class Feature {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  key!: string // eg: "new_dashboard"

  @Column()
  description!: string

  @OneToMany(() => FeatureFlag, (flag) => flag.feature)
  flags!: FeatureFlag[]
}
