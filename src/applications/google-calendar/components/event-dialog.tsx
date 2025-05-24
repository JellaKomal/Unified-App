import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch"; 
import { format, parseISO } from "date-fns";
import { useCalendarSettingsContext } from "../lib/CalendarSettingsContext";
import {
  addGoogleCalendarEvent,
  updateGoogleCalendarEvent,
  type NewCalendarEvent,
} from "../lib/googleCalendarService";
  import { useGoogleCalendarContext } from "../lib/GoogleCalendarContext";

export function EventDialog() {
  const { isEventDialogOpen, setIsEventDialogOpen } =
    useCalendarSettingsContext();
  const { selectedEvent, fetchEvents } = useGoogleCalendarContext();

  // Initialize state with current date/time or selected event data
  const [startDate, setStartDate] = useState<Date>(() => {
    if (selectedEvent?.start?.dateTime) {
      return parseISO(selectedEvent.start.dateTime);
    }
    return new Date();
  });

  const [timeError, setTimeError] = useState<string>("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState<string>(() => {
    if (selectedEvent?.start?.dateTime) {
      return format(parseISO(selectedEvent.start.dateTime), "HH:mm");
    }
    return format(new Date(), "HH:mm");
  });

  const [endDate, setEndDate] = useState<Date>(() => {
    if (selectedEvent?.end?.dateTime) {
      return parseISO(selectedEvent.end.dateTime);
    }
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now;
  });

  const [endTime, setEndTime] = useState<string>(() => {
    if (selectedEvent?.end?.dateTime) {
      return format(parseISO(selectedEvent.end.dateTime), "HH:mm");
    }
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return format(now, "HH:mm");
  });

  const [eventData, setEventData] = useState<NewCalendarEvent>(() => ({
    summary: selectedEvent?.summary || "",
    location: selectedEvent?.location || "",
    description: selectedEvent?.description || "",
    start: {
      dateTime: format(startDate, "yyyy-MM-dd'T'HH:mm:ssXXX"),
      timeZone: selectedEvent?.start?.timeZone || "UTC",
    },
    end: {
      dateTime: format(endDate, "yyyy-MM-dd'T'HH:mm:ssXXX"),
      timeZone: selectedEvent?.end?.timeZone || "UTC",
    },
    recurrence: [],
    attendees: [],
    reminders: {
      useDefault: selectedEvent?.reminders?.useDefault ?? true,
    },
  }));

  useEffect(() => {
    setIsAllDay(!!eventData.start.date);
  }, [eventData.start.date]);

  const validateTimes = (start: Date, end: Date): boolean => {
    if (end <= start) {
      setTimeError("End time must be after start time");
      return false;
    }
    setTimeError("");
    return true;
  };

  const handleChange = (field: string, value: any) => {
    setEventData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (
    parent: "start" | "end" | "reminders",
    field: string,
    value: any
  ) => {
    setEventData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const updateEventDateTime = (
    type: "start" | "end",
    date: Date,
    time: string
  ) => {
    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);

    if (type === "start") {
      if (!validateTimes(newDate, endDate)) {
        return;
      }
    } else {
      if (!validateTimes(startDate, newDate)) {
        return;
      }
    }

    handleNestedChange(type, "dateTime", newDate.toISOString());
  };

  const handleDateChange = (type: "start" | "end", date: Date | undefined) => {
    if (date) {
      if (type === "start") {
        if (!validateTimes(date, endDate)) {
          return;
        }
        setStartDate(date);
        updateEventDateTime("start", date, startTime);
      } else {
        if (!validateTimes(startDate, date)) {
          return;
        }
        setEndDate(date);
        updateEventDateTime("end", date, endTime);
      }
    }
  };

  const handleTimeChange = (type: "start" | "end", time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date(type === "start" ? startDate : endDate);
    newDate.setHours(hours, minutes, 0, 0);

    if (type === "start") {
      if (!validateTimes(newDate, endDate)) {
        return;
      }
      setStartTime(time);
      updateEventDateTime("start", startDate, time);
    } else {
      if (!validateTimes(startDate, newDate)) {
        return;
      }
      setEndTime(time);
      updateEventDateTime("end", endDate, time);
    }
  };

  const handleAllDayChange = (checked: boolean) => {
    setIsAllDay(checked);

    if (checked) {
      // For all-day events
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      handleNestedChange("start", "date", format(start, "yyyy-MM-dd"));
      handleNestedChange("end", "date", format(end, "yyyy-MM-dd"));
      handleNestedChange("start", "dateTime", undefined);
      handleNestedChange("end", "dateTime", undefined);
    } else {
      // For regular events
      const now = new Date();
      const end = new Date(now);
      end.setHours(now.getHours() + 1);

      handleNestedChange(
        "start",
        "dateTime",
        format(now, "yyyy-MM-dd'T'HH:mm:ssXXX")
      );
      handleNestedChange(
        "end",
        "dateTime",
        format(end, "yyyy-MM-dd'T'HH:mm:ssXXX")
      );
      handleNestedChange("start", "date", undefined);
      handleNestedChange("end", "date", undefined);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedEvent) {
        const response = await updateGoogleCalendarEvent(
          selectedEvent.id,
          eventData
        );
        console.log("Event updated:", response);
      } else {
        const response = await addGoogleCalendarEvent(eventData);
        console.log("Event added:", response);
      }
      setIsEventDialogOpen(false);
      fetchEvents();
    } catch (err) {
      console.error("Failed to save event:", err);
    }
  };

  const isFormValid = () => {
    if (!eventData.summary) return false;
    if (isAllDay) return true;
    if (timeError) return false;

    // For all-day events, check if we have dates
    if (eventData.start.date) {
      return !!eventData.start.date && !!eventData.end.date;
    }

    // For regular events, check if we have dateTimes
    return !!eventData.start.dateTime && !!eventData.end.dateTime;
  };

  return (
    <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
      <DialogContent
        className="sm:max-w-[600px]"
        aria-describedby="event-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>
            {selectedEvent ? "Edit Event" : "Add New Event"}
          </DialogTitle>
          <p
            id="event-dialog-description"
            className="text-sm text-muted-foreground"
          >
            {selectedEvent
              ? "Edit the details of your existing calendar event"
              : "Create a new calendar event with title, date, time, and other details"}
          </p>
        </DialogHeader>

        <div className="grid gap-2">
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            value={eventData.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            placeholder="Enter event title"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              className="border"
              value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                if (date) {
                  console.log("Start date selected:", date);
                  setStartDate(date);
                  handleDateChange("start", date);
                }
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label>End Date</Label>
            <Input
              type="date"
              value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                if (date) {
                  console.log("End date selected:", date);
                  setEndDate(date);
                  handleDateChange("end", date);
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="all-day"
            checked={isAllDay}
            onCheckedChange={handleAllDayChange}
          />
          <Label htmlFor="all-day">All day event</Label>
        </div>

        {!eventData.start.date && (
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => handleTimeChange("start", e.target.value)}
                className={timeError ? "border-red-500" : ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => handleTimeChange("end", e.target.value)}
                className={timeError ? "border-red-500" : ""}
              />
            </div>
            {timeError && (
              <p className="col-span-2 text-sm text-red-500">{timeError}</p>
            )}
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="location">Location (Optional)</Label>
          <Input
            id="location"
            value={eventData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Enter location"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="color">Event Color</Label>
          <Select
            value={eventData.colorId}
            onValueChange={(value) => handleChange("colorId", value)}
          >
            <SelectTrigger id="color">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Yellow</SelectItem>
              <SelectItem value="2">Green</SelectItem>
              <SelectItem value="3">Purple</SelectItem>
              <SelectItem value="4">Violet</SelectItem>
              <SelectItem value="5">Blue</SelectItem>
              <SelectItem value="6">Pink</SelectItem>
              <SelectItem value="7">Orange</SelectItem>
              <SelectItem value="8">Turquoise</SelectItem>
              <SelectItem value="9">Reddish Purple</SelectItem>
              <SelectItem value="10">Blue</SelectItem>
              <SelectItem value="11">Red</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={eventData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter event description"
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid()}>
            {selectedEvent ? "Update Event" : "Save Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
