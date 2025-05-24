import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useGoogleCalendarContext } from "../lib/GoogleCalendarContext";
import { getEventColor, getEventsForDay } from "../lib/date-utils";
import type { RawGoogleEvent } from "../lib/googleCalendarService";
import { useCalendarSettingsContext } from "../lib/CalendarSettingsContext";
import { ScrollWrapper } from "@/components/design-system/scroll-wrapper";
import HomePage from "./home-page";

export default function DailyView() {
  const { generateTimeSlots, events, currentDate } = useGoogleCalendarContext();
  const { is24HourFormat, defaultDuration } = useCalendarSettingsContext();
  // Generate 30-min interval slots (e.g., 48 slots for 24h)
  const timeSlots = generateTimeSlots(true, defaultDuration);

  // Helper: format dateKey (e.g., "2023-05-24")
  const formatDateKey = (date: Date) => date.toISOString().split("T")[0];

  // Get all events for current day

  const dayEvents = getEventsForDay(currentDate, events);
  const allDayEvents = dayEvents.filter((e) => e.start.date);
  const timedEvents = dayEvents.filter((e) => !e.start.date);
  const dateKey = formatDateKey(currentDate);

  const slotHeight = 60; // px per slot (can be any value you want)
  const totalHeight = timeSlots.length * slotHeight;

  // Calculate event position based on start/end time
  const getEventPosition = (
    event: RawGoogleEvent
  ): { top: number; height: number } => {
    // Parse start/end times
    const [startHourStr, startMinuteStr] = event.start.dateTime
      ?.split("T")[1]
      .split(":") ?? ["00", "00"];
    const [endHourStr, endMinuteStr] = event.end.dateTime
      ?.split("T")[1]
      .split(":") ?? ["00", "00"];
    const startHour = parseInt(startHourStr);
    const startMinute = parseInt(startMinuteStr);
    const endHour = parseInt(endHourStr);
    const endMinute = parseInt(endMinuteStr);

    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;
    const durationInMinutes = endInMinutes - startInMinutes;

    // Each interval is slotHeight px
    const top = (startInMinutes / defaultDuration) * slotHeight;
    let height = (durationInMinutes / defaultDuration) * slotHeight;

    // Clamp height to grid
    if (top + height > totalHeight) {
      height = Math.max(totalHeight - top, 25);
    }

    return { top, height };
  };

  // Format event time display (12h or 24h)
  const getEventTimeDisplay = (event: RawGoogleEvent): string => {
    if (event.start.date) return "All day";

    const [startHourStr, startMinuteStr] = event.start.dateTime
      ?.split("T")[1]
      .split(":") ?? ["00", "00"];
    const [endHourStr, endMinuteStr] = event.end.dateTime
      ?.split("T")[1]
      .split(":") ?? ["00", "00"];

    const startHour = parseInt(startHourStr);
    const startMinute = parseInt(startMinuteStr);
    const endHour = parseInt(endHourStr);
    const endMinute = parseInt(endMinuteStr);

    if (is24HourFormat) {
      const startDisplay = `${startHour
        .toString()
        .padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;
      const endDisplay = `${endHour.toString().padStart(2, "0")}:${endMinute
        .toString()
        .padStart(2, "0")}`;
      return `${startDisplay} - ${endDisplay}`;
    } else {
      const format12h = (h: number, m: number) => {
        const period = h >= 12 ? "PM" : "AM";
        const hour12 = h % 12 || 12;
        return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
      };
      return `${format12h(startHour, startMinute)} - ${format12h(
        endHour,
        endMinute
      )}`;
    }
  };

  // Calculate current time indicator top, clamped
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentTop = (currentMinutes / defaultDuration) * slotHeight;

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
      <div className="flex flex-col z-20">
        {/* All-day events */}
        {allDayEvents.length > 0 && (
          <div className="grid grid-cols-[120px_1fr] border-b mb-2">
            <div className="p-2 border-r text-sm font-medium">All day</div>
            <div
              className="p-1 min-h-[60px]"
              data-all-day="true"
              data-date={dateKey}
            >
              {allDayEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "text-xs p-1 mb-1 rounded cursor-pointer",
                    getEventColor(event)
                  )}
                  draggable
                >
                  <div className="font-medium">{event.summary}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <ScrollWrapper className="h-[calc(100vh-12rwem)]">
          {/* Time grid */}
          <div
            className="grid grid-cols-[120px_1fr] relative pb-10 "
            style={{ height: totalHeight }}
          >
            {/* Time labels */}
            <div className="border-r">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-[60px] text-xs text-right pr-2 ",
                    index !== timeSlots.length - 1 &&
                      "border-b border-b-primary/30 "
                  )}
                >
                  <span className="bg-primary/5 px-1">{slot.label}</span>
                </div>
              ))}
            </div>

            {/* Events column */}
            <div className="relative overflow-hidden " data-date={dateKey}>
              {/* Time grid background */}
              {timeSlots.map((_, index) => (
                <div key={`${index}`}>
                  <div
                    key={`${index}-top`}
                    className={cn(
                      "h-[30px] border ",
                      index !== timeSlots.length - 1 &&
                        (index % 2 === 0
                          ? "border-b border-b-primary/10"
                          : "border-b border-b-primary/10 ")
                    )}
                  />
                  <div
                    key={`${index}-bottom`}
                    className={cn(
                      "h-[30px] ",
                      index !== timeSlots.length - 1 &&
                        (index % 2 === 0
                          ? "border-b border-b-primary/10 "
                          : "border-b border-b-primary/10")
                    )}
                  />
                </div>
              ))}

              {/* Current time indicator */}
              <div
                ref={currentTimeRef}
                className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
                style={{ top: currentTop }}
              >
                <div className="w-2 h-2 rounded-full bg-red-500 -mt-1 -ml-1" />
              </div>

              {/* Timed events */}
              {(() => {
                // Sort events by start time
                const sortedEvents = [...timedEvents].sort((a, b) => {
                  const aStart = a.start.dateTime
                    ? new Date(a.start.dateTime).getTime()
                    : 0;
                  const bStart = b.start.dateTime
                    ? new Date(b.start.dateTime).getTime()
                    : 0;
                  return aStart - bStart;
                });

                // Assign columns for overlapping events
                const columns: RawGoogleEvent[][] = [];
                const eventMeta: {
                  event: RawGoogleEvent;
                  col: number;
                  colCount: number;
                }[] = [];

                sortedEvents.forEach((event) => {
                  const eventStart = event.start.dateTime
                    ? new Date(event.start.dateTime).getTime()
                    : 0;
                  // const eventEnd = event.end.dateTime
                  //   ? new Date(event.end.dateTime).getTime()
                  //   : 0;
                  let placed = false;
                  for (let col = 0; col < columns.length; col++) {
                    const lastInCol = columns[col][columns[col].length - 1];
                    const lastEnd = lastInCol.end.dateTime
                      ? new Date(lastInCol.end.dateTime).getTime()
                      : 0;
                    if (eventStart >= lastEnd) {
                      columns[col].push(event);
                      eventMeta.push({ event, col, colCount: 0 });
                      placed = true;
                      break;
                    }
                  }
                  if (!placed) {
                    columns.push([event]);
                    eventMeta.push({
                      event,
                      col: columns.length - 1,
                      colCount: 0,
                    });
                  }
                });

                // For each event, determine how many columns it overlaps with
                eventMeta.forEach((meta, i) => {
                  const event = meta.event;
                  const eventStart = event.start.dateTime
                    ? new Date(event.start.dateTime).getTime()
                    : 0;
                  const eventEnd = event.end.dateTime
                    ? new Date(event.end.dateTime).getTime()
                    : 0;
                  let maxCol = meta.col;
                  for (let j = 0; j < eventMeta.length; j++) {
                    if (i === j) continue;
                    const other = eventMeta[j].event;
                    const otherStart = other.start.dateTime
                      ? new Date(other.start.dateTime).getTime()
                      : 0;
                    const otherEnd = other.end.dateTime
                      ? new Date(other.end.dateTime).getTime()
                      : 0;
                    // If they overlap
                    if (eventStart < otherEnd && eventEnd > otherStart) {
                      maxCol = Math.max(maxCol, eventMeta[j].col);
                    }
                  }
                  meta.colCount = maxCol + 1;
                });

                return eventMeta.map(({ event, col, colCount }) => {
                  const { top, height } = getEventPosition(event);
                  const width = `calc(${100 / colCount}% - 4px)`;
                  const left = `calc(${(100 / colCount) * col}% + 2px)`;
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "absolute text-xs p-2 rounded cursor-pointer",
                        getEventColor(event)
                      )}
                      style={{
                        top: top,
                        height: Math.max(height, 25),
                        width,
                        left,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // onEventClick(event);
                      }}
                      draggable
                    >
                      <div className="font-medium">{event.summary}</div>
                      <div>{getEventTimeDisplay(event)}</div>
                      {height > 60 && event.location && (
                        <div className="mt-1 text-muted-foreground truncate">
                          {event.location}
                        </div>
                      )}
                    </motion.div>
                  );
                });
              })()}
            </div>
          </div>
        </ScrollWrapper>
      </div>
      <HomePage className="opacity-20" />
    </>
  );
}
