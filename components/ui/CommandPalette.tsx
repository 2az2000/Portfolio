"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Download,
  ExternalLink,
  FolderGit2,
  Languages,
  Mail,
  Moon,
  ScanLine,
  Search,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useXRay } from "@/components/XRayProvider";
import { scrollToId } from "@/lib/smoothScroll";
import { NAV_SECTIONS } from "@/lib/navSections";
import { normalizeQuery, scoreFields } from "@/lib/fuzzy";
import { toggleThemeWithWipe } from "@/lib/themeWipe";
import { cn } from "@/lib/utils";

type GroupId = "navigate" | "projects" | "caseStudies" | "actions";

type Command = {
  id: string;
  group: GroupId;
  label: string;
  /** Secondary line — also searched. */
  hint?: string;
  /** Extra searchable text that isn't worth showing (stack names, aliases). */
  keywords?: string;
  icon: LucideIcon;
  /** Marks rows that leave the site, so the row can say so before it's used. */
  external?: boolean;
  disabled?: boolean;
  /**
   * Rows whose whole result is feedback inside the palette (copy to
   * clipboard). Closing on those would hide the only confirmation there is.
   */
  keepOpen?: boolean;
  run: () => void;
};

const GROUP_ORDER: GroupId[] = ["navigate", "projects", "caseStudies", "actions"];

/** How long the "copied" state sticks before the row reverts. */
const COPIED_MS = 1600;

const OPEN_EVENT = "portfolio:open-command-palette";

/**
 * Opens the palette from anywhere (the navbar button). A window event rather
 * than another context: the palette already owns a global key listener, so
 * this adds no new wiring, and it keeps the component's open state private
 * instead of hoisting it into a provider that only one consumer would read.
 */
export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/**
 * ⌘K / Ctrl+K palette (AGENTS.md §3.2).
 *
 * Every row is built from the same dictionary the page itself renders from —
 * sections, projects, case studies — so the palette can't offer something the
 * page doesn't have, and a new project appears here the moment it's added to
 * `lib/i18n`. The actions are the real controls, not shortcuts to them: the
 * language row drives the same curtain transition as the navbar toggle, and
 * the X-ray row is the only way into that mode on a device with no keyboard.
 */
export function CommandPalette() {
  const { t, dir, locale, setLocale, isSwapping } = useLanguage();
  const { enabled: xrayEnabled, toggle: toggleXRay } = useXRay();
  const { theme, setTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const copiedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Held between "the visitor picked a row" and "the dialog has finished
  // closing" — see onCloseAutoFocus below for why the two can't be simultaneous.
  const pendingAction = useRef<(() => void) | null>(null);
  /** Whatever had focus when the palette opened — see the close handler. */
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(
    () => () => {
      if (copiedTimeout.current) clearTimeout(copiedTimeout.current);
    },
    []
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) return;
      // `code` first so the shortcut survives a Persian keyboard layout, where
      // that physical key produces "ن".
      const isK = event.code === "KeyK" || event.key.toLowerCase() === "k";
      if (!isK) return;
      // Chrome gives Ctrl+K to the address bar otherwise.
      event.preventDefault();
      setOpen((prev) => !prev);
    };

    const onExternalOpen = () => setOpen(true);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_EVENT, onExternalOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_EVENT, onExternalOpen);
    };
  }, []);

  const commands = useMemo<Command[]>(() => {
    // Nothing to build while the palette is shut, and this list depends on the
    // theme — so without the guard every theme switch rebuilt all two dozen
    // rows and re-rendered a closed dialog, right in the middle of the frame
    // where the browser is already restyling the entire page.
    if (!open) return [];

    const list: Command[] = [];

    // "Go to" points along the reading direction, the same way the hero's CTA
    // arrow does — an arrow that points back the way you read is an arrow
    // pointing at where you came from.
    const GoIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

    for (const section of NAV_SECTIONS) {
      list.push({
        id: `nav-${section.id}`,
        group: "navigate",
        label: t.nav[section.key],
        icon: GoIcon,
        run: () => scrollToId(section.id),
      });
    }

    for (const project of t.projects.items) {
      // `#` is the placeholder for products with no public URL yet (see
      // lib/i18n/en.ts); those scroll to the grid instead of opening a
      // link that goes nowhere.
      const hasLink = project.href !== "#";
      list.push({
        id: `project-${project.title}`,
        group: "projects",
        label: project.title,
        hint: project.context,
        keywords: project.stack.join(" "),
        icon: FolderGit2,
        external: hasLink,
        run: () => {
          if (hasLink) window.open(project.href, "_blank", "noopener,noreferrer");
          else scrollToId("projects");
        },
      });
    }

    for (const study of t.caseStudies.items) {
      list.push({
        id: `case-${study.title}`,
        group: "caseStudies",
        label: study.title,
        hint: study.tagline,
        keywords: study.stack.join(" "),
        icon: BookOpen,
        run: () => scrollToId("case-studies"),
      });
    }

    const nextLocale = locale === "en" ? "fa" : "en";
    const isDark = theme === "dark";

    list.push(
      {
        id: "action-theme",
        group: "actions",
        label: isDark ? t.palette.actions.themeToLight : t.palette.actions.themeToDark,
        icon: isDark ? Sun : Moon,
        // next-themes has no theme until it has read storage; acting on the
        // pre-mount default would flip the wrong way for a light-mode visitor.
        disabled: !mounted,
        // Same wipe as the navbar toggle, so the theme changes the same way
        // however it's reached. No origin: the palette this row lived in is
        // already gone by the time it runs, so the circle opens from the
        // centre rather than from a control that isn't on screen any more.
        run: () => toggleThemeWithWipe(null, setTheme),
      },
      {
        id: "action-locale",
        group: "actions",
        label: t.palette.actions.language,
        icon: Languages,
        // A second swap queued under the curtain flips direction twice — the
        // same lock the navbar's segmented control uses.
        disabled: isSwapping,
        run: () => setLocale(nextLocale),
      },
      {
        id: "action-xray",
        group: "actions",
        label: xrayEnabled ? t.palette.actions.xrayOff : t.palette.actions.xrayOn,
        hint: t.palette.actions.xrayHint,
        icon: ScanLine,
        run: toggleXRay,
      },
      {
        id: "action-email",
        group: "actions",
        label: copied ? t.palette.actions.copied : t.palette.actions.copyEmail,
        hint: t.contact.email,
        icon: copied ? Check : Mail,
        keepOpen: true,
        run: () => {
          void navigator.clipboard?.writeText(t.contact.email).then(() => {
            setCopied(true);
            if (copiedTimeout.current) clearTimeout(copiedTimeout.current);
            copiedTimeout.current = setTimeout(() => setCopied(false), COPIED_MS);
          });
        },
      },
      {
        id: "action-resume",
        group: "actions",
        label: t.palette.actions.resume,
        icon: Download,
        external: true,
        run: () => window.open(t.contact.resume.pdfUrl, "_blank", "noopener,noreferrer"),
      }
    );

    return list;
  }, [
    open,
    t,
    dir,
    locale,
    theme,
    mounted,
    isSwapping,
    xrayEnabled,
    copied,
    setLocale,
    setTheme,
    toggleXRay,
  ]);

  /**
   * Groups are kept even while searching — a flat relevance list loses the one
   * piece of context that tells a reader whether "Brookli" is a project or a
   * case study. Ordering is by best score *within* each group and then by each
   * group's best row, so relevance still decides what sits at the top.
   */
  const groups = useMemo(() => {
    const needle = normalizeQuery(query);

    const scored = commands
      .map((command) => ({
        command,
        score: needle ? scoreFields(needle, [command.label, command.hint, command.keywords]) : 0,
      }))
      .filter((entry) => entry.score >= 0);

    const byGroup = GROUP_ORDER.map((group) => ({
      group,
      entries: scored.filter((entry) => entry.command.group === group),
    })).filter((bucket) => bucket.entries.length > 0);

    if (!needle) {
      return byGroup.map((bucket) => ({
        group: bucket.group,
        items: bucket.entries.map((entry) => entry.command),
      }));
    }

    return byGroup
      .map((bucket) => ({
        group: bucket.group,
        best: Math.max(...bucket.entries.map((entry) => entry.score)),
        items: [...bucket.entries].sort((a, b) => b.score - a.score).map((entry) => entry.command),
      }))
      .sort((a, b) => b.best - a.best);
  }, [commands, query]);

  /** The rendered order, flattened — what the arrow keys actually walk. */
  const flat = useMemo(() => groups.flatMap((bucket) => bucket.items), [groups]);

  // A stale index after the list shrinks would leave the highlight on nothing
  // and Enter doing nothing.
  useEffect(() => {
    setActiveIndex((current) => (current < flat.length ? current : 0));
  }, [flat.length]);

  useEffect(() => {
    if (open) {
      // Remembered so focus can be handed back deliberately on close. Radix
      // restores focus to a Dialog.Trigger, and this palette has none — it is
      // opened from a keyboard shortcut and from a button elsewhere in the
      // tree, so the restore is ours to do.
      openerRef.current = document.activeElement as HTMLElement | null;
      return;
    }
    setQuery("");
    setActiveIndex(0);
  }, [open]);

  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, groups]);

  const execute = useCallback((command: Command) => {
    if (command.disabled) return;
    if (command.keepOpen) {
      command.run();
      return;
    }
    // Deferred rather than run here: closing the dialog hands focus back to
    // whatever opened it, and Radix does that by focusing the trigger — which
    // scrolls the page to it, undoing the scroll this row just asked for.
    pendingAction.current = command.run;
    setOpen(false);
  }, []);

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (flat.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % flat.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((current) => (current - 1 + flat.length) % flat.length);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(flat.length - 1);
        break;
      case "Enter": {
        event.preventDefault();
        const command = flat[activeIndex];
        if (command) execute(command);
        break;
      }
    }
  };

  const activeId = flat[activeIndex]?.id;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-void/70 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content
          dir={dir}
          aria-label={t.palette.title}
          onCloseAutoFocus={(event) => {
            // Radix's own restore is always suppressed: with no
            // Dialog.Trigger to aim at, it leaves focus sitting on the search
            // input that is on its way out — which then swallows the next `X`
            // keystroke, because a focused text field is exactly what the
            // X-ray shortcut refuses to fire inside.
            event.preventDefault();

            const action = pendingAction.current;
            pendingAction.current = null;

            if (action) {
              // Focus deliberately goes nowhere here. Handing it back to the
              // navbar button would scroll the page up to it, undoing the
              // scroll this row just asked for.
              (document.activeElement as HTMLElement | null)?.blur?.();
              action();
              return;
            }

            // Plain dismissal: focus returns where it came from, which is what
            // a keyboard visitor expects after Escape.
            const opener = openerRef.current;
            if (opener?.isConnected) opener.focus();
            else (document.activeElement as HTMLElement | null)?.blur?.();
          }}
          className={cn(
            "fixed start-1/2 top-[12vh] z-[70] flex max-h-[68vh] w-[min(94vw,34rem)] -translate-x-1/2 flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-glass rtl:translate-x-1/2",
            "data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
        >
          <Dialog.Title className="sr-only">{t.palette.title}</Dialog.Title>
          <Dialog.Description className="sr-only">{t.palette.description}</Dialog.Description>

          <div className="flex items-center gap-3 border-b border-line px-4">
            <Search size={16} className="shrink-0 text-mist" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onInputKeyDown}
              placeholder={t.palette.placeholder}
              role="combobox"
              aria-expanded
              aria-controls="command-palette-list"
              aria-activedescendant={activeId ? `command-${activeId}` : undefined}
              className="w-full bg-transparent py-4 text-body text-ink outline-none placeholder:text-mist"
            />
          </div>

          <div
            id="command-palette-list"
            ref={listRef}
            role="listbox"
            aria-label={t.palette.title}
            // Lenis would otherwise take a wheel gesture over the open palette
            // as a request to scroll the page behind it.
            data-lenis-prevent
            className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-2"
          >
            {flat.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-mist">{t.palette.empty}</p>
            ) : (
              groups.map((bucket) => (
                <div key={bucket.group} className="mb-1 last:mb-0">
                  <p className="caption px-3 py-2">{t.palette.groups[bucket.group]}</p>
                  {bucket.items.map((command) => {
                    const index = flat.indexOf(command);
                    return (
                      <CommandRow
                        key={command.id}
                        command={command}
                        active={index === activeIndex}
                        onHover={() => setActiveIndex(index)}
                        onSelect={() => execute(command)}
                      />
                    );
                  })}
                </div>
              ))
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line px-4 py-2.5 font-mono text-xs text-mist">
            <Hint keys="↑↓" label={t.palette.hints.navigate} />
            <Hint keys="↵" label={t.palette.hints.select} />
            <Hint keys="esc" label={t.palette.hints.close} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CommandRow({
  command,
  active,
  onHover,
  onSelect,
}: {
  command: Command;
  active: boolean;
  onHover: () => void;
  onSelect: () => void;
}) {
  const Icon = command.icon;

  return (
    <button
      type="button"
      id={`command-${command.id}`}
      role="option"
      aria-selected={active}
      data-active={active}
      disabled={command.disabled}
      onMouseMove={onHover}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start transition-colors duration-fast ease-brand",
        // Dark keeps the navbar's active-pill wash, so "selected" reads the
        // same across the site. Light can't: white-on-white is invisible, and
        // this highlight is the only thing telling a keyboard user which row
        // Enter will run — so it gets a violet tint that survives the surface.
        active ? "bg-violet/15 text-ink dark:bg-white/[0.08]" : "text-mist",
        command.disabled && "pointer-events-none opacity-40"
      )}
    >
      <Icon
        size={15}
        className={cn("shrink-0", active ? "text-violet dark:text-violet-soft" : "text-mist")}
        aria-hidden
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-ink">{command.label}</span>
        {command.hint && <span className="block truncate text-xs text-mist">{command.hint}</span>}
      </span>
      {command.external && <ExternalLink size={13} className="shrink-0 text-mist" aria-hidden />}
    </button>
  );
}

function Hint({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <kbd className="rounded border border-line px-1.5 py-0.5 text-ink">{keys}</kbd>
      {label}
    </span>
  );
}
