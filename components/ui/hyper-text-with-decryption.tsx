"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Configuration ---
const SCRAMBLE_SPEED = 10;
const CYCLES_PER_LETTER = 3;
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";

interface HyperTextProps {
  text: string;
  className?: string;
  highlightWords?: string[];
}

interface WordProps {
  children: string;
  isDimmed: boolean;
  isHighlightable: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

const Word = ({
  children,
  isDimmed,
  isHighlightable,
  onHoverStart,
  onHoverEnd,
}: WordProps) => {
  const [displayText, setDisplayText] = useState(children);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const scramble = useCallback(() => {
    let pos = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const scrambled = children
        .split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) return char;
          const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          return randomChar;
        })
        .join("");

      setDisplayText(scrambled);
      pos++;

      if (pos >= children.length * CYCLES_PER_LETTER) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(children);
      }
    }, SCRAMBLE_SPEED);
  }, [children]);

  const stopScramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(children);
  }, [children]);

  const handleMouseEnter = () => {
    if (isHighlightable) {
      setIsHovered(true);
      onHoverStart();
      scramble();
    }
  };

  const handleMouseLeave = () => {
    if (isHighlightable) {
      setIsHovered(false);
      onHoverEnd();
      stopScramble();
    }
  };

  return (
    <motion.span
      className={cn(
        "relative inline-block font-mono font-medium whitespace-nowrap",
        isHighlightable ? "cursor-pointer" : "cursor-default"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        scale: isHovered ? 1.1 : 1,
        y: isHovered ? -4 : 0,
        opacity: isDimmed && !isHovered ? 0.3 : 1,
        filter: isDimmed && !isHovered ? "blur(2px)" : "blur(0px)",
        color: isHovered ? "#FFFFFF" : isHighlightable ? "#8B5CF6" : "#64748B",
        zIndex: isHovered ? 20 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className="absolute -inset-2 rounded-lg bg-surface z-[-1]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            layoutId="hover-bg"
            style={{
              boxShadow:
                "0px 10px 25px -5px rgba(139, 92, 246, 0.4), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)",
            }}
          />
        )}
      </AnimatePresence>

      <span className="relative z-10 px-1">{displayText}</span>

      <AnimatePresence>
        {isHovered && (
          <>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-violet-500 rounded-full z-20"
            />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-400 rounded-full z-20"
            />
          </>
        )}
      </AnimatePresence>
    </motion.span>
  );
};

export default function HyperTextParagraph({
  text,
  className = "",
  highlightWords = [],
}: HyperTextProps) {
  const [isParagraphHovered, setIsParagraphHovered] = useState(false);

  const words = text.split(" ");

  // Improved clean function that handles both Latin and Persian/Arabic scripts
  const clean = (w: string) => {
    return w
      .toLowerCase()
      // Remove punctuation and special characters
      .replace(/[،،؛؛"'"()\[\]{}<>:;,.!?\-_=+*/\\|@#$%^&*~`]/g, "")
      // Remove extra spaces
      .trim();
  };

  // Log for debugging - remove in production
  console.log("Highlight Words:", highlightWords);
  console.log("Text Words:", words.map(w => clean(w)));

  return (
    <div className={cn("leading-relaxed tracking-wide", className)}>
      {words.map((word, i) => {
        const cleanedWord = clean(word);
        const isHighlightable = highlightWords.some(
          (hw) => clean(hw) === cleanedWord
        );

        // Log for debugging
        if (isHighlightable) {
          console.log(`✅ Highlighted: "${word}" -> "${cleanedWord}"`);
        }

        return (
          <React.Fragment key={i}>
            <Word
              isDimmed={isParagraphHovered}
              isHighlightable={isHighlightable}
              onHoverStart={() => setIsParagraphHovered(true)}
              onHoverEnd={() => setIsParagraphHovered(false)}
            >
              {word}
            </Word>
            <span className="inline-block whitespace-pre"> </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}