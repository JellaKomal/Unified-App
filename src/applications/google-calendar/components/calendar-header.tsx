"use client";

import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  ChevronLeft,
  Grid,
  ChevronRight,
  Clock,
  List,
  Plus,
  LogOutIcon, 
} from "lucide-react";
import { motion } from "framer-motion";
import { useGoogleCalendarContext } from "../lib/GoogleCalendarContext";
import { useNavigate } from "react-router-dom";
import { useCalendarSettingsContext } from "../lib/CalendarSettingsContext";
import {
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../lib/AuthContext";
export default function CalendarHeader() {
  const navigate = useNavigate();
  const {
    navigateNext,
    navigatePrevious,
    navigateToday,
    viewTitle,
    view: viewType,
    setMonth,
    setYear,
  } = useGoogleCalendarContext();
  const { is24HourFormat, setIs24HourFormat, setIsEventDialogOpen } =
    useCalendarSettingsContext();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={navigatePrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-1">
          <Button variant="outline" onClick={navigateToday}>
            Today
          </Button>
          <motion.span
            key={viewTitle}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-medium px-2"
          >
            {viewTitle}
          </motion.span>
        </div>
        <Button variant="ghost" size="icon" onClick={navigateNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => setIs24HourFormat(!is24HourFormat)}
        >
          <Clock className="mr-2 h-4 w-4" />
          {is24HourFormat ? "24h" : "12h"}
        </Button>
        <Button
          variant={viewType === "monthly" ? "secondary" : "outline"}
          size="sm"
          className="h-8"
          onClick={() => {
            const currentDate = new Date();
            setMonth(currentDate.getMonth());
            setYear(currentDate.getFullYear());
            navigate("/calendar/monthly");
          }}
        >
          This Month
        </Button>
        <div className="flex border rounded-md">
          <Button
            variant={viewType === "daily" ? "default" : "outline"}
            size="sm"
            className="h-8 px-2 border-r"
            onClick={() => navigate("/calendar/daily")}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === "weekly" ? "default" : "outline"}
            size="sm"
            className="h-8 px-2 border-r"
            onClick={() => navigate("/calendar/weekly")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === "monthly" ? "default" : "outline"}
            size="sm"
            className="h-8 px-2 border-r"
            onClick={() => navigate("/calendar/monthly")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === "agenda" ? "default" : "outline"}
            size="sm"
            className="h-8 px-2"
            onClick={() => navigate("/calendar/agenda")}
          >
            <List className="h-4 w-4 rotate-90" />
          </Button>
        </div>
        <Button onClick={() => setIsEventDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JK</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-w-64">
            <DropdownMenuLabel className="flex items-start gap-3">
              <div className="flex min-w-0 flex-col">
                <span className="text-foreground truncate text-sm font-medium">
                  Jella Kom
                </span>
                <span className="text-muted-foreground truncate text-xs font-normal">
                  jella.komal.stacks@gmail.com
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
              }}
            >
              <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
