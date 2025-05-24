import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { CommandPalette } from "./commad-palette.tsx";
import { ThemeProvider } from "./theme-provider.tsx";
import DynamicContextMenu from "./dynamic-context-menu.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ContextMenuProvider } from "./ContextMenuManager.tsx";

const clientId =
  "523879727712-7lsr2ogptblv0lgnnk3eceg2e2ctad66.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <ContextMenuProvider>
        <BrowserRouter>
          <ThemeProvider>
            <CommandPalette />
            <ContextMenu>
              <ContextMenuTrigger>
                <App />
              </ContextMenuTrigger>
              <DynamicContextMenu />
            </ContextMenu>
          </ThemeProvider>
        </BrowserRouter>
      </ContextMenuProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
