type Day = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
};

type Week = {
  days: Day[];
};

type MonthData = {
  weeks: Week[];
};

export interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}

export type { Day, Week, MonthData };

export function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}
