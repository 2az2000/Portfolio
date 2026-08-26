"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// --- Configuration ---
const SCRAMBLE_SPEED = 10;
const CYCLES_PER_LETTER = 3;
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";

interface HyperTextProps {
  text: string;
  className?: string;
  highlightWords?: string[];
}

/**
 * Normalises a word for comparison — case, punctuation, and the characters a
 * caller cannot see in their own list. Persian compounds are written with a
 * zero-width non-joiner ("فرانت‌اند"), so without stripping it no Persian
 * word could ever match an entry someone typed without one.
 */
const clean = (w: string) =>
  w
    .toLowerCase()
    .replace(/[،،؛؛"'"()\[\]{}<>:;,.!?\-_=+*/\|@#$%^&*~`]/g, "")
    .replace(/[\u200B-\u200F\u061C\uFEFF]/g, "")
    .trim();

/**
 * A word that answers to hover: it scramble-decrypts, lifts off the line and
 * lights up, while the rest of the paragraph dims behind it.
 *
 * Only the scramble holds React state — one word's worth, only while that
 * word is hovered. The lift, the colour, the panel behind it, the corner
 * dots and the dimming of every *other* word are all CSS. That split is the
 * point: this used to raise a `hovered` flag into the paragraph, which
 * re-rendered all ~60 words on every hover and cost frames doing it.
 */
const KeyWord = ({ children }: { children: string }) => {
  const [displayText, setDisplayText] = useState(children);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  // `children` changes in place when the locale switches — the list below is
  // keyed by index, not by content, so this instance survives the swap and
  // its `displayText` would otherwise stay frozen on the old language.
  useEffect(() => {
    stop();
    setDisplayText(children);
  }, [children, stop]);

  const scramble = useCallback(() => {
    let pos = 0;
    stop();
    intervalRef.current = setInterval(() => {
      setDisplayText(
        children
          .split("")
          .map((char, index) =>
            pos / CYCLES_PER_LETTER > index ? char : CHARS[Math.floor(Math.random() * CHARS.length)]
          )
          .join("")
      );
      pos++;
      if (pos >= children.length * CYCLES_PER_LETTER) {
        stop();
        setDisplayText(children);
      }
    }, SCRAMBLE_SPEED);
  }, [children, stop]);

  const reset = useCallback(() => {
    stop();
    setDisplayText(children);
  }, [children, stop]);

  return (
    <span
      onMouseEnter={scramble}
      onMouseLeave={reset}
      className="hyper-word hyper-key group relative z-[1] inline-block cursor-pointer whitespace-nowrap font-mono font-medium text-violet transition-[opacity,transform,color] duration-200 ease-out hover:z-20 hover:-translate-y-1 hover:scale-110 hover:text-ink dark:text-violet-soft"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-2 -z-10 scale-90 rounded-lg bg-surface opacity-0 shadow-glass transition-[opacity,transform] duration-200 ease-out group-hover:scale-100 group-hover:opacity-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-1 -end-1 h-2 w-2 scale-0 rounded-full bg-violet transition-transform duration-200 ease-out group-hover:scale-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-1 -start-1 h-2 w-2 scale-0 rounded-full bg-mint transition-transform duration-200 ease-out group-hover:scale-100"
      />
      <span className="relative px-1">{displayText}</span>
    </span>
  );
};

export default function HyperTextParagraph({
  text,
  className = "",
  highlightWords = [],
}: HyperTextProps) {
  const words = useMemo(() => text.split(" "), [text]);
  const keys = useMemo(() => new Set(highlightWords.map(clean)), [highlightWords]);

  return (
    <div className={cn("hyper-para leading-relaxed tracking-wide", className)}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          {keys.has(clean(word)) ? (
            <KeyWord>{word}</KeyWord>
          ) : (
            // A word nobody can hover needs no state, no handlers and no
            // decorations — just text that dims when a neighbour is hovered.
            // Most of the paragraph is this branch.
            <span className="hyper-word inline-block whitespace-nowrap font-mono font-medium text-mist transition-opacity duration-200 ease-out">
              {word}
            </span>
          )}
          <span className="inline-block whitespace-pre"> </span>
        </React.Fragment>
      ))}
    </div>
  );
}
