import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"; 

const GoogleLoginButton = () => {
  const clientId =
    "523879727712-7lsr2ogptblv0lgnnk3eceg2e2ctad66.apps.googleusercontent.com"; // Replace with your Google OAuth Client ID

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log("Login Success:", credentialResponse);
          // Handle JWT token (credentialResponse.credential) here
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
