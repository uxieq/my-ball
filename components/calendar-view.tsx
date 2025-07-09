'use client'

import { useState } from "react"
import { addMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  })

  const previousMonth = () => setCurrentDate(date => addMonths(date, -1))
  const nextMonth = () => setCurrentDate(date => addMonths(date, 1))

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-2 font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-sm">
        {days.map((day, dayIdx) => (
          <button
            key={day.toString()}
            type="button"
            onClick={() => setSelectedDate(day)}
            className={cn(
              "aspect-square rounded-lg p-2 hover:bg-gray-100 relative",
              !isSameMonth(day, currentDate) && "text-gray-400",
              isSameDay(day, selectedDate!) && "bg-black text-white hover:bg-black/90",
              isToday(day) && !isSameDay(day, selectedDate!) && "text-blue-600 font-semibold"
            )}
          >
            <time dateTime={format(day, 'yyyy-MM-dd')}>
              {format(day, 'd')}
            </time>
            {dayIdx % 3 === 0 && isSameMonth(day, currentDate) && (
              <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {selectedDate && (
        <div className="mt-6 space-y-2">
          <h3 className="font-medium">Available time slots</h3>
          <div className="grid grid-cols-2 gap-2">
            {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time) => (
              <Button
                key={time}
                variant="outline"
                className="w-full justify-start font-normal"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

