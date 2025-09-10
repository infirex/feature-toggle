import { Repository } from 'typeorm'
import { AppDataSource } from '../helpers/dataSource'
import { AuditLog } from '../models'

export class AuditService {
  constructor(
    private readonly auditRepo: Repository<AuditLog> = AppDataSource.getRepository(AuditLog)
  ) {}

  async logChange(
    actor: string,
    action: 'create' | 'update' | 'delete' | 'promote',
    entity: string,
    entityId: number,
    before: any,
    after: any
  ) {
    const log = this.auditRepo.create({
      actor,
      action,
      entity,
      entityId,
      before,
      after
    })
    await this.auditRepo.save(log)
  }

  async getLogs(
    page = 1,
    limit = 20,
    filters?: {
      tenant?: string
      entity?: string
      action?: 'create' | 'update' | 'delete' | 'promote'
    }
  ) {
    const { tenant, entity, action } = filters || {}

    const qb = this.auditRepo.createQueryBuilder('log')

    // Filter by tenant name in either before or after
    if (tenant) {
      qb.andWhere(
        `(log.before -> 'tenant' ->> 'name' = :tenant OR log.after -> 'tenant' ->> 'name' = :tenant)`,
        { tenant }
      )
    }

    if (entity) {
      qb.andWhere('log.entity = :entity', { entity })
    }

    if (action) {
      qb.andWhere('log.action = :action', { action })
    }

    qb.orderBy('log.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [logs, total] = await qb.getManyAndCount()

    return { total, page, limit, logs }
  }
}

export const auditService = new AuditService()
