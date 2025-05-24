// GoogleLoginButton.tsx
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

const clientId =
  "523879727712-7lsr2ogptblv0lgnnk3eceg2e2ctad66.apps.googleusercontent.com";

const GoogleLoginButton = () => {
  const login = useGoogleLogin({
    flow: "implicit", // or "auth-code" if using server-side exchange
    scope: "https://www.googleapis.com/auth/calendar",
    prompt: "consent",
    onSuccess: (tokenResponse) => {
      console.log("Login success", tokenResponse);

      sessionStorage.setItem("google_access_token", tokenResponse.access_token);
    },
    onError: () => {
      console.error("Login Failed");
    },
  });

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <button onClick={() => login()}>Sign in with Google</button>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
