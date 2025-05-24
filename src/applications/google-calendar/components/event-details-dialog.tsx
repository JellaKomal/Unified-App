import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Trash2, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useGoogleCalendarContext } from "../lib/GoogleCalendarContext";
import { useCalendarSettingsContext } from "../lib/CalendarSettingsContext";
import { getEventColor } from "../lib/date-utils";
import { deleteGoogleCalendarEvent } from "../lib/googleCalendarService";
export function EventDetailsDialog() {
  const { selectedEvent, fetchEvents } = useGoogleCalendarContext();
  const {
    is24HourFormat,
    isEventDetailsDialogOpen,
    setIsEventDetailsDialogOpen,
    setIsEventDialogOpen,
  } = useCalendarSettingsContext();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!selectedEvent) return null;

  const formatEventTime = () => {
    if (selectedEvent.start.date) {
      return "All day";
    }

    const startHour = Number.parseInt(
      selectedEvent.start.dateTime?.split("T")[1].split(":")[0] ?? "00"
    );
    const startMinute = Number.parseInt(
      selectedEvent.start.dateTime?.split("T")[1].split(":")[1] ?? "00"
    );
    const endHour = Number.parseInt(
      selectedEvent.end.dateTime?.split("T")[1].split(":")[0] ?? "00"
    );
    const endMinute = Number.parseInt(
      selectedEvent.end.dateTime?.split("T")[1].split(":")[1] ?? "00"
    );

    let startDisplay = "";
    let endDisplay = "";

    if (is24HourFormat) {
      startDisplay = `${startHour.toString().padStart(2, "0")}:${startMinute
        .toString()
        .padStart(2, "0")}`;
      endDisplay = `${endHour.toString().padStart(2, "0")}:${endMinute
        .toString()
        .padStart(2, "0")}`;
    } else {
      const startPeriod = startHour >= 12 ? "PM" : "AM";
      const endPeriod = endHour >= 12 ? "PM" : "AM";
      const displayStartHour = startHour % 12 || 12;
      const displayEndHour = endHour % 12 || 12;

      startDisplay = `${displayStartHour}:${startMinute
        .toString()
        .padStart(2, "0")} ${startPeriod}`;
      endDisplay = `${displayEndHour}:${endMinute
        .toString()
        .padStart(2, "0")} ${endPeriod}`;
    }

    return `${startDisplay} - ${endDisplay}`;
  };

  const handleDelete = () => {
    deleteGoogleCalendarEvent(selectedEvent.id);
    setIsEventDetailsDialogOpen(false);
    fetchEvents();
  };

  return (
    <>
      <Dialog
        open={isEventDetailsDialogOpen}
        onOpenChange={() => setIsEventDetailsDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div
              className={`px-4 py-2 rounded-md border ${getEventColor(
                selectedEvent
              )}`}
            >
              <DialogTitle className="text-xl">
                {selectedEvent.summary}
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatEventTime()}</span>
            </div>

            {selectedEvent.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{selectedEvent.location}</span>
              </div>
            )}
            {/* 
            {formatRecurrence() && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Repeat className="h-4 w-4" />
                <span>{formatRecurrence()}</span>
              </div>
            )} */}

            {selectedEvent.description && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent.description}
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <div>
              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the event "
                      {selectedEvent.summary}". This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEventDetailsDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsEventDetailsDialogOpen(false);
                  setIsEventDialogOpen(true);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
