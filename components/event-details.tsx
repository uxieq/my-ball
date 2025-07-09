import { Clock, MapPin } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function EventDetails() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback>OW</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">Oliver Wilson</h2>
          <p className="text-sm text-gray-500">Pine Realty</p>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold">Property Viewing</h3>
        <p className="mt-2 text-gray-600">
          Tour your potential dream home with our experienced real estate professionals.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700">120 mins</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700">Pine Realty Office, Australia/Sydney</span>
        </div>
      </div>
    </div>
  )
}

