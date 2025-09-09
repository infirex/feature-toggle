import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  actor!: string // user email or id

  @Column()
  action!: string // create | update | delete | promote

  @Column()
  entity!: string // e.g. "FeatureFlag"

  @Column()
  entityId!: number

  @Column({ type: 'jsonb', nullable: true })
  before!: any

  @Column({ type: 'jsonb', nullable: true })
  after!: any

  @CreateDateColumn()
  created_at!: Date
}
