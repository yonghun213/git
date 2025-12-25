import { PrismaClient } from '@/src/generated/client'

const prisma = new PrismaClient()

export type EntityType = 'TASK' | 'MILESTONE' | 'STORE' | 'TEMPLATE_TASK' | 'OVERRIDE'
export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'RESCHEDULE' | 'REBASE'

interface AuditLogParams {
  entityType: EntityType
  entityId: string
  action: ActionType
  userId?: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  changes?: Record<string, unknown>
  reason?: string
  metadata?: Record<string, unknown>
}

export async function createAuditLog({
  entityType,
  entityId,
  action,
  userId,
  before,
  after,
  changes,
  reason,
  metadata
}: AuditLogParams) {
  try {
    // Calculate changes if before and after are provided but changes is not
    let changesObj = changes
    if (!changesObj && before && after) {
      changesObj = calculateChanges(before, after)
    }

    await prisma.auditLog.create({
      data: {
        entity_type: entityType,
        entity_id: entityId,
        action,
        user_id: userId || null,
        before_json: before ? JSON.stringify(before) : null,
        after_json: after ? JSON.stringify(after) : null,
        changes: changesObj ? JSON.stringify(changesObj) : '{}',
        reason: reason || null,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
    // Don't throw - audit logging should not break the main operation
  }
}

function calculateChanges(before: Record<string, unknown>, after: Record<string, unknown>): Record<string, { old: unknown; new: unknown }> {
  const changes: Record<string, { old: unknown; new: unknown }> = {}
  
  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)])
  
  for (const key of allKeys) {
    const oldVal = before[key]
    const newVal = after[key]
    
    // Compare values (handle Date objects)
    const oldStr = oldVal instanceof Date ? oldVal.toISOString() : JSON.stringify(oldVal)
    const newStr = newVal instanceof Date ? newVal.toISOString() : JSON.stringify(newVal)
    
    if (oldStr !== newStr) {
      changes[key] = { old: oldVal, new: newVal }
    }
  }
  
  return changes
}

export async function getAuditLogs(entityType: EntityType, entityId: string, limit = 50) {
  return prisma.auditLog.findMany({
    where: {
      entity_type: entityType,
      entity_id: entityId
    },
    orderBy: { created_at: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })
}

export async function getAuditLogsForStore(storeId: string, options?: {
  entityType?: EntityType
  limit?: number
  offset?: number
}) {
  // Get all entity IDs related to the store
  const tasks = await prisma.task.findMany({
    where: { store_id: storeId },
    select: { id: true }
  })
  
  const milestones = await prisma.milestone.findMany({
    where: { store_id: storeId },
    select: { id: true }
  })
  
  const entityIds = [
    storeId,
    ...tasks.map(t => t.id),
    ...milestones.map(m => m.id)
  ]
  
  const whereClause: Record<string, unknown> = {
    entity_id: { in: entityIds }
  }
  
  if (options?.entityType) {
    whereClause.entity_type = options.entityType
  }
  
  return prisma.auditLog.findMany({
    where: whereClause,
    orderBy: { created_at: 'desc' },
    take: options?.limit || 100,
    skip: options?.offset || 0,
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })
}
