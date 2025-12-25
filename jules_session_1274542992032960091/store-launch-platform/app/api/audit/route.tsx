import { NextResponse } from 'next/server'
import { getAuditLogs } from '@/lib/audit'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const entityType = searchParams.get('entityType') as 'TASK' | 'MILESTONE' | 'STORE' | 'TEMPLATE_TASK' | 'OVERRIDE' | null
  const entityId = searchParams.get('entityId')
  const limit = parseInt(searchParams.get('limit') || '50', 10)

  if (!entityType || !entityId) {
    return NextResponse.json({ error: 'Missing entityType or entityId' }, { status: 400 })
  }

  try {
    const logs = await getAuditLogs(entityType, entityId, limit)
    return NextResponse.json(logs)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
  }
}
