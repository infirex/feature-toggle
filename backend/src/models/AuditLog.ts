// // backend/src/models/AuditLog.ts
// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

// @Entity()
// export class AuditLog {
//   @PrimaryGeneratedColumn()
//   id: number

//   @Column()
//   actor: string

//   @Column()
//   action: string

//   @Column()
//   feature_flag_id: number

//   @Column({ type: 'jsonb', nullable: true })
//   before_state: any

//   @Column({ type: 'jsonb', nullable: true })
//   after_state: any

//   @CreateDateColumn()
//   created_at: Date
// }
