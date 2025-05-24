"use client"

import type React from "react"

import { useState } from "react"
import type { CalendarEvent } from "@/lib/types"
import { useEventStore } from "@/lib/event-store"

export function useDraggable() {
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null)
  const { saveEvent } = useEventStore()

  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    setDraggedEvent(event)
    e.dataTransfer.setData("text/plain", event.id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, date: Date, allDay = false) => {
    e.preventDefault()

    if (!draggedEvent) return

    // Create a new event with the updated date
    const updatedEvent: CalendarEvent = {
      ...draggedEvent,
      date: new Date(date),
      allDay: allDay || draggedEvent.allDay,
    }

    // Save the updated event
    saveEvent(updatedEvent)
    setDraggedEvent(null)
  }

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
  }
}
