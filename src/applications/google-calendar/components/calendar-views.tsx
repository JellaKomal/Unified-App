"use client";

import { useCalendarStore } from "@/applications/calendar/lib/calendar-store";

import { motion, AnimatePresence } from "framer-motion";
import { DayView } from "./view-wise/day-view";
import { WeekView } from "./view-wise/week-view";
import { MonthView } from "./view-wise/month-view";
import { AgendaView } from "./view-wise/agenda-view";

export function CalendarViews() {
  const { viewType, calendarViewData } = useCalendarStore();

  return (
    <div className="min-h-[600px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={viewType}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {viewType === "day" && <DayView {...calendarViewData} />}
          {viewType === "week" && <WeekView {...calendarViewData} />}
          {viewType === "month" && <MonthView {...calendarViewData} />}
          {viewType === "agenda" && <AgendaView {...calendarViewData} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
