import { create } from "zustand"
import type { CalendarEvent, EventData } from "@/lib/types"
import { EVENTS_DATA } from "@/lib/data"
import { formatDateKey } from "@/applications/google-calendar/lib/date-utils"

interface EventState {
  events: EventData
  selectedDate: Date | null
  selectedEvent: CalendarEvent | null
  isAddEventDialogOpen: boolean
  isEventDetailsDialogOpen: boolean
  isImportExportDialogOpen: boolean
  isSettingsDialogOpen: boolean

  // Actions
  openAddEventDialog: () => void
  closeAddEventDialog: () => void
  openEventDetailsDialog: () => void
  closeEventDetailsDialog: () => void
  openImportExportDialog: () => void
  closeImportExportDialog: () => void
  openSettingsDialog: () => void
  closeSettingsDialog: () => void
  handleEventClick: (event: CalendarEvent) => void
  handleAddEvent: (date: Date) => void
  saveEvent: (event: CalendarEvent) => void
  deleteEvent: (eventId: string) => void
  importEvents: (importedEvents: EventData) => void
}

export const useEventStore = create<EventState>((set, get) => ({
  events: EVENTS_DATA,
  selectedDate: null,
  selectedEvent: null,
  isAddEventDialogOpen: false,
  isEventDetailsDialogOpen: false,
  isImportExportDialogOpen: false,
  isSettingsDialogOpen: false,

  openAddEventDialog: () =>
    set({
      isAddEventDialogOpen: true,
      selectedDate: new Date(),
      selectedEvent: null,
    }),

  closeAddEventDialog: () =>
    set({
      isAddEventDialogOpen: false,
    }),

  openEventDetailsDialog: () =>
    set({
      isEventDetailsDialogOpen: true,
    }),

  closeEventDetailsDialog: () =>
    set({
      isEventDetailsDialogOpen: false,
    }),

  openImportExportDialog: () =>
    set({
      isImportExportDialogOpen: true,
    }),

  closeImportExportDialog: () =>
    set({
      isImportExportDialogOpen: false,
    }),

  openSettingsDialog: () =>
    set({
      isSettingsDialogOpen: true,
    }),

  closeSettingsDialog: () =>
    set({
      isSettingsDialogOpen: false,
    }),

  handleEventClick: (event) =>
    set({
      selectedEvent: event,
      isEventDetailsDialogOpen: true,
    }),

  handleAddEvent: (date) =>
    set({
      selectedDate: date,
      selectedEvent: null,
      isAddEventDialogOpen: true,
    }),

  saveEvent: (event) => {
    const { events, selectedEvent } = get()
    const updatedEvents = { ...events }
    const dateKey = formatDateKey(event.date)

    if (selectedEvent) {
      // Edit existing event
      const oldDateKey = formatDateKey(selectedEvent.date)

      if (oldDateKey === dateKey) {
        // Same date, just update the event
        updatedEvents[dateKey] = updatedEvents[dateKey].map((e) => (e.id === event.id ? event : e))
      } else {
        // Date changed, remove from old date and add to new date
        updatedEvents[oldDateKey] = updatedEvents[oldDateKey].filter((e) => e.id !== event.id)

        if (!updatedEvents[dateKey]) {
          updatedEvents[dateKey] = []
        }
        updatedEvents[dateKey].push(event)
      }
    } else {
      // Add new event
      if (!updatedEvents[dateKey]) {
        updatedEvents[dateKey] = []
      }
      updatedEvents[dateKey].push(event)
    }

    set({ events: updatedEvents })
  },

  deleteEvent: (eventId) => {
    const { events, selectedEvent } = get()
    if (!selectedEvent) return

    const dateKey = formatDateKey(selectedEvent.date)
    const updatedEvents = { ...events }

    updatedEvents[dateKey] = updatedEvents[dateKey].filter((e) => e.id !== eventId)

    set({ events: updatedEvents })
  },

  importEvents: (importedEvents) => {
    set({ events: { ...get().events, ...importedEvents } })
  },
}))
