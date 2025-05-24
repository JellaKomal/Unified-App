import {
  ContextMenuCheckboxItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "./components/ui/context-menu";
import { ContextMenuItem } from "./components/ui/context-menu";
 import { ContextMenuContent } from "./components/ui/context-menu";
import { themes, useTheme } from "./theme-provider";
import { cn } from "./lib/utils";

function ContextBody() {
  const { theme: currentTheme, setTheme } = useTheme();
  return (
    <div>
      <ContextMenuContent className="w-64 z-100">
        {/* <ContextMenuItem inset>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem> */}
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Theme Option</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48 h-50 overflow-y-auto">
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
        {/* <ContextMenuSeparator /> */}
        {/* <ContextMenuCheckboxItem checked>
          Show Bookmarks Bar
          <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
        </ContextMenuCheckboxItem> */}
        {/* <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem> */}
        {/* <ContextMenuSeparator /> */}
        <ContextMenuRadioGroup value="pedro">
          {/* <ContextMenuLabel inset>People</ContextMenuLabel> */}
          <ContextMenuSeparator />
          {/* <ContextMenuRadioItem value="pedro">
            Pedro Duarte
          </ContextMenuRadioItem> */}
          <ContextMenuRadioItem value="colm">Analyse</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </div>
  );
}

export default ContextBody;
