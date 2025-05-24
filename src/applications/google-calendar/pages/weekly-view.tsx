"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  formatDateKey,
  generateTimeSlots,
  getEventsForDay,
  getShortDayName,
} from "@/applications/google-calendar/lib/date-utils";
import { useGoogleCalendarContext } from "../lib/GoogleCalendarContext";
import type { RawGoogleEvent } from "../lib/googleCalendarService";
import { useCalendarSettingsContext } from "../lib/CalendarSettingsContext";
import { ScrollWrapper } from "@/components/design-system/scroll-wrapper";
import { useEffect } from "react";
import { useRef } from "react";
import HomePage from "./home-page";

export default function WeeklyView() {
  const { getWeekDates, currentDate, events } = useGoogleCalendarContext();
  const { is24HourFormat, defaultDuration } = useCalendarSettingsContext();
  const weeksDates = getWeekDates(currentDate);
  const timeSlots = generateTimeSlots(true, defaultDuration);

  const getEventPosition = (
    event: RawGoogleEvent
  ): { top: number; height: number } => {
    if (event.start.date) {
      return { top: 0, height: 30 };
    }

    const startHour = Number.parseInt(
      event.start?.dateTime?.split("T")[1].split(":")[0] || "0"
    );
    const startMinute = Number.parseInt(
      event.start?.dateTime?.split("T")[1].split(":")[1] || "0"
    );
    const endHour = Number.parseInt(
      event.end?.dateTime?.split("T")[1].split(":")[0] || "0"
    );
    const endMinute = Number.parseInt(
      event.end?.dateTime?.split("T")[1].split(":")[1] || "0"
    );
    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;
    const durationInMinutes = endInMinutes - startInMinutes;

    // Each hour is 60px tall
    const top = (startInMinutes / defaultDuration) * 60;
    const height = (durationInMinutes / defaultDuration) * 60;

    return { top, height };
  };

  const getEventTimeDisplay = (event: RawGoogleEvent): string => {
    if (event.start.date) {
      return "All day";
    }

    if (!event.start.dateTime) {
      return "";
    }

    if (!event.end.dateTime) {
      return "";
    }

    const startHour = Number.parseInt(
      event.start.dateTime.split("T")[1].split(":")[0]
    );
    const startMinute = Number.parseInt(
      event.start.dateTime.split("T")[1].split(":")[1]
    );
    const endHour = Number.parseInt(
      event.end.dateTime.split("T")[1].split(":")[0]
    );
    const endMinute = Number.parseInt(
      event.end.dateTime.split("T")[1].split(":")[1]
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

  const getEventColor = (event: RawGoogleEvent): string => {
    if (event.colorId) {
      return `bg-[var(--event${event.colorId})]`;
    }
    return "bg-primary/10";
  };

  const currentTimeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the red line on mount
  useEffect(() => {
    if (currentTimeRef.current) {
      currentTimeRef.current.scrollIntoView({
        behavior: "auto", // or "smooth"
        block: "center",
      });
    }
  }, []);

  return (
    <>
      <HomePage className="opacity-10" />
      <div className="flex flex-col">
        <div className="grid grid-cols-8 border-b mr-1">
          <div className="p-2 border-r text-sm font-medium">All day</div>
          {weeksDates.map((date, index) => {
            const dayEvents = getEventsForDay(date, events);
            const allDayEvents = dayEvents.filter((e) => e.start.date);
            const isToday = new Date().toDateString() === date.toDateString();
            const dateKey = formatDateKey(date);

            return (
              <div
                key={index}
                className={cn(
                  "p-1 min-h-[60px] border-r relative",
                  isToday && "bg-primary/5 "
                )}
                data-date={dateKey}
              >
                {allDayEvents.map((event) => {
                  // Get the start and end dates of the event
                  const eventStart = new Date(event.start.date || "");
                  const eventEnd = new Date(event.end.date || "");
                  eventEnd.setDate(eventEnd.getDate() - 1); // Adjust for exclusive end date

                  // Calculate the position and width based on the event's span
                  // const weekStart = new Date(weeksDates[0]);
                  // const weekEnd = new Date(weeksDates[6]);
                  const isFirstDay = eventStart <= date;
                  const isLastDay = eventEnd >= date;
                  const isMultiDay = eventStart < eventEnd;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "text-xs p-1 mb-1 rounded cursor-pointer text-primary",
                        getEventColor(event),
                        isMultiDay && "relative",
                        isFirstDay && "rounded-l-none",
                        isLastDay && "rounded-r-none"
                      )}
                      style={{
                        marginLeft: isFirstDay ? 0 : -8,
                        marginRight: isLastDay ? 0 : -8,
                        zIndex: isMultiDay ? 1 : 0,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // onEventClick(event);
                      }}
                      draggable
                    >
                      <div className="font-medium truncate">
                        {isFirstDay ? event.summary : ""}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Week header */}
        <div className="grid grid-cols-8 border-b mr-1">
          <div className="p-2 border-r"></div>
          {weeksDates.map((date, index) => {
            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <div
                key={index}
                className={cn(
                  "p-2 border-r text-center",
                  isToday && "bg-primary/5 "
                )}
              >
                <div className="font-medium">
                  {getShortDayName(date.getDay())}
                </div>
                <div
                  className={cn(
                    "text-2xl",
                    isToday &&
                      "bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                  )}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        <ScrollWrapper className="h-[calc(100vh-16rem)]">
          {/* Time grid */}
          <div className="grid grid-cols-8 relative">
            {/* Time labels */}
            <div className="border-r">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="h-[60px] border-b text-xs text-right pr-2"
                >
                  <span className="bg-primary/5 px-1">{slot.label}</span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weeksDates.map((date) => {
              const dayEvents = getEventsForDay(date, events);
              // const allDayEvents = dayEvents.filter((e) => e.start.date);
              const timedEvents = dayEvents.filter((e) => !e.start.date);
              const isToday = new Date().toDateString() === date.toDateString();
              const dateKey = formatDateKey(date);

              return (
                <div
                  key={dateKey}
                  className={cn(
                    "border-r relative ",
                    isToday && "bg-primary/5 "
                  )}
                  // onClick={() => onAddEvent(date)}
                  // onDragOver={(e) => handleDragOver(e)}
                  // onDrop={(e) => handleDrop(e, date)}
                  data-date={dateKey}
                >
                  {timeSlots.map((_, slotIndex) => (
                    <div key={slotIndex} className="h-[60px] border-b" />
                  ))}

                  {isToday && (
                    <div
                      ref={currentTimeRef}
                      className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
                      style={{
                        top: `${
                          ((new Date().getHours() * 60 +
                            new Date().getMinutes()) /
                            60) *
                          60
                        }px`,
                      }}
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500 -mt-1 -ml-1"></div>
                    </div>
                  )}

                  {timedEvents.map((event) => {
                    const { top, height } = getEventPosition(event);
                    return (
                      <motion.div
                        // key={event.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "absolute left-1 right-1 text-xs p-1 rounded cursor-pointer overflow-hidden text-primary",
                          getEventColor(event)
                        )}
                        style={{
                          top: `${top}px`,
                          height: `${Math.max(height, 20)}px`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // onEventClick(event);
                        }}
                        draggable
                        // onDragStart={(e) => handleDragStart(e, event)}
                      >
                        <div className="font-medium truncate">
                          {event.summary}
                        </div>
                        {height > 30 && (
                          <div className="truncate">
                            {getEventTimeDisplay(event)}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </ScrollWrapper>
      </div>
    </>
  );
}
