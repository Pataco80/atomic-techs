"use client";

import {
  CmdOrOption,
  KeyboardShortcut,
} from "@/components/nowts/keyboard-shortcut";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { APP_LINKS } from "./app-navigation.links";

export function AppCommand() {
  const router = useRouter();
  // Tracks the live command-palette dialog so we can toggle/close it.
  const dialogIdRef = useRef<string | null>(null);

  const closeCommand = () => {
    if (dialogIdRef.current) {
      dialogManager.close(dialogIdRef.current);
      dialogIdRef.current = null;
    }
  };

  const openCommand = () => {
    // Toggle: a second trigger (⌘K or click) closes the palette.
    if (dialogIdRef.current) {
      closeCommand();
      return;
    }

    const id = dialogManager.custom({
      title: "Rechercher une commande",
      // Closes on outside-click / Escape and shows a close (X) button.
      dismissible: true,
      // Edge-to-edge command surface — drop the default dialog padding. The
      // `[&>button]` rules restyle the Shadcn DialogContent close (X) to match
      // the form-sheet cancel button (resting fill like the sidebar trigger,
      // destructive on hover) without touching the Shadcn primitive.
      className:
        "overflow-hidden p-0 sm:max-w-lg [&>button]:inline-flex [&>button]:size-9 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-background [&>button]:opacity-100 [&>button]:shadow-xs [&>button]:hover:bg-destructive/10 [&>button]:hover:text-destructive dark:[&>button]:bg-input/30 dark:[&>button]:hover:bg-destructive/20",
      // Keep the ref in sync when closed via Escape / outside / close button.
      onClose: () => {
        dialogIdRef.current = null;
      },
      children: (
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-16 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5">
          {/* pr-9 leaves room for the dialog's close (X) button. */}
          <CommandInput
            placeholder="Type a command or search..."
            className="pr-9"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {APP_LINKS.map((group, index) => (
              <CommandGroup heading={group.title} key={index}>
                {group.links.map((link) => (
                  <CommandItem
                    key={link.href}
                    // iOS-style pill row with a soft selected state (matches
                    // the sidebar active row) instead of the harsh blue accent.
                    className="data-[selected=true]:bg-ios-separator/60 data-[selected=true]:text-foreground rounded-xl"
                    onSelect={() => {
                      router.push(link.href);
                      closeCommand();
                    }}
                  >
                    <link.Icon className="mr-2 size-4" />
                    <span>{link.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      ),
    });
    dialogIdRef.current = id;
  };

  useHotkeys("mod+k", (event) => {
    event.preventDefault();
    openCommand();
  });

  return (
    <div className="relative w-full">
      <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
      <Input
        type="search"
        placeholder="Search..."
        className="bg-background w-full appearance-none rounded-full pl-8 shadow-none"
        onClick={openCommand}
      />

      <div className="pointer-events-none absolute top-2 right-2.5 inline-flex h-5 items-center gap-1 select-none">
        <KeyboardShortcut
          eventKey="cmd"
          className="bg-foreground/70 ring-foreground/10 border-transparent text-white dark:bg-white/15 dark:text-white"
        >
          <CmdOrOption />
        </KeyboardShortcut>
        <KeyboardShortcut
          eventKey="k"
          className="bg-foreground/70 ring-foreground/10 border-transparent text-white dark:bg-white/15 dark:text-white"
        >
          K
        </KeyboardShortcut>
      </div>
    </div>
  );
}
