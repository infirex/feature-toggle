import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../models/User'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'feature_toggle',
  synchronize: true,
  logging: true,
  entities: [User /* Feature, FeatureFlag, AuditLog, Tenant */],
  migrations: [],
  subscribers: []
})
