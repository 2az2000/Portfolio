"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, FileText, Github, Mail, type LucideIcon } from "lucide-react";
import { gsap } from "gsap";
import { useLanguage } from "@/components/LanguageProvider";
import { DURATION, EASE_BRAND_CSS, STAGGER_BASE, prefersReducedMotion } from "@/lib/theme";

/**
 * The strip that closes the hero: a single compact rail of facts a visitor
 * actually wants in the first screen — what I'm doing now, what time it is
 * where I am, the newest thing that shipped, and the three links they'd
 * otherwise scroll to Contact for.
 *
 * It replaces the earlier "proof cluster" (a fake typing editor, a fake
 * commit hash, and a second availability badge duplicating the hero's own
 * status pill). That version was 420px of mock UI that said nothing real —
 * AGENTS.md §3.1 asks for *real, working* pieces, and a code card typing a
 * made-up snippet is exactly the promise-instead-of-proof it warns against.
 * Every value below is read from the same dictionary data that drives
 * Experience/Projects/Contact, so the rail cannot drift out of sync, and
 * the clock is a genuinely live component rather than a prop.
 */

/** Where I actually am — the clock and its GMT offset are both derived from
 *  this, never hand-typed (Iran has no DST, but the offset is still read
 *  from Intl rather than written as a literal). */
const TIMEZONE = "Asia/Tehran";

export function HeroCluster() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { time, offset } = useLocalTime();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pieces = container.querySelectorAll<HTMLElement>("[data-piece]");
    if (!pieces.length) return;

    if (prefersReducedMotion()) {
      gsap.set(pieces, { opacity: 1, y: 0 });
      return;
    }

    // Cells rise into place one after another (AGENTS.md §3.1's assembly
    // effect, kept). Deliberately no `x` offset: an off-canvas horizontal
    // start position counts toward the page's scrollable overflow (see the
    // note on `html` in globals.css), and a rail this wide has no room for
    // one anyway.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pieces,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE_BRAND_CSS,
          stagger: STAGGER_BASE,
          delay: 0.15,
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  // Newest first in the dictionary, so entry 0 is the current role.
  const current = t.experience.items[0];
  // The flagship project, the same one Projects renders in its 2x2 cell.
  const latest = t.projects.items.find((item) => item.featured) ?? t.projects.items[0];
  const latestHost = hostOf(latest.href);

  return (
    <div
      ref={containerRef}
      className="glass grid grid-cols-2 overflow-hidden rounded-lg lg:grid-cols-4"
    >
      {/* Two columns until lg, where all four cells fit one row without the
          role wrapping. The two text-heaviest cells take a full row of their
          own on narrow screens, so nothing here is ever a three-line stack in
          a 150px column.

          Dividers are drawn per cell rather than with `divide-*`: the grid
          reflows, so which edge needs a rule changes with the breakpoint —
          and logical `border-s` keeps that correct under RTL, which
          `divide-x` (physical, and reversed) does not. */}
      <RailCell label={t.hero.rail.now} className="col-span-2 lg:col-span-1">
        <p className="text-base leading-snug text-ink">{current.role}</p>
        <p className="mt-1 truncate font-mono text-xs text-mist">{current.company}</p>
      </RailCell>

      <RailCell label={t.hero.rail.localTime} className="border-t lg:border-s lg:border-t-0">
        {/* tabular-nums so the minute ticking over never nudges the layout */}
        <p className="font-mono text-base leading-snug tabular-nums text-ink">{time ?? "--:--"}</p>
        <p className="mt-1 truncate font-mono text-xs text-mist">
          {t.hero.rail.city}
          {offset ? ` · ${offset}` : ""}
        </p>
      </RailCell>

      <RailCell
        label={t.hero.rail.latest}
        className="border-s border-t lg:border-t-0"
        // A placeholder "#" href (Face Age has no public URL yet) would be a
        // link that goes nowhere, so the cell stays plain text until there is
        // something real to open.
        href={latestHost ? latest.href : undefined}
      >
        <p className="flex items-center gap-1.5 text-base leading-snug text-ink transition-colors duration-fast ease-brand group-hover:text-violet-soft">
          {latest.title}
          {latestHost && <ArrowUpRight size={15} className="shrink-0" />}
        </p>
        <p className="mt-1 truncate font-mono text-xs text-mist">{latestHost ?? latest.context}</p>
      </RailCell>

      <RailCell
        label={t.hero.rail.links}
        className="col-span-2 border-t lg:col-span-1 lg:border-s lg:border-t-0"
      >
        <div className="flex items-center gap-2">
          <RailLink href={t.contact.github} label={t.hero.rail.github} Icon={Github} />
          <RailLink href={`mailto:${t.contact.email}`} label={t.hero.rail.email} Icon={Mail} />
          <RailLink
            href={t.contact.resume.pdfUrl}
            label={t.contact.resume.eyebrow}
            Icon={FileText}
            download={t.contact.resume.pdfFileName}
          />
        </div>
      </RailCell>
    </div>
  );
}

/** One labelled cell of the rail. Renders as an anchor when `href` is given,
 *  so the whole cell — not just its title — is the click target. */
function RailCell({
  label,
  href,
  className = "",
  children,
}: {
  label: string;
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const shared = `group flex flex-col justify-center border-line px-5 py-4 ${className}`;

  if (href) {
    return (
      <a
        data-piece
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${shared} focus-ring transition-colors duration-fast ease-brand hover:bg-white/[0.03]`}
      >
        <span className="caption mb-2 block">{label}</span>
        {children}
      </a>
    );
  }

  return (
    <div data-piece className={shared}>
      <span className="caption mb-2 block">{label}</span>
      {children}
    </div>
  );
}

function RailLink({
  href,
  label,
  Icon,
  download,
}: {
  href: string;
  label: string;
  Icon: LucideIcon;
  download?: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      download={download}
      // Downloads stay in place; the outbound ones open in a new tab so the
      // visitor never loses the page they were reading.
      target={download ? undefined : "_blank"}
      rel={download ? undefined : "noopener noreferrer"}
      className="focus-ring flex h-9 w-9 items-center justify-center rounded-pill border border-line text-mist transition-colors duration-fast ease-brand hover:border-violet/40 hover:bg-violet/10 hover:text-ink"
    >
      <Icon size={16} />
    </a>
  );
}

/**
 * The one genuinely live piece of the rail: local time in {@link TIMEZONE},
 * re-aligned to each real minute boundary instead of ticking on a fixed
 * 60s interval (which drifts, and would show a minute that is up to 59s
 * stale). Formatted on the client only — rendering a clock during SSR
 * guarantees a hydration mismatch.
 */
function useLocalTime() {
  const [time, setTime] = useState<string | null>(null);
  const [offset, setOffset] = useState<string | null>(null);

  useEffect(() => {
    // en-GB (not the active locale) on purpose: it gives 24h Latin digits,
    // matching the numerals the rest of the page uses in both languages.
    const clock = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: TIMEZONE,
    });
    const zone = new Intl.DateTimeFormat("en-GB", {
      timeZone: TIMEZONE,
      timeZoneName: "shortOffset",
    });

    setOffset(
      zone.formatToParts(new Date()).find((part) => part.type === "timeZoneName")?.value ?? null
    );

    let timeoutId: ReturnType<typeof setTimeout>;
    const tick = () => {
      const now = new Date();
      setTime(clock.format(now));
      timeoutId = setTimeout(tick, 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds()));
    };
    tick();

    return () => clearTimeout(timeoutId);
  }, []);

  return { time, offset };
}

/** Bare hostname for display, or null when the entry is still a "#"
 *  placeholder (see the TODOs in lib/i18n). */
function hostOf(href: string): string | null {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
