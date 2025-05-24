import type { RouteObject } from "react-router-dom";
import HomePage from "../pages/home-page";

export const calendarRoutes: RouteObject[] = [
  { path: "/calendar", element: <HomePage /> },
  // { path: "/blogging-app/login", element: <Login /> },
];
