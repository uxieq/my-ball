import { ChevronLeft, ChevronRight, Calendar, Grid, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

interface CalendarHeaderProps {
  is24Hour: boolean;
  onToggleTimeFormat: () => void;
  weekStart: Date;
  onWeekChange: (newWeekStart: Date) => void;
}

export function CalendarHeader({ is24Hour, onToggleTimeFormat, weekStart, onWeekChange }: CalendarHeaderProps) {
  const moveDay = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(newWeekStart.getDate() + (direction === 'next' ? 1 : -1));
    onWeekChange(newWeekStart);
  };

  const formatWeekRange = (start: Date) => {
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => moveDay('prev')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-sm font-medium transition-all duration-300 ease-in-out">
          {formatWeekRange(weekStart)}
        </h2>
        <Button variant="ghost" size="icon" onClick={() => moveDay('next')}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Overlay my calendar</span>
          <Switch />
        </div>
        <div className="flex items-center gap-2 rounded-md bg-zinc-800 p-1">
          <Button variant="ghost" size="sm" className={!is24Hour ? "bg-zinc-700" : ""}>
            12h
          </Button>
          <Button variant="ghost" size="sm" className={is24Hour ? "bg-zinc-700" : ""} onClick={onToggleTimeFormat}>
            24h
          </Button>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

