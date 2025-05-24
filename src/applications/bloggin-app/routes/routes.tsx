import type { RouteObject } from "react-router-dom";
import HomePage from "../pages/home-page";
import SearchPage from "../pages/search-page";
import BlogPage from "../pages/blog-page";
import BlogWriting from "../pages/blog-writing";
import CategoriesPage from "../pages/categories-page";
import ProfilePage from "../pages/profile-page";
import CoursePage from "../pages/course-page";

export const bloggingAppRoutes: RouteObject[] = [
  { path: "/blogging-app", element: <HomePage /> },
  { path: "/blogging-app/search", element: <SearchPage /> },
  { path: "/blogging-app/blog", element: <BlogPage /> },
  { path: "/blogging-app/blog-writing", element: <BlogWriting /> },
  { path: "/blogging-app/categories", element: <CategoriesPage /> },
  { path: "/blogging-app/profile", element: <ProfilePage /> },
  { path: "/blogging-app/course", element: <CoursePage /> },
  // { path: "/blogging-app/login", element: <Login /> },
];
