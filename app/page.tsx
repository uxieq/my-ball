'use client'

import { useState } from 'react'
import { WeekView } from '@/components/week-view'
import { MiniCalendar } from '@/components/mini-calendar'
import { CalendarHeader } from '@/components/calendar-header'
import { UserInfo } from '@/components/user-info'

export default function CalendarPage() {
  const [is24Hour, setIs24Hour] = useState(false)
  const [weekStart, setWeekStart] = useState(new Date(2024, 11, 22)) // Start with Dec 22, 2024

  const handleWeekChange = (newWeekStart: Date) => {
    setWeekStart(newWeekStart)
  }

  return (
    <div className="flex h-screen bg-zinc-900 text-zinc-100">
      <aside className="w-64 border-r border-zinc-800 p-4">
        <UserInfo 
          name="kasey"
          subtitle="for just an hour"
        />
        <MiniCalendar />
      </aside>
      <main className="flex-1">
        <CalendarHeader 
          is24Hour={is24Hour}
          onToggleTimeFormat={() => setIs24Hour(!is24Hour)}
          weekStart={weekStart}
          onWeekChange={handleWeekChange}
        />
        <WeekView 
          is24Hour={is24Hour} 
          snapInterval={30}
          weekStart={weekStart}
          onWeekChange={handleWeekChange}
        />
      </main>
    </div>
  )
}

