import { CalendarHeader } from "../components/calendar-header";
import { Outlet, useNavigate } from "react-router-dom";
import {
  GoogleCalendarProvider,
  useGoogleCalendarContext,
} from "../lib/GoogleCalendarContext";
import {
  CalendarSettingsProvider,
  useCalendarSettingsContext,
} from "../lib/CalendarSettingsContext";
import { EventDialog } from "../components/event-dialog";
import { EventDetailsDialog } from "../components/event-details-dialog";
import { useContextMenuManager } from "@/ContextMenuManager";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ContextMenuItem {
  id: string;
  type: string;
  label?: string;
  items?: ContextMenuItem[];
  onClick?: () => void;
  className?: string;
}

// Create a wrapper component that uses the context
function CalendarContent() {
  const { dispatch, state } = useContextMenuManager();
  const {
    is24HourFormat,
    setIs24HourFormat,
    weekStart,
    setWeekStart,
    defaultDuration,
    setDefaultDuration,
    bgOpacity,
    setBgOpacity,
  } = useCalendarSettingsContext();
  const { fetchEvents } = useGoogleCalendarContext();
  const navigate = useNavigate();

  // Separate effect for initial menu setup
  useEffect(() => {
    const existingItems = (state as { items?: ContextMenuItem[] }).items || [];
    const hasSeparator = existingItems.some(
      (item: ContextMenuItem) => item.id === "calendar-seperator"
    );
    const hasSettings = existingItems.some(
      (item: ContextMenuItem) => item.id === "calendar-settings"
    );
    const hasRefresh = existingItems.some(
      (item: ContextMenuItem) => item.id === "calendar-refresh"
    );
    const hasMonthly = existingItems.some(
      (item: ContextMenuItem) => item.id === "calendar-monthly"
    );

    if (!hasSeparator) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: "calendar-seperator",
          type: "separator",
        },
      });
    }

    if (!hasRefresh) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: "calendar-refresh",
          type: "item",
          label: "Refresh Events",
          onClick: () => {
            console.log("Refreshing events");
            fetchEvents();
            console.log("Events refreshed");
          },
        },
      });
    }

    if (!hasSettings) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: "calendar-settings",
          type: "submenu",
          label: "Settings",
          items: [
            {
              id: "calendar-settings-general",
              type: "submenu",
              label: "Time Format",
              items: [
                {
                  id: "calendar-settings-general-12-hour",
                  type: "item",
                  label: "12 Hour",
                  onClick: () => setIs24HourFormat(false),
                  className: cn(!is24HourFormat && "bg-accent"),
                },
                {
                  id: "calendar-settings-general-24-hour",
                  type: "item",
                  label: "24 Hour",
                  onClick: () => setIs24HourFormat(true),
                  className: cn(is24HourFormat && "bg-accent"),
                },
              ],
            },
            {
              id: "calendar-settings-week-start",
              type: "submenu",
              label: "Week Start",
              items: [
                {
                  id: "calendar-settings-week-start-sunday",
                  type: "item",
                  label: "Sunday",
                  onClick: () => setWeekStart("sunday"),
                  className: weekStart === "sunday" ? "bg-accent" : "",
                },
                {
                  id: "calendar-settings-week-start-monday",
                  type: "item",
                  label: "Monday",
                  onClick: () => setWeekStart("monday"),
                  className: weekStart === "monday" ? "bg-accent" : "",
                },
                {
                  id: "calendar-settings-week-start-saturday",
                  type: "item",
                  label: "Saturday",
                  onClick: () => setWeekStart("saturday"),
                  className: weekStart === "saturday" ? "bg-accent" : "",
                },
              ],
            },
            {
              id: "calendar-settings-default-duration",
              type: "submenu",
              label: "Default Duration",
              items: [
                {
                  id: "calendar-settings-default-duration-30",
                  type: "item",
                  label: "30 Minutes",
                  onClick: () => setDefaultDuration(30),
                  className: defaultDuration === 30 ? "bg-accent" : "",
                },
                {
                  id: "calendar-settings-default-duration-60",
                  type: "item",
                  label: "60 Minutes",
                  onClick: () => setDefaultDuration(60),
                  className: defaultDuration === 60 ? "bg-accent" : "",
                },
              ],
            },
            {
              id: "calendar-settings-default-bg-opacity",
              type: "submenu",
              label: "Background Opacity",
              items: Array.from({ length: 101 }, (_, i) => {
                const value = i / 100;
                return {
                  id: `calendar-settings-default-bg-opacity-${i}`,
                  type: "item",
                  label: `${i}%`,
                  onClick: () => setBgOpacity(value),
                  className: bgOpacity === value ? "bg-accent" : "",
                };
              }),
            },
          ],
        },
      });
    }

    if (!hasMonthly) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: "calendar-monthly",
          type: "item",
          label: "Calendar",
          onClick: () => {
            navigate("/calendar/monthly");
          },
        },
      });
    }

    return () => {
      const calendarItemIds = [
        "calendar-seperator",
        "calendar-refresh",
        "calendar-settings",
        "calendar-settings-general",
        "calendar-settings-week-start",
        "calendar-settings-default-duration",
        "calendar-settings-general-12-hour",
        "calendar-settings-general-24-hour",
        "calendar-settings-week-start-sunday",
        "calendar-settings-week-start-monday",
        "calendar-settings-week-start-saturday",
        "calendar-settings-default-duration-30",
        "calendar-settings-default-duration-60",
        "calendar-settings-default-bg-opacity",
        "calendar-settings-default-bg-opacity-0",
        "calendar-settings-default-bg-opacity-10",
        "calendar-monthly",
      ];

      calendarItemIds.forEach((id) => {
        dispatch({ type: "REMOVE_ITEM", payload: { id } });
      });
    };
  }, [dispatch, fetchEvents]);

  // Separate effect for updating menu item styles
  useEffect(() => {
    const existingItems = (state as { items?: ContextMenuItem[] }).items || [];
    const settingsItem = existingItems.find(
      (item: ContextMenuItem) => item.id === "calendar-settings"
    );

    if (settingsItem?.items) {
      // Update time format items
      const timeFormatSubmenu = settingsItem.items.find(
        (item) => item.id === "calendar-settings-general"
      );
      if (timeFormatSubmenu?.items) {
        timeFormatSubmenu.items[0].className = cn(
          !is24HourFormat && "bg-accent"
        );
        timeFormatSubmenu.items[1].className = cn(
          is24HourFormat && "bg-accent"
        );
      }

      // Update week start items
      const weekStartSubmenu = settingsItem.items.find(
        (item) => item.id === "calendar-settings-week-start"
      );
      if (weekStartSubmenu?.items) {
        weekStartSubmenu.items.forEach((item) => {
          item.className =
            item.id === `calendar-settings-week-start-${weekStart}`
              ? "bg-accent"
              : "";
        });
      }

      // Update duration items
      const durationSubmenu = settingsItem.items.find(
        (item) => item.id === "calendar-settings-default-duration"
      );
      if (durationSubmenu?.items) {
        durationSubmenu.items.forEach((item) => {
          item.className =
            item.id === `calendar-settings-default-duration-${defaultDuration}`
              ? "bg-accent"
              : "";
        });
      }
    }
  }, [is24HourFormat, weekStart, defaultDuration, state]);

  return (
    <div className="px-5 py-5 flex flex-col gap-5 z-20">
      <CalendarHeader />
      <Outlet />
      <EventDialog />
      <EventDetailsDialog />
    </div>
  );
}

// Main layout component that provides the context
export default function CalendarLayout() {
  return (
    <CalendarSettingsProvider>
      <GoogleCalendarProvider>
        <CalendarContent />
      </GoogleCalendarProvider>
    </CalendarSettingsProvider>
  );
}
