// googleCalendarService.ts

export interface itemsInterface {
  created: string;
  creator: {
    email: string;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  status: string;
  htmlLink: string;
  eventType: string;
  id: string;
  summary: string;
  kind: string;
  updated: string;
}

export interface CalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  timeZone?: string;
  defaultReminders?: {
    method: string;
    minutes: number;
  }[];
  items: itemsInterface[];
}

const getStoredAccessToken = (): string | null => {
  return sessionStorage.getItem("google_access_token");
};

export type EventsByDate = Record<string, CalendarEvent[]>;

// Get ISO time range for the current month
const getCurrentMonthTimeRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return {
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
  };
};

// Fetch events from Google Calendar API
export const fetchMonthlyGoogleEvents = async (): Promise<EventsByDate> => {
  const accessToken = getStoredAccessToken();
  if (!accessToken) {
    throw new Error("No access token found. User may not be authenticated.");
  }

  const { timeMin, timeMax } = getCurrentMonthTimeRange();

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch calendar events");
  }

  const data: CalendarEvent = await response.json();
  // console.log(data);
  return groupEventsByDate(data.items as itemsInterface[]);
};

// Group events by date (YYYY-MM-DD)
export const groupEventsByDate = (events: itemsInterface[]): EventsByDate => {
  const grouped: EventsByDate = {};

  events.forEach((event) => {
    const dateTime = event.start.dateTime;
    const dateKey = dateTime
      ? new Date(dateTime).toISOString().split("T")[0]
      : "unknown";

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push({
      id: event.id,
      summary: event.summary,
      description: "", // or fill with actual value if available
      timeZone: event.start.timeZone,
      defaultReminders: [], // or fill based on data if available
      items: [event],
    });
  });

  return grouped;
};
