import type { RouteObject } from "react-router-dom";
import CalendarLayout from "./calendar-layout"; 
import MonthlyView from "../pages/montly-view";
import HomePage from "../pages/home-page";
import WeeklyView from "../pages/weekly-view";
import DailyView from "../pages/daily-view";
import AgendaView from "../pages/agenda-view";

export const googleCalendarRoutes: RouteObject[] = [
  {
    path: "/calendar",
    element: <CalendarLayout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "monthly", element: <MonthlyView /> },
      { path: "weekly", element: <WeeklyView /> },
      { path: "daily", element: <DailyView /> },
      { path: "agenda", element: <AgendaView /> },
    ],
  },
];
