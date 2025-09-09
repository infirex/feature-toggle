import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { AuditLog, Feature, FeatureFlag, Tenant, User } from '../models'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'feature_toggle',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: false,
  entities: [User, Feature, FeatureFlag, Tenant, AuditLog],
  migrations: ['dist/migrations/*.js'],
  subscribers: []
})
