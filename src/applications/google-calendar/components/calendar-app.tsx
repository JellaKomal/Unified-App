"use client";

import { useEffect } from "react";
import { useCalendarStore } from "@/applications/calendar/lib/calendar-store";
import { CalendarHeader } from "./calendar-header";
import { CalendarToolbar } from "./calendar-toolbar";
import { CalendarViews } from "./calendar-views";

export function CalendarApp() {
  const { currentDate, setMonthData, generateMonthData } = useCalendarStore();

  useEffect(() => {
    setMonthData(
      generateMonthData(currentDate.getFullYear(), currentDate.getMonth())
    );
  }, [currentDate, setMonthData, generateMonthData]);

  return (
    <div className="px-5 py-5 flex flex-col gap-5">
      <CalendarHeader />

      <CalendarToolbar />

      {/* Calendar Views */}
      <CalendarViews />

      {/* Dialogs */}
      {/* <EventDialog /> */}
      {/* <EventDetailsDialog /> */}
      {/* <ImportExportDialog /> */}
      {/* <SettingsDialog /> */}
    </div>
  );
}
