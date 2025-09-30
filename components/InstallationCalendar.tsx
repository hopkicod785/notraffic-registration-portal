'use client'

import { useState, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'

interface Installation {
  id: string
  intersection_name: string
  end_user: string
  contact_name: string
  estimated_install_date: string
  status: 'pending' | 'completed' | 'cancelled'
}

interface CalendarDay {
  date: Date
  installations: Installation[]
  isCurrentMonth: boolean
  isToday: boolean
}

const InstallationCard = ({ installation, onUpdateDate }: { 
  installation: Installation
  onUpdateDate: (id: string, newDate: string) => void 
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'installation',
    item: { id: installation.id, currentDate: installation.estimated_install_date },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag as any}
      className={`p-2 mb-1 rounded-lg text-xs cursor-move transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${
        installation.status === 'completed' 
          ? 'bg-green-600/20 border border-green-500/30 text-green-300'
          : installation.status === 'pending'
          ? 'bg-yellow-600/20 border border-yellow-500/30 text-yellow-300'
          : 'bg-red-600/20 border border-red-500/30 text-red-300'
      }`}
    >
      <div className="font-medium truncate">{installation.intersection_name}</div>
      <div className="text-xs opacity-75">{installation.end_user}</div>
    </div>
  )
}

const CalendarDay = ({ day, onDrop, onUpdateDate }: { 
  day: CalendarDay
  onDrop: (installationId: string, newDate: string) => void
  onUpdateDate: (installationId: string, newDate: string) => void
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'installation',
    drop: (item: { id: string; currentDate: string }) => {
      const newDate = day.date.toISOString().split('T')[0]
      if (item.currentDate !== newDate) {
        onDrop(item.id, newDate)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  return (
    <div
      ref={drop as any}
      className={`min-h-[120px] p-2 border border-gray-600 ${
        day.isCurrentMonth ? 'bg-gray-800' : 'bg-gray-900'
      } ${day.isToday ? 'ring-2 ring-blue-500' : ''} ${
        isOver ? 'bg-blue-600/20' : ''
      }`}
    >
      <div className={`text-sm font-medium mb-2 ${
        day.isCurrentMonth ? 'text-white' : 'text-gray-500'
      } ${day.isToday ? 'text-blue-400' : ''}`}>
        {day.date.getDate()}
      </div>
      <div className="space-y-1">
        {day.installations.map((installation) => (
          <InstallationCard
            key={installation.id}
            installation={installation}
            onUpdateDate={onUpdateDate}
          />
        ))}
      </div>
    </div>
  )
}

export default function InstallationCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [installations, setInstallations] = useState<Installation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchInstallations()
  }, [])

  const fetchInstallations = async () => {
    try {
      const { data, error } = await supabase
        .from('installations')
        .select('*')
        .order('estimated_install_date', { ascending: true })

      if (error) throw error
      setInstallations(data || [])
    } catch (error) {
      console.error('Error fetching installations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateInstallationDate = async (id: string, newDate: string) => {
    try {
      const { error } = await supabase
        .from('installations')
        .update({ 
          estimated_install_date: newDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      setInstallations(prev => 
        prev.map(inst => 
          inst.id === id ? { ...inst, estimated_install_date: newDate } : inst
        )
      )
    } catch (error) {
      console.error('Error updating installation date:', error)
    }
  }

  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const firstDayOfCalendar = new Date(firstDayOfMonth)
    firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfMonth.getDay())
    
    const days: CalendarDay[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(firstDayOfCalendar)
      date.setDate(firstDayOfCalendar.getDate() + i)
      
      const dayInstallations = installations.filter(inst => {
        const instDate = new Date(inst.estimated_install_date)
        instDate.setHours(0, 0, 0, 0)
        return instDate.getTime() === date.getTime()
      })
      
      days.push({
        date,
        installations: dayInstallations,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.getTime() === today.getTime()
      })
    }
    
    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getStatusCounts = () => {
    const completed = installations.filter(inst => inst.status === 'completed').length
    const pending = installations.filter(inst => inst.status === 'pending').length
    const cancelled = installations.filter(inst => inst.status === 'cancelled').length
    return { completed, pending, cancelled }
  }

  const statusCounts = getStatusCounts()

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-dark-300">Loading calendar...</span>
        </div>
      </div>
    )
  }

  const calendarDays = getCalendarDays()
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="card">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-semibold text-white">Installation Calendar</h2>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <CheckCircleIcon className="h-4 w-4 text-green-400" />
                <span className="text-dark-300">{statusCounts.completed} Completed</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-4 w-4 text-yellow-400" />
                <span className="text-dark-300">{statusCounts.pending} Pending</span>
              </div>
              <div className="flex items-center space-x-1">
                <XCircleIcon className="h-4 w-4 text-red-400" />
                <span className="text-dark-300">{statusCounts.cancelled} Cancelled</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToToday}
              className="btn-secondary text-sm"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
            >
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Month/Year Display */}
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-600 rounded-lg overflow-hidden">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="bg-gray-700 p-3 text-center">
              <span className="text-sm font-medium text-gray-300">{day}</span>
            </div>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map((day, index) => (
            <CalendarDay
              key={index}
              day={day}
              onDrop={updateInstallationDate}
              onUpdateDate={updateInstallationDate}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-600/20 border border-green-500/30 rounded"></div>
            <span className="text-gray-300">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-600/20 border border-yellow-500/30 rounded"></div>
            <span className="text-gray-300">Pending</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-600/20 border border-red-500/30 rounded"></div>
            <span className="text-gray-300">Cancelled</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center text-sm text-gray-400">
          <p>Drag and drop installation cards to reschedule them to different dates</p>
        </div>
      </div>
    </DndProvider>
  )
}
