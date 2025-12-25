import { NextResponse } from 'next/server'
import { PrismaClient } from '@/src/generated/client'
import { createAuditLog } from '@/lib/audit'

const prisma = new PrismaClient()

// Get all overrides for a store
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const overrides = await prisma.storeTemplateOverride.findMany({
      where: { store_id: id }
    })
    return NextResponse.json(overrides)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch overrides' }, { status: 500 })
  }
}

// Create or update an override
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const { 
    template_task_id, 
    override_title, 
    override_anchor_event, 
    override_offset_days, 
    override_duration_days,
    override_workday_rule,
    is_disabled,
    userId
  } = body

  if (!template_task_id) {
    return NextResponse.json({ error: 'Missing template_task_id' }, { status: 400 })
  }

  try {
    // Check if override already exists
    const existing = await prisma.storeTemplateOverride.findUnique({
      where: {
        store_id_template_task_id: {
          store_id: id,
          template_task_id
        }
      }
    })

    let override
    if (existing) {
      // Update existing override
      override = await prisma.storeTemplateOverride.update({
        where: { id: existing.id },
        data: {
          override_title: override_title ?? existing.override_title,
          override_anchor_event: override_anchor_event ?? existing.override_anchor_event,
          override_offset_days: override_offset_days ?? existing.override_offset_days,
          override_duration_days: override_duration_days ?? existing.override_duration_days,
          override_workday_rule: override_workday_rule ?? existing.override_workday_rule,
          is_disabled: is_disabled ?? existing.is_disabled
        }
      })
      
      await createAuditLog({
        entityType: 'OVERRIDE',
        entityId: override.id,
        action: 'UPDATE',
        userId,
        before: existing,
        after: override
      })
    } else {
      // Create new override
      override = await prisma.storeTemplateOverride.create({
        data: {
          store_id: id,
          template_task_id,
          override_title,
          override_anchor_event,
          override_offset_days,
          override_duration_days,
          override_workday_rule,
          is_disabled: is_disabled ?? false
        }
      })
      
      await createAuditLog({
        entityType: 'OVERRIDE',
        entityId: override.id,
        action: 'CREATE',
        userId,
        after: override
      })
    }

    return NextResponse.json(override)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create/update override' }, { status: 500 })
  }
}

// Delete an override (reset to default)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const overrideId = searchParams.get('overrideId')
  const userId = searchParams.get('userId')

  if (!overrideId) {
    return NextResponse.json({ error: 'Missing overrideId' }, { status: 400 })
  }

  try {
    const existing = await prisma.storeTemplateOverride.findUnique({
      where: { id: overrideId }
    })
    
    if (!existing || existing.store_id !== id) {
      return NextResponse.json({ error: 'Override not found' }, { status: 404 })
    }

    await prisma.storeTemplateOverride.delete({
      where: { id: overrideId }
    })
    
    await createAuditLog({
      entityType: 'OVERRIDE',
      entityId: overrideId,
      action: 'DELETE',
      userId: userId || undefined,
      before: existing
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to delete override' }, { status: 500 })
  }
}
