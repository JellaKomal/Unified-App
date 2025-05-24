import React, { createContext, useContext, useEffect, useState } from "react";

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
  theme: string;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<string>(
    () => localStorage.getItem("theme") || "red"
  );

  useEffect(() => {
    // Remove all previous theme-* classes
    const root = document.documentElement;
    root.className = root.className
      .split(" ")
      .filter((c) => !c.startsWith("theme-"))
      .join(" ");

    // Add new theme class
    root.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
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
