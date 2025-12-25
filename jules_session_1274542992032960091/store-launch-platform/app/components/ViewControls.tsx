
'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from './ui/Input'

interface Store {
  id: string
  name: string
  country: string
}

interface ViewControlsProps {
  phases: string[]
  stores?: Store[]  // Optional: for cross-store filtering
  showStoreFilters?: boolean  // Whether to show country/store filters
}

export default function ViewControls({ phases, stores = [], showStoreFilters = false }: ViewControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const mode = searchParams.get('mode') || 'ALL'
  const filterPhase = searchParams.get('phase') || ''
  const filterStatus = searchParams.get('status') || ''
  const filterCountry = searchParams.get('country') || ''
  const filterStoreId = searchParams.get('storeId') || ''
  const search = searchParams.get('q') || ''

  // Derive unique countries from stores
  const countries = useMemo(() => {
    const countrySet = new Set(stores.map(s => s.country))
    return Array.from(countrySet).sort()
  }, [stores])

  // Filter stores by selected country
  const filteredStores = useMemo(() => {
    if (!filterCountry) return stores
    return stores.filter(s => s.country === filterCountry)
  }, [stores, filterCountry])

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    // Clear storeId if country changes
    if (key === 'country') {
      params.delete('storeId')
    }
    
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <div className="flex flex-wrap items-center gap-4">
        {/* View Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-md">
          <button 
            onClick={() => updateParam('mode', 'ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${mode === 'ALL' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            All Tasks
          </button>
          <button 
            onClick={() => updateParam('mode', 'FOCUS')}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${mode === 'FOCUS' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Focus
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

        {/* Country/Store Filters (when enabled) */}
        {showStoreFilters && stores.length > 0 && (
          <>
            <select 
              value={filterCountry} 
              onChange={(e) => updateParam('country', e.target.value)}
              className="text-sm border-slate-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 border p-2 bg-white"
            >
              <option value="">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select 
              value={filterStoreId} 
              onChange={(e) => updateParam('storeId', e.target.value)}
              className="text-sm border-slate-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 border p-2 bg-white"
            >
              <option value="">All Stores</option>
              {filteredStores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
          </>
        )}

        {/* Phase Filter */}
        <select 
          value={filterPhase} 
          onChange={(e) => updateParam('phase', e.target.value)}
          className="text-sm border-slate-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 border p-2 bg-white"
        >
          <option value="">All Phases</option>
          {phases.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Status Filter */}
        <select 
          value={filterStatus} 
          onChange={(e) => updateParam('status', e.target.value)}
          className="text-sm border-slate-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 border p-2 bg-white"
        >
          <option value="">All Statuses</option>
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>

        <div className="flex-grow"></div>

        {/* Search */}
        <Input 
          type="text" 
          placeholder="Search..." 
          value={search}
          onChange={(e) => updateParam('q', e.target.value)}
          className="w-full md:w-48"
        />
      </div>
    </div>
  )
}
