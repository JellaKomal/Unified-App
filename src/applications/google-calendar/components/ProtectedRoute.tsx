import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // If we're already at the root calendar path, show the login page
    if (location.pathname === "/calendar") {
      return <>{children}</>;
    }
    // Otherwise redirect to the root calendar path
    return <Navigate to="/calendar" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
