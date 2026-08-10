"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type XRayContextValue = {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (next: boolean) => void;
};

const XRayContext = createContext<XRayContextValue | null>(null);

/**
 * X-ray mode: press `X` and every region of the page is outlined with the
 * source file that renders it, plus a legend naming the technique behind each
 * one and the four pieces that have no box to outline at all.
 *
 * This is the site's own claim, made checkable — the brief (AGENTS.md §1) is
 * that the experience of using the page is the proof of skill, and this is the
 * seam where a visitor gets to look at how it was built rather than take the
 * claim on faith.
 *
 * State lives in a context rather than in one component because the command
 * palette also toggles it: the keyboard is the natural way in on a desktop,
 * but a phone has no `X` key and would otherwise be locked out of the feature
 * entirely.
 */
export function XRayProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  // The whole visual layer is CSS hanging off this one class (see the X-RAY
  // MODE block in globals.css), so toggling the mode costs a single class
  // mutation and re-renders nothing but the legend. The alternative — passing
  // `enabled` down to every region — would re-render the entire page on a
  // keystroke to change an outline.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("is-xray", enabled);
    return () => root.classList.remove("is-xray");
  }, [enabled]);

  const toggle = useCallback(() => setEnabled((prev) => !prev), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Bare `x` only. With a modifier this is Ctrl/Cmd+X — cut — and
      // stealing that from a visitor mid-selection would be a bug, not a
      // feature.
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      // `code` is the physical key, so this still fires on a Persian keyboard
      // layout where that key produces "ط"; `key` is the fallback for layouts
      // that report no code. Half this site's audience is typing in Persian.
      const isXKey = event.code === "KeyX" || event.key.toLowerCase() === "x";
      if (!isXKey) return;

      // The contact form is a page full of text inputs — typing "example" into
      // it must not strobe the whole layout.
      //
      // `isConnected` guards the case where a field is still the keydown
      // target after being torn out of the DOM — a closing dialog's own input,
      // for instance. A field nobody can see should not be able to swallow
      // the shortcut.
      const target = event.target as HTMLElement | null;
      if (
        target?.isConnected &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      event.preventDefault();
      toggle();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  // Escape leaves the mode, matching every other dismissible layer on the
  // page. Kept separate from the handler above so it can bail early without
  // interfering with the `X` checks.
  useEffect(() => {
    if (!enabled) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // An open dialog (the command palette, the résumé preview) owns Escape:
      // dismissing it should not also tear down the inspection mode the
      // visitor opened it from.
      if (document.querySelector('[role="dialog"][data-state="open"]')) return;
      setEnabled(false);
    };
    // Capture phase, so this runs *before* Radix's own Escape handler on
    // document. In the bubble phase the dialog has already closed itself by
    // the time this fires, the check above finds nothing open, and a single
    // Escape ends up dismissing both layers at once.
    window.addEventListener("keydown", onEscape, true);
    return () => window.removeEventListener("keydown", onEscape, true);
  }, [enabled]);

  return (
    // The legend is mounted by Providers rather than here, so this file never
    // imports the component that consumes its context — an import cycle that
    // resolves at render time is a fuse waiting for someone to move a call.
    <XRayContext.Provider value={{ enabled, toggle, setEnabled }}>
      {children}
    </XRayContext.Provider>
  );
}

export function useXRay() {
  const ctx = useContext(XRayContext);
  if (!ctx) {
    throw new Error("useXRay() must be used inside <XRayProvider>");
  }
  return ctx;
}
