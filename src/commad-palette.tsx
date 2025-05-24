"use client";

import * as React from "react";
import { Command } from "cmdk";
import { ComputerIcon, Currency, DollarSign, Link, Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export function CommandPalette() {
  const navigate = useNavigate();
  const options = [
    {
      id: "applications",
      name: "List of Applications",
      description: "All application full urls",
      icon: <Link className="h-4 w-4" />,
      onSelect: () => navigate("applications"),
    },
    {
      id: "blogging-app",
      name: "Blogging Application",
      description: "Blogging application for teckies",
      icon: <ComputerIcon className="h-4 w-4" />,
      onSelect: () => navigate("blogging-app"),
    },
    {
      id: "price-tracking-app",
      name: "Price Tracking Application",
      description: "Application where we can track price history",
      icon: <DollarSign className="h-4 w-4" />,
      onSelect: () => navigate("price-tracking-app"),
    },
  ];
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (callback: () => void) => {
    callback();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden max-w-[450px]">
        <Command className="rounded-lg border shadow-md">
          <div
            className="flex items-center border-b px-3"
            cmdk-input-wrapper=""
          >
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <Command.Empty className="py-6 text-center text-sm">
              No results found.
            </Command.Empty>
            {options.map((option) => (
              <Command.Item
                key={option.id}
                value={option.name}
                onSelect={() => handleSelect(option.onSelect)}
                className="relative flex  select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 mx-1 my-0.5 cursor-pointer"
              >
                {option.icon && <div className="mr-2">{option.icon}</div>}
                <div className="flex flex-col">
                  <span>{option.name}</span>
                  {option.description && (
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  )}
                </div>
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
