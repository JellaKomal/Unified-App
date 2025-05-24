import Dashboard from "@/applications/price-tracking-app/pages/dashboard";
import type { RouteObject } from "react-router-dom";
import PriceTrackerLayout from "./price-tracker-layout";
import { LoginForm } from "../pages/login-page";
import TrackProduct from "../pages/track-product";
import HomePage from "../pages/home-page";

export const priceTrackerRoutes: RouteObject[] = [
  {
    path: "/price-tracking-app",
    element: <PriceTrackerLayout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "login", element: <LoginForm /> },
      { path: "track-product", element: <TrackProduct /> },
    ],
  },
];
