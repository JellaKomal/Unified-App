// GoogleLoginButton.tsx
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/applications/google-calendar/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
const tokenUrl = import.meta.env.VITE_GOOGLE_OAUTH_TOKEN_URL;
const appUrl = import.meta.env.VITE_APP_URL;

const GoogleLoginButton = () => {
  const { isAuthenticated, login, logout } = useAuth();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/calendar",
    onSuccess: async (codeResponse) => {
      try {
        // Exchange the code for tokens
        const response = await fetch(tokenUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            code: codeResponse.code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: appUrl,
            grant_type: "authorization_code",
          }),
        });

        const tokens = await response.json();
        
        // Store both access token and refresh token
        sessionStorage.setItem("google_access_token", tokens.access_token);
        sessionStorage.setItem("google_refresh_token", tokens.refresh_token);
        sessionStorage.setItem("token_expiry", (Date.now() + tokens.expires_in * 1000).toString());
        
        // Update auth state
        login();
      } catch (error) {
        console.error("Failed to exchange code for tokens:", error);
      }
    },
    onError: () => {
      console.error("Login Failed");
    },
  });

  if (isAuthenticated) {
    return (
      <Button variant="outline" onClick={logout} className="flex items-center gap-2">
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Button variant="outline" onClick={() => googleLogin()}>
        Sign in with Google
      </Button>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
