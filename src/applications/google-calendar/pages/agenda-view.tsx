"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  getEventColor,
  getMonthName,
  getShortDayName,
} from "@/applications/google-calendar/lib/date-utils";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useGoogleCalendarContext } from "../lib/GoogleCalendarContext";
import { useState } from "react";
import type { RawGoogleEvent } from "../lib/googleCalendarService";
import { ScrollWrapper } from "@/components/design-system/scroll-wrapper";
import HomePage from "./home-page";
import { useCalendarSettingsContext } from "../lib/CalendarSettingsContext";

export default function AgendaView() {
  const { events } = useGoogleCalendarContext();
  const { is24HourFormat } = useCalendarSettingsContext();
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>(
    {}
  );
  const toggleDateExpanded = (dateKey: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [dateKey]: !prev[dateKey],
    }));
  };
  const sortedDates = Object.keys(events).sort();

  const getEventTimeDisplay = (event: RawGoogleEvent): string => {
    if (event.start.date) return "All day";

    const startHour = Number.parseInt(
      event.start.dateTime?.split("T")[1].split(":")[0] ?? "00"
    );
    const startMinute = Number.parseInt(
      event.start.dateTime?.split("T")[1].split(":")[1] ?? "00"
    );
    const endHour = Number.parseInt(
      event.end.dateTime?.split("T")[1].split(":")[0] ?? "00"
    );
    const endMinute = Number.parseInt(
      event.end.dateTime?.split("T")[1].split(":")[1] ?? "00"
    );

    let startDisplay = "";
    let endDisplay = "";

    if (is24HourFormat) {
      startDisplay = `${startHour.toString().padStart(2, "0")}:${startMinute
        .toString()
        .padStart(2, "0")}`;
      endDisplay = `${endHour.toString().padStart(2, "0")}:${endMinute
        .toString()
        .padStart(2, "0")}`;
    } else {
      const startPeriod = startHour >= 12 ? "PM" : "AM";
      const endPeriod = endHour >= 12 ? "PM" : "AM";
      const displayStartHour = startHour % 12 || 12;
      const displayEndHour = endHour % 12 || 12;

      startDisplay = `${displayStartHour}:${startMinute
        .toString()
        .padStart(2, "0")} ${startPeriod}`;
      endDisplay = `${displayEndHour}:${endMinute
        .toString()
        .padStart(2, "0")} ${endPeriod}`;
    }

    return `${startDisplay} - ${endDisplay}`;
  };

  return (
    <>
      <HomePage className="opacity-10" />
      <div className="flex flex-col space-y-2">
        {sortedDates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No events to display
          </div>
        ) : (
          <ScrollWrapper
            className="h-[calc(100vh-7rem)]"
            childrenClassName="flex flex-col gap-2"
          >
            {sortedDates.map((dateKey) => {
              const dateEvents = events[dateKey];
              const isToday = new Date().toDateString() === dateKey;
              const isExpanded = expandedDates[dateKey] !== false;

              return (
                <div
                  key={dateKey}
                  className="border rounded-md overflow-hidden"
                >
                  <div
                    className={cn(
                      "flex items-center justify-between p-3 cursor-pointer",
                      isToday ? "bg-primary/20" : "bg-primary/10"
                    )}
                    onClick={() => toggleDateExpanded(dateKey)}
                  >
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 mr-2"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <span className="font-medium">
                          {getShortDayName(new Date(dateKey).getDay())},{" "}
                        </span>
                        <span>
                          {new Date(dateKey).getDate()}{" "}
                          {getMonthName(new Date(dateKey).getMonth())}{" "}
                          {new Date(dateKey).getFullYear()}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {dateEvents.length} event
                      {dateEvents.length !== 1 ? "s" : ""}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="divide-y">
                      {dateEvents.map((event) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-3 hover:bg-primary/2 cursor-pointer"
                          // onClick={() => onEventClick(event)}
                          draggable
                          // onDragStart={(e) => handleDragStart(e, event)}
                        >
                          <div className="flex items-start">
                            <div
                              className={cn(
                                "w-3 h-10 rounded-md mt-1 mr-3",
                                getEventColor(event)
                              )}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{event.summary}</div>
                              <div className="text-sm text-muted-foreground">
                                {getEventTimeDisplay(event)}
                              </div>
                              {event.location && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  {event.location}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </ScrollWrapper>
        )}
      </div>
    </>
  );
}
