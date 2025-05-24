import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useGoogleCalendarContext } from "../lib/GoogleCalendarContext";
import { useCalendarSettingsContext } from "../lib/CalendarSettingsContext";
import type { RawGoogleEvent } from "../lib/googleCalendarService";
import {
  getEventsForDay,
  getMonthName,
  getShortDayName,
} from "../lib/date-utils";
import { ScrollWrapper } from "@/components/design-system/scroll-wrapper";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import HomePage from "./home-page";
export default function MonthlyView() {
  const { monthData, events, setSelectedEvent } = useGoogleCalendarContext();
  const { is24HourFormat, setIsEventDetailsDialogOpen } =
    useCalendarSettingsContext();
  const [openPopoverDay, setOpenPopoverDay] = useState<string | null>(null);

  const getEventTimeDisplay = (event: RawGoogleEvent): string => {
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
  return (
    <>
      <div className="z-20">
        <div className="grid grid-cols-7 gap-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-center py-2 font-medium">
              {day}
            </div>
          ))}
        </div>
        <ScrollWrapper
          childrenClassName="grid grid-cols-7 gap-1 w-full"
          className="w-full h-[calc(100vh-9rem)]"
        >
          {monthData.weeks.flatMap((week: any) =>
            week.days.map((day: any) => {
              const dayEvents = getEventsForDay(day.date, events, 1);

              return (
                <div
                  key={day.date.toISOString()}
                  className={cn(
                    "border min-h-[120px] p-1 relative",
                    !day.isCurrentMonth &&
                      "opacity-50 bg-primary/5 dark:bg-gray-900",
                    day.isToday && "border-primary"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 left-2 font-medium",
                      day.isToday &&
                        "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center -ml-1"
                    )}
                  >
                    {day.date.getDate()}
                  </div>

                  <div className="mt-6 space-y-1">
                    <AnimatePresence>
                      {dayEvents.slice(0, 2).map((event) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          className={cn(
                            "text-xs p-1 rounded cursor-pointer",
                            getEventColor(event)
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                            setIsEventDetailsDialogOpen(true);
                          }}
                          draggable
                        >
                          <div className="font-medium">
                            {event.summary || "Untitled"}
                          </div>
                          <div>{getEventTimeDisplay(event)}</div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {dayEvents.length > 2 && (
                      <Popover
                        open={openPopoverDay === day.date.toISOString()}
                        onOpenChange={(open) => {
                          if (open) {
                            setOpenPopoverDay(day.date.toISOString());
                          } else {
                            setOpenPopoverDay(null);
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <div
                            className="text-xs text-center text-muted-foreground cursor-pointer hover:bg-muted/50 rounded py-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            +{dayEvents.length - 2} more
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-0" align="start">
                          <div className="p-2 border-b">
                            <div className="font-medium">
                              {day.date.getDate()}{" "}
                              {getMonthName(day.date.getMonth())}{" "}
                              {day.date.getFullYear()},
                              {getShortDayName(day.date.getDay())}
                            </div>
                          </div>
                          <div className="max-h-[300px] overflow-y-auto p-1">
                            {dayEvents.map((event) => (
                              <div
                                key={event.id}
                                className={cn(
                                  "text-xs p-2 rounded my-1 cursor-pointer",
                                  getEventColor(event)
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenPopoverDay(null);
                                  setSelectedEvent(event);
                                  setIsEventDetailsDialogOpen(true);
                                }}
                              >
                                <div className="font-medium">
                                  {event.summary}
                                </div>
                                {!event.start.date && (
                                  <div>{getEventTimeDisplay(event)}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </ScrollWrapper>
      </div>
      <HomePage className="opacity-10" />
    </>
  );
}
