
'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Button } from './ui/Button'
import { Input, Label } from './ui/Input'

interface AuditLogEntry {
  id: string
  action: string
  changes: string
  before_json: string | null
  after_json: string | null
  reason: string | null
  created_at: string
  user?: {
    name: string | null
    email: string
  } | null
}

function TaskHistoryPanel({ taskId, onClose }: { taskId: string; onClose: () => void }) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch(`/api/audit?entityType=TASK&entityId=${taskId}`)
        if (res.ok) {
          const data = await res.json()
          setLogs(data)
        }
      } catch (e) {
        console.error('Failed to fetch audit logs', e)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [taskId])

  const formatChange = (changes: string) => {
    try {
      const parsed = JSON.parse(changes)
      return Object.entries(parsed).map(([key, val]) => {
        const value = val as { old: unknown; new: unknown }
        return (
          <div key={key} className="text-xs">
            <span className="font-medium">{key}:</span>{' '}
            <span className="text-red-600 line-through">{String(value.old)}</span>{' '}
            → <span className="text-green-600">{String(value.new)}</span>
          </div>
        )
      })
    } catch {
      return <span className="text-xs text-gray-500">{changes}</span>
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Task History</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading history...</div>
          ) : logs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No history found</div>
          ) : (
            <div className="space-y-4">
              {logs.map(log => (
                <div key={log.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                      log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                      log.action === 'RESCHEDULE' ? 'bg-blue-100 text-blue-800' :
                      log.action === 'REBASE' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  
                  {log.user && (
                    <div className="text-xs text-gray-600 mb-2">
                      By: {log.user.name || log.user.email}
                    </div>
                  )}
                  
                  {log.reason && (
                    <div className="text-xs text-gray-600 mb-2 italic">
                      {log.reason}
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded p-2">
                    {formatChange(log.changes)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TaskEditModal({ 
    task, 
    onClose, 
    onSave,
    onDelete 
}: { 
    task: any, 
    onClose: () => void, 
    onSave: (id: string, date: string, policy: string) => void,
    onDelete?: (id: string) => void
}) {
  const [date, setDate] = useState(task.start_date ? format(new Date(task.start_date), 'yyyy-MM-dd') : '')
  const [policy, setPolicy] = useState('SHIFT_DOWNSTREAM')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await onSave(task.id, date, policy)
    setIsSaving(false)
    onClose()
  }

  const handleDelete = async () => {
      if (!onDelete) return
      if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) return
      setIsDeleting(true)
      await onDelete(task.id)
      setIsDeleting(false)
      onClose()
  }

  // Check if this is a milestone task
  const isMilestoneTask = task.is_milestone || task.milestone_type

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 truncate pr-4">{task.title}</h2>
                {isMilestoneTask && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                    Milestone
                  </span>
                )}
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
               <Label>Reschedule Policy</Label>
               <select 
                 value={policy} 
                 onChange={e => setPolicy(e.target.value)}
                 className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
               >
                 <option value="SHIFT_DOWNSTREAM">Shift Downstream (Standard)</option>
                 <option value="ONLY_THIS">Only This Task (Manual Override)</option>
               </select>
               <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                 {policy === 'SHIFT_DOWNSTREAM' 
                   ? "⚠️ Moving this task will shift all dependent tasks in the future by the same number of days." 
                   : "ℹ️ Only this task will move. Dependencies may break or overlap."}
               </div>
            </div>
            
            {isMilestoneTask && (
              <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded border border-purple-100">
                ⚠️ This task is linked to a milestone. Changing the date will also update the associated milestone.
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
               <div className="flex gap-2">
                 {onDelete && (
                     <Button variant="danger" size="sm" onClick={handleDelete} disabled={isDeleting}>
                         {isDeleting ? 'Deleting...' : 'Delete Task'}
                     </Button>
                 )}
                 <Button variant="ghost" size="sm" onClick={() => setShowHistory(true)}>
                   History
                 </Button>
               </div>
               <div className="flex space-x-2 ml-auto">
                  <Button variant="ghost" onClick={onClose}>Cancel</Button>
                  <Button 
                      onClick={handleSave} 
                      disabled={isSaving}
                  >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {showHistory && (
        <TaskHistoryPanel taskId={task.id} onClose={() => setShowHistory(false)} />
      )}
    </>
  )
}
