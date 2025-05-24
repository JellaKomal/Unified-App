import type { DayData, MonthData, TimeSlot, WeekData } from "@/lib/types";
import type { EventsByDateMap, RawGoogleEvent } from "./googleCalendarService";

export function getEventsForDay(
  date: Date,
  events: EventsByDateMap,
  buffer?: number
) {
  const prevDate = new Date(date);
  prevDate.setDate(date.getDate() + (buffer || 0));
  const dateKey = formatDateKey(prevDate);
  return events[dateKey] || [];
}

export function getMonthName(month: number): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month];
}

export function getShortMonthName(month: number): string {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[month];
}

export function getDayName(day: number): string {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[day];
}

export function getShortDayName(day: number): string {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return dayNames[day];
}

export function getNextMonth(
  year: number,
  month: number
): { year: number; month: number } {
  if (month === 11) {
    return { year: year + 1, month: 0 };
  } else {
    return { year, month: month + 1 };
  }
}

export function getPrevMonth(
  year: number,
  month: number
): { year: number; month: number } {
  if (month === 0) {
    return { year: year - 1, month: 11 };
  } else {
    return { year, month: month - 1 };
  }
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export function formatTime(
  hour: number,
  minute: number,
  is24Hour: boolean
): string {
  if (is24Hour) {
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  } else {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  }
}

export function generateTimeSlots(
  is24Hour: boolean,
  interval = 30
): TimeSlot[] {
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

export function generateMonthData(
  year: number,
  month: number,
  weekStartsOn = 1
): MonthData {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = getDaysInMonth(year, month);

  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  let firstDayOfWeek = firstDay.getDay();

  // Adjust for week start
  if (weekStartsOn === 1) {
    // Monday
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  } else if (weekStartsOn === 6) {
    // Saturday
    firstDayOfWeek = (firstDayOfWeek + 1) % 7;
  }

  // Get days from previous month to fill the first week
  const daysFromPrevMonth = firstDayOfWeek;
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

  // Calculate total days to display (previous month + current month + next month)
  const totalDays = Math.ceil((daysFromPrevMonth + daysInMonth) / 7) * 7;

  const weeks: WeekData[] = [];
  let currentWeek: DayData[] = [];
  const currentDate = new Date(
    prevMonthYear,
    prevMonth,
    daysInPrevMonth - daysFromPrevMonth + 1
  );

  for (let i = 0; i < totalDays; i++) {
    const isCurrentMonth = currentDate.getMonth() === month;

    currentWeek.push({
      date: new Date(currentDate),
      isCurrentMonth,
      isToday: isToday(currentDate),
      events: [],
    });

    if (currentWeek.length === 7) {
      weeks.push({ days: currentWeek });
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { weeks };
}

export function getWeekDates(date: Date, weekStartsOn = 1): Date[] {
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

export function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(date.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(date.getMonth() + months);
  return result;
}

export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(date.getFullYear() + years);
  return result;
}

export const getEventColor = (event: RawGoogleEvent): string => {
  if (event.colorId) {
    return `bg-[var(--event${event.colorId})]`;
  }
  return "bg-primary/20";
};
