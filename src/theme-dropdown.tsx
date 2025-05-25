import { themes } from "./theme-provider";
import { useTheme } from "./theme-provider";
import type { CustomTheme } from "./theme-provider";

export default function ThemeDropdown() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "custom") {
      const customTheme: CustomTheme = {
        name: "Spring Blossom",
        background: "linear-gradient(135deg, #FFB3C1, #FF6F61)",
        navbarBg: "bg-white/90 backdrop-blur",
        textColor: "text-pink-700",
        senderBubble: "bg-pink-500 text-white",
        receiverBubble: "bg-pink-100 text-pink-800",
        ctaPopupBg: "linear-gradient(135deg, #FFB3C1, #FF6F61)",
        ctaTextColor: "text-pink-900",
        screenshotTextColor: "text-pink-600",
        dateTextColor: "text-pink-700",
        timestampColor: "text-pink-400"
      };
      setTheme(customTheme);
    } else {
      setTheme(value);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <select
        value={typeof theme === "string" ? theme : theme.name}
        onChange={handleThemeChange}
        className="border p-2 rounded bg-background text-foreground"
      >
        {themes.map((t) => (
          <option key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
        <option value="custom">Spring Blossom</option>
      </select>
    </div>
  );
}
