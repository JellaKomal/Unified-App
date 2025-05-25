import React, { createContext, useContext, useEffect, useState } from "react";

export type CustomTheme = {
  name: string;
  background: string;
  navbarBg: string;
  textColor: string;
  senderBubble: string;
  receiverBubble: string;
  ctaPopupBg: string;
  ctaTextColor: string;
  screenshotTextColor: string;
  dateTextColor: string;
  timestampColor: string;
};

export const themes = [
  "light",
  "dark",
  "orange",
  "orange-dark",
  "violet",
  "violet-dark",
  "red",
  "red-dark",
  "rose",
  "rose-dark",
  "blue",
  "blue-dark",
  "yellow",
  "yellow-dark",
  "green",
  "green-dark",
];

type ThemeContextType = {
  theme: string | CustomTheme;
  setTheme: (theme: string | CustomTheme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<string | CustomTheme>(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      try {
        return JSON.parse(savedTheme);
      } catch {
        return savedTheme;
      }
    }
    return "red";
  });

  useEffect(() => {
    // Remove all previous theme-* classes
    const root = document.documentElement;
    root.className = root.className
      .split(" ")
      .filter((c) => !c.startsWith("theme-"))
      .join(" ");

    if (typeof theme === "string") {
      // Add new theme class for predefined themes
      root.classList.add(`theme-${theme}`);
    } else {
      // Apply custom theme styles
      Object.entries(theme).forEach(([key, value]) => {
        if (key !== "name") {
          root.style.setProperty(`--${key}`, value);
        }
      });
    }
    
    localStorage.setItem("theme", typeof theme === "string" ? theme : JSON.stringify(theme));
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
