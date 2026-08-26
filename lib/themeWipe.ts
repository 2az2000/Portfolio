import { prefersReducedMotion } from "@/lib/theme";

/**
 * The theme switch, revealed by a circle growing out of whatever control was
 * used — the same idea as the language curtain (AGENTS.md §3.7) applied to
 * the other global state flip. Shared by the navbar toggle and the command
 * palette's theme row, so the theme changes the same way however it's reached.
 *
 * This file owns the decision and the geometry; components/ThemeWipe.tsx
 * paints it.
 *
 * ── Why not the View Transitions API ──────────────────────────────────────
 * That was the first implementation, and on paper it is the better effect:
 * the browser snapshots the page before and after, so the new theme is
 * revealed under the circle with its real content rather than as a flat
 * colour.
 *
 * It cannot be used on this page. A view transition has to rasterize the
 * whole viewport into two textures before it can animate anything, and the
 * hero holds a live WebGL canvas (the Spline scene), which forces a GPU
 * readback to capture. Measured across repeated toggles, the gap between
 * calling `startViewTransition()` and the callback actually running was
 * ~530ms with the scene on screen and ~22ms without it — and the page is
 * frozen and unresponsive for that entire time, timers included. Nothing else
 * came close: removing the ambient blur layers or every backdrop-filter on
 * the page changed it by less than the measurement noise. Giving the canvas
 * its own `view-transition-name` doesn't help either, because it is still
 * captured, just into its own layer.
 *
 * So the effect is drawn by hand instead: cover, swap, uncover, exactly the
 * shape LocaleCurtain already uses. One solid circle animating transform and
 * opacity is pure compositor work, it never reads back the GPU, the page
 * stays interactive throughout, and it runs in Firefox and Safari too.
 */

export type Theme = "light" | "dark";

export type WipeOrigin = { x: number; y: number };

export type ThemeWipeRequest = {
  /** Changes per request so the overlay remounts and replays cleanly. */
  id: number;
  /** The theme being switched to — the circle is painted in its page colour. */
  theme: Theme;
  x: number;
  y: number;
  /** Distance from the origin to the farthest viewport corner. */
  radius: number;
  /** next-themes' setter, called once the circle has the page covered. */
  commit: (theme: string) => void;
};

let listener: ((request: ThemeWipeRequest) => void) | null = null;
let nextId = 0;
let busy = false;

/**
 * The theme actually painted right now, read from the DOM rather than from
 * React state.
 *
 * These two can disagree, and the gap is one animation long: the wipe flips
 * the class the moment the page is covered and lets `setTheme` land after. A
 * second click arriving inside that window and deriving its target from the
 * stale React value computes the theme that is *already* on screen, so the
 * click does nothing — pressing the toggle twice quickly used to leave the
 * page on the first theme instead of returning it to the second.
 */
export function currentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Exactly what next-themes does when it commits a theme (verified against its
 * output: a `light`/`dark` class on <html> plus `style.colorScheme`).
 *
 * Doing it by hand at the covered moment is what keeps React off the critical
 * path. Re-rendering every `useTheme()` consumer on the page — the skills
 * constellation, the command palette, the navbar — measured ~27ms of blocked
 * main thread when it ran inline, and the paint doesn't need React at all: it
 * needs two class names. `commit` follows immediately after so state and
 * localStorage still end up in sync, but it renders behind a fully opaque
 * circle where the work cannot be seen.
 */
export function applyThemeClass(theme: string) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

/** Registered by components/ThemeWipe.tsx. Returns its own unsubscribe. */
export function setThemeWipeListener(fn: (request: ThemeWipeRequest) => void) {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}

/** Called by the overlay once it has finished and cleaned itself up. */
export function endThemeWipe() {
  busy = false;
}

export function switchThemeWithWipe(
  next: Theme,
  origin: WipeOrigin | null,
  commit: (theme: string) => void
) {
  // No overlay mounted yet, no motion wanted, or one wipe already running:
  // all three want the same thing, which is the theme, now. Queueing a second
  // circle behind the first is how an impatient double-click turns into a
  // sequence of animations nobody asked for.
  if (!listener || busy || prefersReducedMotion()) {
    applyThemeClass(next);
    commit(next);
    return;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  // Reach the farthest corner, or the circle stops growing while a corner of
  // the page is still showing the old theme.
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  busy = true;
  listener({ id: ++nextId, theme: next, x, y, radius, commit });
}

/** Flips to the other theme, deriving the target from what is actually on
 *  screen. Every caller should use this rather than computing the opposite of
 *  a React value — see {@link currentTheme}. */
export function toggleThemeWithWipe(origin: WipeOrigin | null, commit: (theme: string) => void) {
  switchThemeWithWipe(currentTheme() === "dark" ? "light" : "dark", origin, commit);
}
