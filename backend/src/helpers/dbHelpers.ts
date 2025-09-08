import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../models/User'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [User /* Feature, FeatureFlag, AuditLog, Tenant */],
  migrations: [],
  subscribers: []
})
