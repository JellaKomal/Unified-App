import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import type { RawGoogleEvent } from "./googleCalendarService";
export type WeekStartsOnType = "monday" | "sunday" | "saturday";

interface CalendarSettingsContextProps {
  is24HourFormat: boolean;
  setIs24HourFormat: (is24HourFormat: boolean) => void;
  weekStart: WeekStartsOnType;
  setWeekStart: (weekStart: WeekStartsOnType) => void;
  defaultDuration: number;
  setDefaultDuration: (defaultDuration: number) => void;
  isEventDialogOpen: boolean;
  setIsEventDialogOpen: (isEventDialogOpen: boolean) => void;
  selectedEvent: RawGoogleEvent | null;
  setSelectedEvent: (selectedEvent: RawGoogleEvent | null) => void;
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
  isEventDetailsDialogOpen: boolean;
  setIsEventDetailsDialogOpen: (isEventDetailsDialogOpen: boolean) => void;
  bgOpacity: number;
  setBgOpacity: (bgOpacity: number) => void;
}

const CalendarSettingsContext = createContext<
  CalendarSettingsContextProps | undefined
>(undefined);

export const useCalendarSettingsContext = (): CalendarSettingsContextProps => {
  const context = useContext(CalendarSettingsContext);
  if (!context) {
    throw new Error(
      "useCalendarSettingsContext must be used within a CalendarSettingsProvider"
    );
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const CalendarSettingsProvider = ({ children }: Props) => {
  const [is24HourFormat, setIs24HourFormat] = useState(
    () => JSON.parse(sessionStorage.getItem("is24HourFormat") ?? "false")
  );
  const [weekStart, setWeekStart] = useState<WeekStartsOnType>(
    () => (sessionStorage.getItem("weekStart") as WeekStartsOnType) ?? "sunday"
  );
  const [defaultDuration, setDefaultDuration] = useState(
    () => Number(sessionStorage.getItem("defaultDuration") ?? 30)
  );
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(
    () => JSON.parse(sessionStorage.getItem("isEventDialogOpen") ?? "false")
  );
  const [selectedEvent, setSelectedEvent] = useState<RawGoogleEvent | null>(
    () => {
      const stored = sessionStorage.getItem("selectedEvent");
      return stored ? JSON.parse(stored) : null;
    }
  );
  const [activeTab, setActiveTab] = useState(
    () => sessionStorage.getItem("activeTab") ?? "general"
  );
  const [isEventDetailsDialogOpen, setIsEventDetailsDialogOpen] = useState(
    () => JSON.parse(sessionStorage.getItem("isEventDetailsDialogOpen") ?? "false")
  );
  const [bgOpacity, setBgOpacity] = useState(
    () => Number(sessionStorage.getItem("bgOpacity") ?? 0.2)
  );

  useEffect(() => {
    sessionStorage.setItem("is24HourFormat", JSON.stringify(is24HourFormat));
  }, [is24HourFormat]);

  useEffect(() => {
    sessionStorage.setItem("weekStart", weekStart);
  }, [weekStart]);

  useEffect(() => {
    sessionStorage.setItem("defaultDuration", String(defaultDuration));
  }, [defaultDuration]);

  useEffect(() => {
    sessionStorage.setItem("isEventDialogOpen", JSON.stringify(isEventDialogOpen));
  }, [isEventDialogOpen]);

  useEffect(() => {
    sessionStorage.setItem("selectedEvent", JSON.stringify(selectedEvent));
  }, [selectedEvent]);

  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    sessionStorage.setItem("isEventDetailsDialogOpen", JSON.stringify(isEventDetailsDialogOpen));
  }, [isEventDetailsDialogOpen]);

  useEffect(() => {
    sessionStorage.setItem("bgOpacity", String(bgOpacity));
  }, [bgOpacity]);

  return (
    <CalendarSettingsContext.Provider
      value={{
        bgOpacity,
        setBgOpacity,
        is24HourFormat,
        setIs24HourFormat,
        weekStart,
        setWeekStart,
        defaultDuration,
        setDefaultDuration,
        isEventDialogOpen,
        setIsEventDialogOpen,
        selectedEvent,
        setSelectedEvent,
        activeTab,
        setActiveTab,
        isEventDetailsDialogOpen,
        setIsEventDetailsDialogOpen,
      }}
    >
      {children}
    </CalendarSettingsContext.Provider>
  );
};
