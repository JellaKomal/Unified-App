import "./App.css";
import { Routes, Route } from "react-router-dom";
import { priceTrackerRoutes } from "./applications/price-tracking-app/routes/routes";
import { bloggingAppRoutes } from "./applications/bloggin-app/routes/routes";
import Applications from "./applications/applications";
import { googleCalendarRoutes } from "./applications/google-calendar/routes/routes";
import HomePage from "./applications/folder-crud/home-page";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-[100px] font-bold tracking-tighter ">
              <span className="text-primary bg-background px-4"> AellJ </span>
              <span className="text-background bg-primary px-4 py-2"> Komal </span>
              <span className="text-primary bg-background px-4">
                {" "}
                Interface{" "}
              </span>
            </h1>
          </div>
        }
      />
      <Route path="/text-editor" element={<HomePage />} />
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
              { path: "/text-editor", element: <HomePage /> },
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
