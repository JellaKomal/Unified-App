import type { EventData, CalendarEvent } from "./types"
import { formatDateKey } from "../applications/google-calendar/lib/date-utils"

// Export to JSON
export function exportToJSON(events: EventData): string {
  // Convert Date objects to ISO strings for JSON serialization
  const serializedEvents: Record<string, any[]> = {}

  Object.entries(events).forEach(([dateKey, dateEvents]) => {
    serializedEvents[dateKey] = dateEvents.map((event) => ({
      ...event,
      date: event.date.toISOString(),
    }))
  })

  return JSON.stringify(serializedEvents, null, 2)
}

// Import from JSON
export function importFromJSON(jsonData: string): EventData {
  try {
    const parsedData = JSON.parse(jsonData)
    const importedEvents: EventData = {}

    Object.entries(parsedData).forEach(([dateKey, dateEvents]: [string, any[]]) => {
      importedEvents[dateKey] = dateEvents.map((event) => ({
        ...event,
        date: new Date(event.date),
        id: event.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
      }))
    })

    return importedEvents
  } catch (error) {
    console.error("Error parsing JSON:", error)
    throw new Error("Invalid JSON format")
  }
}

// Export to iCalendar
export function exportToICalendar(events: EventData): string {
  const icalContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//FullEventCalendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ]

  // Flatten events
  const allEvents = Object.values(events).flat()

  allEvents.forEach((event) => {
    const eventDate = event.date
    const startDate = new Date(eventDate)
    const endDate = new Date(eventDate)

    if (!event.allDay) {
      const [startHour, startMinute] = event.startTime.split(":").map(Number)
      const [endHour, endMinute] = event.endTime.split(":").map(Number)

      startDate.setHours(startHour, startMinute, 0)
      endDate.setHours(endHour, endMinute, 0)
    }

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    }

    icalContent.push("BEGIN:VEVENT")
    icalContent.push(`UID:${event.id}@fulleventcalendar.com`)
    icalContent.push(`DTSTAMP:${formatDate(new Date())}`)
    icalContent.push(`DTSTART:${formatDate(startDate)}`)
    icalContent.push(`DTEND:${formatDate(endDate)}`)
    icalContent.push(`SUMMARY:${event.title}`)

    if (event.description) {
      icalContent.push(`DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`)
    }

    if (event.location) {
      icalContent.push(`LOCATION:${event.location}`)
    }

    if (event.recurrence && event.recurrence !== "none") {
      icalContent.push(`RRULE:${event.recurrence}`)
    }

    icalContent.push("END:VEVENT")
  })

  icalContent.push("END:VCALENDAR")

  return icalContent.join("\r\n")
}

// Import from iCalendar
export function importFromICalendar(icalData: string): EventData {
  const importedEvents: EventData = {}

  try {
    // Simple parsing of iCalendar format
    const lines = icalData.split(/\r\n|\n|\r/)
    let currentEvent: Partial<CalendarEvent> | null = null

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line === "BEGIN:VEVENT") {
        currentEvent = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          color: "blue",
        }
      } else if (line === "END:VEVENT" && currentEvent) {
        if (currentEvent.date && currentEvent.title) {
          const dateKey = formatDateKey(currentEvent.date)

          if (!importedEvents[dateKey]) {
            importedEvents[dateKey] = []
          }

          importedEvents[dateKey].push(currentEvent as CalendarEvent)
        }
        currentEvent = null
      } else if (currentEvent) {
        const [key, value] = line.split(":")

        if (key === "SUMMARY") {
          currentEvent.title = value
        } else if (key === "DESCRIPTION") {
          currentEvent.description = value.replace(/\\n/g, "\n")
        } else if (key === "LOCATION") {
          currentEvent.location = value
        } else if (key === "DTSTART") {
          const date = parseICalDate(value)
          currentEvent.date = date

          // Extract time
          if (!value.includes("VALUE=DATE")) {
            const hours = date.getHours()
            const minutes = date.getMinutes()
            currentEvent.startTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
            currentEvent.allDay = false
          } else {
            currentEvent.startTime = "00:00"
            currentEvent.allDay = true
          }
        } else if (key === "DTEND") {
          const date = parseICalDate(value)

          // Extract time
          if (!value.includes("VALUE=DATE")) {
            const hours = date.getHours()
            const minutes = date.getMinutes()
            currentEvent.endTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
          } else {
            currentEvent.endTime = "23:59"
          }
        } else if (key === "RRULE") {
          currentEvent.recurrence = value
        }
      }
    }

    return importedEvents
  } catch (error) {
    console.error("Error parsing iCalendar:", error)
    throw new Error("Invalid iCalendar format")
  }
}

// Helper function to parse iCalendar date format
function parseICalDate(dateStr: string): Date {
  // Handle basic format: 20220101T120000Z
  const cleanDateStr = dateStr.replace("Z", "")

  if (cleanDateStr.includes("T")) {
    // Date with time
    const [datePart, timePart] = cleanDateStr.split("T")

    const year = Number.parseInt(datePart.substring(0, 4))
    const month = Number.parseInt(datePart.substring(4, 6)) - 1
    const day = Number.parseInt(datePart.substring(6, 8))

    const hour = Number.parseInt(timePart.substring(0, 2))
    const minute = Number.parseInt(timePart.substring(2, 4))
    const second = timePart.length >= 6 ? Number.parseInt(timePart.substring(4, 6)) : 0

    return new Date(year, month, day, hour, minute, second)
  } else {
    // Date only
    const year = Number.parseInt(cleanDateStr.substring(0, 4))
    const month = Number.parseInt(cleanDateStr.substring(4, 6)) - 1
    const day = Number.parseInt(cleanDateStr.substring(6, 8))

    return new Date(year, month, day)
  }
}
