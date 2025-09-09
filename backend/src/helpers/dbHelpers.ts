import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { AuditLog, Feature, FeatureFlag, Tenant, User } from '../models'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  synchronize: true,
  logging: true,
  entities: [User, Feature, FeatureFlag, Tenant, AuditLog],
  migrations: [],
  subscribers: []
})
