import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  label?: string; // Optional label text
  labelClassName?: string; // Custom class for Label
  containerClassName?: string; // Custom class for container div
  iconClassName?: string; // Custom class for icon container
}

export default function InputWithIcon({
  icon,
  label,
  labelClassName,
  containerClassName,
  iconClassName,
  className,
  ...inputProps
}: InputWithIconProps) {
  const id = useId();

  return (
    <div className={cn("*:not-first:mt-2", containerClassName)}>
      {label && (
        <Label
          htmlFor={id}
          className={cn("text-[hsl(var(--foreground))]", labelClassName)}
        >
          {label}
        </Label>
      )}
      <div className="relative">
        <Input id={id} className={cn("peer ps-9", className)} {...inputProps} />
        <div
          className={cn(
            "text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50",
            iconClassName
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
