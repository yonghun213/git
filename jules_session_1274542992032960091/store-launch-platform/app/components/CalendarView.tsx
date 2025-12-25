
'use client'

import { useState, useCallback } from 'react'
import { Calendar, dateFnsLocalizer, View, ToolbarProps, Navigate } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { format, parse, startOfWeek, getDay, setMonth, setYear } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Cast to any to avoid strict typing issues with Accessors in older/wrapper versions
const DnDCalendar = withDragAndDrop(Calendar as any) as any

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Generate years range: current year ± 5
function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i)
  }
  return years
}

type NavigateAction = 'PREV' | 'NEXT' | 'TODAY' | 'DATE'

interface CustomToolbarProps extends ToolbarProps {
  onCustomNavigate: (action: NavigateAction, newDate?: Date) => void
}

function CustomToolbar({ date, view, onNavigate, onView, onCustomNavigate }: CustomToolbarProps) {
  const years = getYearOptions()
  const currentMonth = date.getMonth()
  const currentYear = date.getFullYear()

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value, 10)
    const newDate = setMonth(date, newMonth)
    onCustomNavigate('DATE', newDate)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value, 10)
    const newDate = setYear(date, newYear)
    onCustomNavigate('DATE', newDate)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate(Navigate.TODAY)}
          className="px-3 py-1.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
        >
          Today
        </button>
        <button
          onClick={() => onNavigate(Navigate.PREVIOUS)}
          className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
          aria-label="Previous"
        >
          ←
        </button>
        <button
          onClick={() => onNavigate(Navigate.NEXT)}
          className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
          aria-label="Next"
        >
          →
        </button>
      </div>

      {/* Year/Month dropdowns */}
      <div className="flex items-center gap-2">
        <select
          value={currentMonth}
          onChange={handleMonthChange}
          className="text-sm border border-slate-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 bg-white cursor-pointer"
        >
          {MONTHS.map((month, idx) => (
            <option key={month} value={idx}>{month}</option>
          ))}
        </select>
        <select
          value={currentYear}
          onChange={handleYearChange}
          className="text-sm border border-slate-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 bg-white cursor-pointer"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* View toggles */}
      <div className="flex bg-slate-100 p-1 rounded-md">
        {(['month', 'week', 'agenda'] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => onView(v)}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all capitalize ${
              view === v 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function CalendarView({ 
    tasks, 
    onEventClick,
    onEventDrop 
}: { 
    tasks: any[], 
    onEventClick: (task: any) => void,
    onEventDrop?: (args: any) => void
}) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<View>('month')

  const events = tasks.map(t => ({
    id: t.id,
    title: t.title,
    start: new Date(t.start_date || new Date()), // Fallback
    end: new Date(t.due_date || new Date()),
    allDay: true, 
    resource: t
  }))

  const handleCustomNavigate = useCallback((action: NavigateAction, newDate?: Date) => {
    if (action === 'DATE' && newDate) {
      setCurrentDate(newDate)
    }
  }, [])

  return (
    <div className="h-full">
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        date={currentDate}
        view={currentView}
        onNavigate={(newDate: Date) => setCurrentDate(newDate)}
        onView={(newView: View) => setCurrentView(newView)}
        onSelectEvent={(e: any) => onEventClick(e.resource)}
        onEventDrop={onEventDrop}
        resizable={false}
        views={['month', 'week', 'agenda']}
        components={{
          toolbar: (props: ToolbarProps) => (
            <CustomToolbar
              {...props}
              onCustomNavigate={handleCustomNavigate}
            />
          )
        }}
      />
    </div>
  )
}
