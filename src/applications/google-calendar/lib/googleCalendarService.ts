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

const getStoredAccessToken = (): string | null => {
  return sessionStorage.getItem("google_access_token");
};

const getStoredRefreshToken = (): string | null => {
  return sessionStorage.getItem("google_refresh_token");
};

const getTokenExpiry = (): number => {
  const expiry = sessionStorage.getItem("token_expiry");
  return expiry ? parseInt(expiry) : 0;
};

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
const tokenUrl = import.meta.env.VITE_GOOGLE_OAUTH_TOKEN_URL;
const calendarApiUrl = import.meta.env.VITE_GOOGLE_CALENDAR_API_URL;

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const tokens = await response.json();
    
    // Update stored tokens
    sessionStorage.setItem("google_access_token", tokens.access_token);
    sessionStorage.setItem("token_expiry", (Date.now() + tokens.expires_in * 1000).toString());
    
    return tokens.access_token;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

export const getValidAccessToken = async (): Promise<string> => {
  const accessToken = getStoredAccessToken();
  const tokenExpiry = getTokenExpiry();
  
  // If token is expired or will expire in the next 5 minutes, refresh it
  if (!accessToken || Date.now() + 300000 >= tokenExpiry) {
    return await refreshAccessToken();
  }
  
  return accessToken;
};

let lastFetchTime = 0;
const MIN_FETCH_INTERVAL = 1000; // Minimum time between fetches in milliseconds
const CACHE_DURATION = 5 * 60 * 1000; // Cache duration: 5 minutes

interface CachedEvents {
  events: RawGoogleEvent[];
  timestamp: number;
}

export const fetchGoogleCalendarEvents = async (
  startDate: Date,
  endDate: Date
): Promise<RawGoogleEvent[]> => {
  // Create a cache key based on the date range
  const cacheKey = `calendar_events_${startDate.toISOString()}_${endDate.toISOString()}`;
  
  // Check cache first
  const cachedData = sessionStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      const { events, timestamp }: CachedEvents = JSON.parse(cachedData);
      // Return cached data if it's still valid
      if (Date.now() - timestamp < CACHE_DURATION) {
        return events;
      }
    } catch (e) {
      console.error("Failed to parse cached events:", e);
    }
  }

  // Rate limiting
  const now = Date.now();
  if (now - lastFetchTime < MIN_FETCH_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_FETCH_INTERVAL - (now - lastFetchTime)));
  }
  lastFetchTime = Date.now();

  const accessToken = await getValidAccessToken();
  if (!accessToken) throw new Error("Google access token not found.");

  // Limit the date range to a reasonable period
  const maxDateRange = 31; // Maximum number of days to fetch
  const currentDate = new Date();
  const maxEndDate = new Date(currentDate);
  maxEndDate.setDate(currentDate.getDate() + maxDateRange);

  // Adjust the end date if it's too far in the future
  const adjustedEndDate = endDate > maxEndDate ? maxEndDate : endDate;

  const timeMin = startDate.toISOString();
  const timeMax = adjustedEndDate.toISOString();

  try {
    const response = await fetch(
      `${calendarApiUrl}/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=2500`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        // Too many requests - wait and retry
        await new Promise(resolve => setTimeout(resolve, 5000));
        return fetchGoogleCalendarEvents(startDate, endDate);
      }
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch events: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    const events = data.items as RawGoogleEvent[];

    // Cache the results
    const cacheData: CachedEvents = {
      events,
      timestamp: Date.now()
    };
    sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));

    return events;
  } catch (error) {
    if (error instanceof Error && error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
      // Wait and retry on resource error
      await new Promise(resolve => setTimeout(resolve, 5000));
      return fetchGoogleCalendarEvents(startDate, endDate);
    }
    throw error;
  }
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

// Update other API functions to use getValidAccessToken
export const addGoogleCalendarEvent = async (event: NewCalendarEvent) => {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new Error("No access token found. User may not be authenticated.");
  }

  const response = await fetch(
    `${calendarApiUrl}/calendars/primary/events`,
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
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new Error("No access token found. User may not be authenticated.");
  }

  const response = await fetch(
    `${calendarApiUrl}/calendars/primary/events/${eventId}`,
    {
      method: "PUT",
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
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new Error("No access token found. User may not be authenticated.");
  }

  const response = await fetch(
    `${calendarApiUrl}/calendars/primary/events/${eventId}`,
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

  return true;
};
