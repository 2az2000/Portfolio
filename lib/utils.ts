import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely (handles conflicting utility classes).
 * Every shadcn component depends on this — do not remove or rename.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
