import { Clock, Video } from 'lucide-react'

interface UserInfoProps {
  name: string
  subtitle: string
}

export function UserInfo({ name, subtitle }: UserInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-medium">{name}</h1>
        <p className="text-sm text-zinc-400">{subtitle}</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Clock className="h-4 w-4" />
          <span>1h</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Video className="h-4 w-4" />
          <span>Cal Video</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span>America/Chicago</span>
        </div>
      </div>
    </div>
  )
}

