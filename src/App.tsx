import "./App.css";
import { Routes, Route } from "react-router-dom";
import { priceTrackerRoutes } from "./applications/price-tracking-app/routes/routes";
import { bloggingAppRoutes } from "./applications/bloggin-app/routes/routes";
import Applications from "./applications/applications";
import GoogleLoginButton from "./components/design-system/GoogleLoginButton";
import { googleCalendarRoutes } from "./applications/google-calendar/routes/routes";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            Hi how are you
            <GoogleLoginButton />
          </div>
        }
      />
      {priceTrackerRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children?.map((child) => (
            <Route key={child.path} path={child.path} element={child.element} />
          ))}
        </Route>
      ))}
      {bloggingAppRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children?.map((child) => (
            <Route key={child.path} path={child.path} element={child.element} />
          ))}
        </Route>
      ))}
      {googleCalendarRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children?.map((child) => (
            <Route key={child.path} path={child.path} element={child.element} />
          ))}
        </Route>
      ))}

      <Route
        path="applications"
        element={
          <Applications
            routes={[
              ...priceTrackerRoutes,
              ...bloggingAppRoutes,
              ...googleCalendarRoutes,
            ]}
          />
        }
      />
    </Routes>
  );
}

export default App;
