// googleCalendarService.ts

export interface RawGoogleEvent {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  colorId?: string;
  creator: {
    email: string;
    self: boolean;
  };
  organizer: {
    email: string;
    self: boolean;
  };
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  recurringEventId?: string;
  iCalUID: string;
  sequence: number;
  reminders: {
    useDefault: boolean;
    overrides?: { method: "email" | "popup"; minutes: number }[];
  };
  description?: string;
  location?: string;
  eventType: string;
}

// Optional enrichment layer (if you need it)
export interface EnrichedEvent {
  id: string;
  title: string;
  notes: string;
  timeZone: string;
  originalEvent: RawGoogleEvent;
}

export type ViewType = "quarter" | "monthly" | "weekly" | "daily" | "agenda";

// Clearer name for grouped structure
export interface EventsByDateMap {
  [dateKey: string]: RawGoogleEvent[];
}

// Keeps the name short and meaningful
export const getGoogleAccessToken = (): string | null => {
  return sessionStorage.getItem("google_access_token");
};

// API fetcher
export const fetchGoogleCalendarEvents = async (
  startDate: Date,
  endDate: Date
): Promise<RawGoogleEvent[]> => {
  const accessToken = getGoogleAccessToken();
  if (!accessToken) throw new Error("Google access token not found.");

  const timeMin = startDate.toISOString();
  const timeMax = endDate.toISOString();

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch events: ${response.status} - ${errorText}`
    );
  }

  const data = await response.json();
  return data.items as RawGoogleEvent[];
};

// Grouping function with better name
export const groupEventsByDateKey = (
  events: RawGoogleEvent[]
): EventsByDateMap => {
  const grouped: EventsByDateMap = {};

  events.forEach((event) => {
    try {
      // Get start and end dates
      const startDate = event.start.dateTime
        ? new Date(event.start.dateTime)
        : new Date(event.start.date || "");
      const endDate = event.end.dateTime
        ? new Date(event.end.dateTime)
        : new Date(event.end.date || "");

      // For all-day events, end date is exclusive, so we need to subtract one day
      if (event.start.date) {
        endDate.setDate(endDate.getDate() - 1);
      }

      // Add event to all dates it spans
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split("T")[0];
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(event);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } catch (error) {
      console.error("Error processing event:", event, error);
    }
  });

  return grouped;
};

// googleCalendarService.ts

export interface NewCalendarEvent {
  summary: string;
  location?: string;
  description?: string;
  colorId?: string;
  start: {
    dateTime: string;
    timeZone?: string;
    date?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
    date?: string;
  };
  recurrence?: string[];
  attendees?: { email: string }[];
  reminders?: {
    useDefault: boolean;
    overrides?: { method: "email" | "popup"; minutes: number }[];
  };
}

const getStoredAccessToken = (): string | null => {
  return sessionStorage.getItem("google_access_token");
};

/**
 * Add a new event to Google Calendar
 * @param event NewCalendarEvent object
 */
export const addGoogleCalendarEvent = async (event: NewCalendarEvent) => {
  const accessToken = getStoredAccessToken();
  if (!accessToken) {
    throw new Error("No access token found. User may not be authenticated.");
  }

  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to create event: ${response.status} ${
        response.statusText
      } - ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  return data;
};

export const updateGoogleCalendarEvent = async (
  eventId: string,
  updatedEvent: Partial<NewCalendarEvent>
) => {
  const accessToken = getStoredAccessToken();
  if (!accessToken) {
    throw new Error("No access token found. User may not be authenticated.");
  }

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: "PUT", // Use PUT for full replacement or PATCH for partial
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to update event: ${response.status} ${
        response.statusText
      } - ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  return data;
};

export const deleteGoogleCalendarEvent = async (eventId: string) => {
  const accessToken = getStoredAccessToken(); // From previous step
  if (!accessToken) {
    throw new Error("No access token found. User may not be authenticated.");
  }

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to delete event: ${response.status} ${
        response.statusText
      } - ${JSON.stringify(errorData)}`
    );
  }

  return true; // Success: 204 No Content
};
