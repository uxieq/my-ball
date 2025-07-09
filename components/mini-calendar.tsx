'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, format } from 'date-fns'

interface MiniCalendarProps {
  weekStart: Date;
  onDateSelect: (date: Date) => void;
  availableDays: Date[];
}

export function MiniCalendar({ weekStart, onDateSelect, availableDays }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(weekStart))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    setCurrentMonth(startOfMonth(weekStart))
  }, [weekStart])

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  })

  const previousMonth = () => setCurrentMonth(prevMonth => addDays(prevMonth, -30))
  const nextMonth = () => setCurrentMonth(prevMonth => addDays(prevMonth, 30))

  const isDateAvailable = (date: Date) => availableDays.some(availableDate => 
    isSameDay(availableDate, date)
  )

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateSelect(date)
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
          <div key={day} className="py-1 text-zinc-400">
            {day}
          </div>
        ))}
        {days.map((day, dayIdx) => {
          const isAvailable = isDateAvailable(day)
          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              className={`rounded-md py-1 transition-colors duration-200 ${
                !isSameMonth(day, currentMonth) ? 'text-zinc-600' :
                isSameDay(day, selectedDate!) ? 'bg-white text-black' :
                isToday(day) ? 'text-blue-500 font-semibold' :
                'hover:bg-zinc-800'
              } ${isAvailable ? 'bg-green-800/20' : ''}`}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}

