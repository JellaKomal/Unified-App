import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { CommandPalette } from "./commad-palette.tsx";
import { ThemeProvider } from "./theme-provider.tsx";
import ContextBody from "./context-body.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <CommandPalette />
        <ContextMenu>
          <ContextMenuTrigger>
            <App />
          </ContextMenuTrigger>
          <ContextBody />
        </ContextMenu>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
