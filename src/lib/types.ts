export interface CalendarEvent {
  id: string
  title: string
  date: Date
  startTime: string
  endTime: string
  color: "yellow" | "green" | "purple" | "red" | "blue"
  description?: string
  location?: string
  allDay?: boolean
  timezone?: string
  recurrence?: string
}

export interface EventData {
  [dateKey: string]: CalendarEvent[]
}

export type ViewType = "day" | "week" | "month" | "agenda"

export interface DayData {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
}

export interface WeekData {
  days: DayData[]
}

export interface MonthData {
  weeks: WeekData[]
}

export interface CalendarViewData {
  currentDate: Date
  events: EventData
  monthData: MonthData
  is24HourFormat: boolean
  onEventClick: (event: CalendarEvent) => void
  onAddEvent: (date: Date) => void
}

export interface TimeSlot {
  hour: number
  minute: number
  label: string
}

export type ThemeType = "light" | "dark" | "system"
export type PrimaryColorType = "blue" | "green" | "purple" | "red" | "orange"
export type WeekStartsOnType = "monday" | "sunday" | "saturday"
