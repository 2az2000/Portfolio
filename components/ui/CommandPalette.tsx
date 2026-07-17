"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { Search, FileCode2, Layers, Mail } from "lucide-react";
import { EASE_BRAND } from "@/lib/theme";

type PaletteItem = {
  id: string;
  label: string;
  hint: string;
  icon: typeof FileCode2;
};

const MOCK_ITEMS: PaletteItem[] = [
  { id: "projects", label: "Go to Projects", hint: "section", icon: Layers },
  { id: "playground", label: "Open Playground", hint: "section", icon: FileCode2 },
  { id: "contact", label: "Send a message", hint: "action", icon: Mail },
];

/**
 * A self-contained ⌘K-style preview: press the trigger (or Cmd/Ctrl+K while
 * this component is mounted) to open a live-filtered mock command list.
 * This is a demo of the pattern, not a full site-wide command router.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className="focus-ring flex w-full max-w-sm items-center justify-between gap-3 rounded-lg border border-line bg-white/[0.03] px-4 py-3 text-sm text-mist transition-colors duration-fast ease-brand hover:border-violet/30 dark:hover:border-white/20"
      >
        <span className="flex items-center gap-2">
          <Search size={16} />
          Search anything...
        </span>
        <kbd className="rounded border border-line bg-white/[0.04] px-1.5 py-0.5 font-mono text-xs">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-void/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed left-1/2 top-32 z-50 w-full max-w-lg -translate-x-1/2"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: EASE_BRAND }}
            >
              <Command
                label="Command palette preview"
                className="overflow-hidden rounded-lg border border-line bg-surface shadow-glass dark:border-white/[0.12]"
              >
                <div className="flex items-center gap-2 border-b border-line px-4">
                  <Search size={16} className="text-mist" />
                  <Command.Input
                    autoFocus
                    placeholder="Type a command..."
                    className="w-full bg-transparent py-3 text-sm text-ink outline-none placeholder:text-mist"
                  />
                </div>
                <Command.List className="max-h-72 overflow-y-auto p-2">
                  <Command.Empty className="px-4 py-6 text-center text-sm text-mist">
                    No results found.
                  </Command.Empty>
                  <Command.Group
                    heading="Suggestions"
                    className="caption px-2 pb-1 pt-2 [&_[cmdk-group-heading]]:caption"
                  >
                    {MOCK_ITEMS.map((item) => (
                      <Command.Item
                        key={item.id}
                        onSelect={() => setOpen(false)}
                        className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-ink data-[selected=true]:bg-violet/10 dark:data-[selected=true]:bg-white/[0.06]"
                      >
                        <span className="flex items-center gap-2">
                          <item.icon size={15} className="text-violet-soft" />
                          {item.label}
                        </span>
                        <span className="caption">{item.hint}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
