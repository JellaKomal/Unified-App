import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuSeparator,
} from "./components/ui/context-menu";
import { useContextMenuManager } from "./ContextMenuManager";
import { themes, useTheme } from "./theme-provider";
import { cn } from "./lib/utils";

export default function DynamicContextMenu() {
  const { state } = useContextMenuManager();
  const { theme: currentTheme, setTheme } = useTheme();

  const defaultItems = [
    {
      id: "theme-switcher",
      type: "themeSwitcher",
    },
    {
      id: "separator-1",
      type: "separator",
    },
    {
      id: "back",
      type: "item",
      label: "Back",
      onClick: () => window.history.back(),
    },
    {
      id: "forward",
      type: "item",
      label: "Forward",
      onClick: () => window.history.forward(),
    },
    {
      id: "reload",
      type: "item",
      label: "Reload",
      onClick: () => window.location.reload(),
    },
  ];

  const renderItem = (item: any) => {
    switch (item.type) {
      case "item":
        return (
          <ContextMenuItem key={item.id} onClick={item.onClick} className={item.className}>
            {item.label}
          </ContextMenuItem>
        );
      case "separator":
        return <ContextMenuSeparator key={item.id} />;
      case "submenu":
        return (
          <ContextMenuSub key={item.id}>
            <ContextMenuSubTrigger className="rounded-none">{item.label}</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48 rounded-none overflow-y-auto max-h-48">
              {item.items?.map(renderItem)}
            </ContextMenuSubContent>
          </ContextMenuSub>
        );
      case "themeSwitcher":
        return (
          <ContextMenuSub key={item.id}>
            <ContextMenuSubTrigger className="rounded-none">Theme Option</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48 h-50 overflow-y-auto rounded-none">
              {themes.map((theme) => (
                <ContextMenuItem
                  key={theme}
                  onClick={() => setTheme(theme)}
                  className={cn(currentTheme === theme && "bg-accent")}
                >
                  {theme}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
        );
      default:
        return null;
    }
  };

  // Combine default items with dynamic state items
  const allItems = [...defaultItems, ...state];

  return (
    <ContextMenuContent className="w-48 rounded-none z-100">
      {allItems.map(renderItem)}
    </ContextMenuContent>
  );
}
