import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import CalendarLayout from "./calendar-layout";
import MonthlyView from "../pages/montly-view";
import HomePage from "../pages/home-page";
import WeeklyView from "../pages/weekly-view";
import DailyView from "../pages/daily-view";
import AgendaView from "../pages/agenda-view";
import { AuthProvider } from "../lib/AuthContext";

export const googleCalendarRoutes: RouteObject[] = [
  {
    path: "/calendar",
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <CalendarLayout />
        </ProtectedRoute>
      </AuthProvider>
    ),
    children: [
      { 
        path: "", 
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ) 
      },
      {
        path: "monthly",
        element: (
          <ProtectedRoute>
            <MonthlyView />
          </ProtectedRoute>
        ),
      },
      {
        path: "weekly",
        element: (
          <ProtectedRoute>
            <WeeklyView />
          </ProtectedRoute>
        ),
      },
      {
        path: "daily",
        element: (
          <ProtectedRoute>
            <DailyView />
          </ProtectedRoute>
        ),
      },
      {
        path: "agenda",
        element: (
          <ProtectedRoute>
            <AgendaView />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
