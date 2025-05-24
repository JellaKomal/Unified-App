import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = () => {
    const accessToken = sessionStorage.getItem("google_access_token");
    const tokenExpiry = sessionStorage.getItem("token_expiry");
    
    if (!accessToken || !tokenExpiry) {
      return false;
    }

    // Check if token is expired
    const expiryTime = parseInt(tokenExpiry);
    if (Date.now() >= expiryTime) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    const authStatus = checkAuth();
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear all auth-related data from sessionStorage
    sessionStorage.removeItem("google_access_token");
    sessionStorage.removeItem("google_refresh_token");
    sessionStorage.removeItem("token_expiry");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 