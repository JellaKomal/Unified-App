import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useMemo,
  useEffect,
} from "react";
import {
  fetchGoogleCalendarEvents,
  groupEventsByDateKey,
  type EventsByDateMap,
  type RawGoogleEvent,
  type ViewType,
} from "./googleCalendarService";
import type { Day, TimeSlot, Week } from "./types";
import type { MonthData } from "./types";
import { formatTime, getMonthName } from "./date-utils";
import { useLocation } from "react-router-dom";

interface CalendarContextProps {
  currentDate: Date;
  view: ViewType;
  events: EventsByDateMap;
  isLoading: boolean;
  error: string | null;
  setView: (view: ViewType) => void;
  setDateRange: (start: Date, end: Date) => void;
  refreshEvents: () => void;
  monthData: MonthData;
  navigateNext: () => void;
  navigatePrevious: () => void;
  navigateToday: () => void;
  viewTitle: string;
  generateTimeSlots: (is24Hour: boolean, interval?: number) => TimeSlot[];
  getWeekDates: (date: Date, weekStartsOn?: number) => Date[];
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  selectedEvent: RawGoogleEvent | null;
  setSelectedEvent: (event: RawGoogleEvent | null) => void;
  fetchEvents: () => void;
}

const GoogleCalendarContext = createContext<CalendarContextProps | undefined>(
  undefined
);

export const useGoogleCalendarContext = (): CalendarContextProps => {
  const context = useContext(GoogleCalendarContext);
  if (!context) {
    throw new Error(
      "useGoogleCalendarContext must be used within a GoogleCalendarProvider"
    );
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const GoogleCalendarProvider = ({ children }: Props) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth());

  const location = useLocation();
  const [view, setView] = useState<ViewType>(
    location.pathname.includes("daily")
      ? "daily"
      : location.pathname.includes("weekly")
      ? "weekly"
      : location.pathname.includes("monthly")
      ? "monthly"
      : "agenda"
  );

  useEffect(() => {
    setView(
      location.pathname.includes("daily")
        ? "daily"
        : location.pathname.includes("weekly")
        ? "weekly"
        : location.pathname.includes("monthly")
        ? "monthly"
        : "agenda"
    );
  }, [location.pathname]);

  const [events, setEvents] = useState<EventsByDateMap>(() => {
    // Try to load events from sessionStorage on initial render
    const storedEvents = sessionStorage.getItem("calendarEvents");
    if (storedEvents) {
      try {
        return JSON.parse(storedEvents);
      } catch (e) {
        console.error("Failed to parse stored events:", e);
        return {};
      }
    }
    return {};
  });
  const [selectedEvent, setSelectedEvent] = useState<RawGoogleEvent | null>(
    null
  );
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const viewTitle = useMemo(() => {
    if (view === "weekly") {
      const weekDates = getWeekDates(currentDate);
      const startDate = weekDates[0];
      const endDate = weekDates[6];

      if (startDate.getMonth() === endDate.getMonth()) {
        return `${startDate.getDate()} - ${endDate.getDate()} ${getMonthName(
          startDate.getMonth()
        )} ${startDate.getFullYear()}`;
      } else if (startDate.getFullYear() === endDate.getFullYear()) {
        return `${startDate.getDate()} ${getMonthName(
          startDate.getMonth()
        )} - ${endDate.getDate()} ${getMonthName(
          endDate.getMonth()
        )} ${startDate.getFullYear()}`;
      } else {
        return `${startDate.getDate()} ${getMonthName(
          startDate.getMonth()
        )} ${startDate.getFullYear()} - ${endDate.getDate()} ${getMonthName(
          endDate.getMonth()
        )} ${endDate.getFullYear()}`;
      }
    } else if (view === "daily") {
      return `${currentDate.getDate()} ${getMonthName(
        currentDate.getMonth()
      )} ${currentDate.getFullYear()}`;
    }
    return `${getMonthName(month)} ${year}`;
  }, [view, currentDate, month, year]);

  // Store events in sessionStorage whenever they change
  useEffect(() => {
    if (Object.keys(events).length > 0) {
      sessionStorage.setItem("calendarEvents", JSON.stringify(events));
    }
  }, [events]);

  const fetchEvents = async () => {
    if (!startDate || !endDate) return;
    // Get first day of the month
    const startOfMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      1
    );
    const startDay = startOfMonth.getDay(); // 0 (Sun) to 6 (Sat)

    // Move back to the Sunday before the first day of the month
    const startDateToUse = new Date(startOfMonth);
    startDateToUse.setDate(startDateToUse.getDate() - startDay);

    // Get last day of the month
    const endOfMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    );
    const endDay = endOfMonth.getDay();

    // Move forward to the Saturday after the last day of the month
    const endDateToUse = new Date(endOfMonth);
    endDateToUse.setDate(endDateToUse.getDate() + (6 - endDay));

    setIsLoading(true);
    setError(null);
    try {
      const rawEvents: RawGoogleEvent[] = await fetchGoogleCalendarEvents(
        startDateToUse,
        endDateToUse
      );
      const grouped = groupEventsByDateKey(rawEvents);
      setEvents(grouped);

      // Store the events for this month after successful fetch
      const monthKey = `${startDate.getFullYear()}-${startDate.getMonth()}`;
      sessionStorage.setItem(
        `calendarEvents_${monthKey}`,
        JSON.stringify(grouped)
      );
    } catch (err) {
      setError("Failed to fetch events");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  function generateMonthData(year: number, month: number): MonthData {
    const today = new Date();
    const startOfMonth = new Date(year, month, 0);

    const endOfMonth = new Date(year, month + 1, 0);

    const startDay = startOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    const totalDays = endOfMonth.getDate();

    const days: Day[] = [];

    // Fix: Get last day of previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    // Fill in days from previous month
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
      });
    }

    // Fill in current month
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
      });
    }

    // Fill in days from next month to complete the last week
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const date = new Date(year, month + 1, i);
        days.push({
          date,
          isCurrentMonth: false,
          isToday: isSameDay(date, today),
        });
      }
    }

    // Group into weeks
    const weeks: Week[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push({ days: days.slice(i, i + 7) });
    }

    return { weeks };
  }

  function generateTimeSlots(is24Hour: boolean, interval = 30): TimeSlot[] {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        slots.push({
          hour,
          minute,
          label: formatTime(hour, minute, is24Hour),
        });
      }
    }
    return slots;
  }

  function getWeekDates(date: Date, weekStartsOn = 1): Date[] {
    const result = [];
    const day = date.getDay();
    let diff = day;

    // Adjust for week start
    if (weekStartsOn === 1) {
      // Monday
      diff = day === 0 ? 6 : day - 1;
    } else if (weekStartsOn === 6) {
      // Saturday
      diff = (day + 1) % 7;
    }

    const firstDay = new Date(date);
    firstDay.setDate(date.getDate() - diff);

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(firstDay);
      nextDate.setDate(firstDay.getDate() + i);
      result.push(nextDate);
    }

    return result;
  }

  const monthData = useMemo(
    () => generateMonthData(year, month),
    [year, month]
  );

  function isSameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }

  const setDateRange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    setCurrentDate(start);
  };

  const refreshEvents = () => {
    fetchEvents();
  };

  const navigateNext = () => {
    if (view === "weekly") {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
      setYear(newDate.getFullYear());
      setMonth(newDate.getMonth());
    } else if (view === "daily") {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 1);
      setCurrentDate(newDate);
      setYear(newDate.getFullYear());
      setMonth(newDate.getMonth());
    } else {
      setMonth(month + 1);
      if (month > 11) {
        setYear(year + 1);
        setMonth(0);
      }
    }
  };

  const navigatePrevious = () => {
    if (view === "weekly") {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
      setYear(newDate.getFullYear());
      setMonth(newDate.getMonth());
    } else if (view === "daily") {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 1);
      setCurrentDate(newDate);
      setYear(newDate.getFullYear());
      setMonth(newDate.getMonth());
    } else {
      setMonth(month - 1);
      if (month < 0) {
        setYear(year - 1);
        setMonth(11);
      }
    }
  };

  const navigateToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  useEffect(() => {
    fetchEvents();
  }, [startDate, endDate]);

  return (
    <GoogleCalendarContext.Provider
      value={{
        currentDate,
        view,
        events,
        isLoading,
        error,
        setView,
        setDateRange,
        refreshEvents,
        monthData,
        navigateNext,
        navigatePrevious,
        navigateToday,
        viewTitle,
        generateTimeSlots,
        getWeekDates,
        setMonth,
        setYear,
        selectedEvent,
        setSelectedEvent,
        fetchEvents,
      }}
    >
      {children}
    </GoogleCalendarContext.Provider>
  );
};
