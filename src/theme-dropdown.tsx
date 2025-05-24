import { themes } from "./theme-provider";
import { useTheme } from "./theme-provider";

export default function ThemeDropdown() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="border p-2 rounded bg-background text-foreground"
      >
        {themes.map((t) => (
          <option key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
