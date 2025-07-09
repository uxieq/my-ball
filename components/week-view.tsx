'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SchedulingModal } from './scheduling-modal'
import { startOfWeek, addDays, isSameDay } from 'date-fns'

interface WeekViewProps {
  is24Hour: boolean;
  snapInterval: number;
  weekStart: Date;
  onWeekChange: (newWeekStart: Date) => void;
  selectedDate: Date | null;
  onAvailableDaysChange: (availableDays: Date[]) => void;
}

export function WeekView({ is24Hour, snapInterval = 30, weekStart, onWeekChange, selectedDate, onAvailableDaysChange }: WeekViewProps) {
  const [hoveredSlot, setHoveredSlot] = useState<{ day: number; time: Date } | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{ day: number; startTime: Date; endTime: Date } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const hours = Array.from({ length: 17 }, (_, i) => i + 7) // 7 AM to 11 PM

  // Sample unavailable hours (you can replace this with your actual data)
  const unavailableHours = {
    0: [9, 10, 11], // Sunday
    1: [13, 14, 15], // Monday
    2: [16, 17], // Tuesday
    3: [12, 13], // Wednesday
    4: [18, 19, 20], // Thursday
    5: [8, 9, 10], // Friday
    6: [21, 22, 23], // Saturday
  }

  useEffect(() => {
    const availableDays = days.map((_, index) => {
      const date = addDays(weekStart, index)
      const isAvailable = hours.some(hour => {
        const startDate = new Date(date)
        startDate.setHours(hour, 0, 0, 0)
        const endDate = new Date(startDate)
        endDate.setHours(hour + 1, 0, 0, 0)
        return isSlotAvailable(startDate, endDate)
      })
      return isAvailable ? date : null
    }).filter((date): date is Date => date !== null)

    onAvailableDaysChange(availableDays)
  }, [weekStart])

  useEffect(() => {
    if (selectedDate) {
      const newWeekStart = startOfWeek(selectedDate)
      if (!isSameDay(newWeekStart, weekStart)) {
        onWeekChange(newWeekStart)
      }
    }
  }, [selectedDate])

  const snapToNearestTime = (y: number, dayIndex: number): Date => {
    const gridRect = gridRef.current?.getBoundingClientRect()
    if (!gridRect) return new Date()

    const cellHeight = 60 // height of each hour cell
    const minutesPerPixel = 60 / cellHeight
    const relativeY = y - gridRect.top - 40 // 40px offset for the day header
    const minutes = Math.round((relativeY * minutesPerPixel) / snapInterval) * snapInterval
    const hours = Math.floor(minutes / 60) + 7 // Add 7 because we start at 7 AM

    const date = new Date(weekStart)
    date.setDate(date.getDate() + dayIndex)
    date.setHours(hours)
    date.setMinutes(minutes % 60)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
  }

  const isSlotAvailable = (startDate: Date, endDate: Date): boolean => {
    const startHour = startDate.getHours()
    const endHour = endDate.getHours()
    const day = startDate.getDay()

    for (let hour = startHour; hour <= endHour; hour++) {
      if (unavailableHours[day as keyof typeof unavailableHours]?.includes(hour)) {
        return false
      }
    }
    return true
  }

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent, dayIndex: number) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const startTime = snapToNearestTime(clientY, dayIndex)
    const endTime = new Date(startTime.getTime() + snapInterval * 60000)
    
    if (isSlotAvailable(startTime, endTime)) {
      setSelectedSlot({ day: dayIndex, startTime, endTime })
      setIsDragging(true)
    }
  }

  const handleInteractionMove = (e: React.MouseEvent | React.TouchEvent, dayIndex: number) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const time = snapToNearestTime(clientY, dayIndex)

    if (isDragging && selectedSlot) {
      const newEndTime = new Date(time.getTime() + snapInterval * 60000)
      if (isSlotAvailable(selectedSlot.startTime, newEndTime) && time > selectedSlot.startTime) {
        setSelectedSlot(prev => prev ? { ...prev, endTime: time } : null)
      }
    } else if (!isDragging) {
      const potentialEndTime = new Date(time.getTime() + snapInterval * 60000)
      if (isSlotAvailable(time, potentialEndTime)) {
        setHoveredSlot({ day: dayIndex, time })
      } else {
        setHoveredSlot(null)
      }
    }
  }

  const handleInteractionEnd = () => {
    setIsDragging(false)
    setHoveredSlot(null)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      handleInteractionEnd()
    }

    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('touchend', handleGlobalMouseUp)

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchend', handleGlobalMouseUp)
    }
  }, [])

  const formatTimeDisplay = (date: Date) => {
    if (is24Hour) {
      return date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    })
  }

  return (
    <>
      <div className="grid h-[calc(100vh-60px)] grid-cols-[auto_1fr] overflow-auto">
        <div className="w-16 border-r border-zinc-800 pt-10">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-b border-zinc-800 px-2 py-1 relative">
              <span className="text-xs text-zinc-500 absolute -top-3 left-2">
                {is24Hour 
                  ? `${hour.toString().padStart(2, '0')}:00`
                  : `${hour % 12 || 12}${hour < 12 ? 'am' : 'pm'}`
                }
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7" ref={gridRef}>
          {days.map((day, dayIndex) => {
            const currentDate = new Date(weekStart)
            currentDate.setDate(currentDate.getDate() + dayIndex)
            const isSelectedDate = selectedDate && isSameDay(currentDate, selectedDate)
            return (
              <div 
                key={day} 
                className={`relative border-r border-zinc-800 last:border-r-0 transition-opacity duration-300 ease-in-out ${
                  isSelectedDate ? 'bg-zinc-800/50' : ''
                }`}
                onMouseDown={(e) => handleInteractionStart(e, dayIndex)}
                onTouchStart={(e) => handleInteractionStart(e, dayIndex)}
                onMouseMove={(e) => handleInteractionMove(e, dayIndex)}
                onTouchMove={(e) => handleInteractionMove(e, dayIndex)}
                onMouseUp={handleInteractionEnd}
                onTouchEnd={handleInteractionEnd}
                onMouseLeave={() => setHoveredSlot(null)}
              >
                <div className="sticky top-0 h-10 border-b border-zinc-800 bg-zinc-900 flex items-center justify-center z-10">
                  <div className="text-xs font-medium">{day} {currentDate.getDate()}</div>
                </div>
                {hours.map((hour) => {
                  const slotDate = new Date(currentDate)
                  slotDate.setHours(hour)
                  const endSlotDate = new Date(slotDate.getTime() + 60 * 60 * 1000)
                  const isAvailable = isSlotAvailable(slotDate, endSlotDate)
                  return (
                    <div
                      key={hour}
                      className={`h-[60px] border-b border-zinc-800 transition-colors duration-300 ease-in-out ${
                        isAvailable ? 'bg-zinc-900/50' : 'bg-zinc-800/50'
                      }`}
                    />
                  )
                })}
                <AnimatePresence>
                  {hoveredSlot && hoveredSlot.day === dayIndex && !isDragging && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-0 right-0 bg-blue-500/20 border-2 border-blue-500 pointer-events-none"
                      style={{
                        top: `${((hoveredSlot.time.getHours() - 7) * 60 + hoveredSlot.time.getMinutes()) + 40}px`,
                        height: '60px'
                      }}
                    >
                      <div className="absolute left-2 top-1 right-2 text-xs text-blue-200">
                        {formatTimeDisplay(hoveredSlot.time)}
                      </div>
                    </motion.div>
                  )}
                  {selectedSlot && selectedSlot.day === dayIndex && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-0 right-0 bg-green-500/20 border-2 border-green-500"
                      style={{
                        top: `${((selectedSlot.startTime.getHours() - 7) * 60 + selectedSlot.startTime.getMinutes()) + 40}px`,
                        height: `${(selectedSlot.endTime.getTime() - selectedSlot.startTime.getTime()) / 60000}px`
                      }}
                    >
                      <div className="absolute left-2 top-1 right-2 text-xs text-green-200">
                        {formatTimeDisplay(selectedSlot.startTime)} - {formatTimeDisplay(selectedSlot.endTime)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
      {selectedSlot && !isDragging && (
        <SchedulingModal
          selectedSlot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          is24Hour={is24Hour}
        />
      )}
    </>
  )
}

