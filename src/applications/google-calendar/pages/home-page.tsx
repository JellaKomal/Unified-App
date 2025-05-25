import { cn } from "@/lib/utils";
import { useCalendarSettingsContext } from "../lib/CalendarSettingsContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "@/components/design-system/GoogleLoginButton";
import { useAuth } from "../lib/AuthContext";
import { useEffect, useState, useMemo } from "react";

function HomePage({ className }: { className?: string }) {
  const { bgOpacity } = useCalendarSettingsContext();
  const [time, setTime] = useState(new Date());
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Memoize formatted time to prevent unnecessary re-renders
  const formattedTime = useMemo(() => {
    return time.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      timeZone: "IST",
      timeZoneName: "short",
      hourCycle: "h23",
    }).replace(/\//g, "-");
  }, [time]);

  // Timer to update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [date, timeStr] = formattedTime.split(" at ");
  const timeStr2 = timeStr.split("GMT")[0];
  const Hour = timeStr2.split(":")[0];
  const Minute = timeStr2.split(":")[1];
  const Period = timeStr2.split(":")[2].split(" ")[0];
  const Period2 = timeStr2.split(":")[2].split(" ")[1];
  const Day = date.split(",")[0];
  const Month = date.split(",")[1];
  const Year = date.split(",")[2];

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] bg-background flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Welcome to Calendar App</h1>
        <p className="text-muted-foreground">Please sign in to continue</p>
        <GoogleLoginButton />
      </div>
    );
  }

  return (
    <div className="">
      <div
        className={cn(
          "fixed inset-0 flex flex-col justify-center items-center",
          className,
          location.pathname === "/calendar" ? "z-20 bg-background" : "-z-1"
        )}
        style={{ opacity: location.pathname === "/calendar" ? 1 : bgOpacity }}
        onClick={() => navigate("/calendar/monthly")}
      >
        {/* Time */}
        <div className="flex justify-center items-center">
          <div className="flex flex-row flex-wrap justify-center items-center w-full text-[15vw] font-bold text-primary">
            <span className="px-4 bg-primary text-background">{Hour}</span>
            <span className="px-2">:</span>
            <span className="px-4 bg-primary text-background">{Minute}</span>
            <span className="px-2">:</span>
            <span className="px-4">{Period}</span>
            <span className="px-4 bg-primary text-background">{Period2}</span>
            <span> </span>
          </div>
        </div>

        {/* Date */}
        <div className="flex justify-center items-center gap-10 w-full text-primary mt-10 text-7xl font-bold">
          <span>{Day}</span>
          <span
            className="bg-primary text-background p-4 cursor-pointer" /* enable selection & click here! */
            onClick={() => navigate("/calendar/monthly")}
          >
            {Month}
          </span>
          <span>{Year}</span>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
