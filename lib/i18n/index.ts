import { en } from "./en";
import { fa } from "./fa";
import type { Dictionary } from "./en";

export type Locale = "en" | "fa";

export const dictionaries: Record<Locale, Dictionary> = { en, fa };
export type { Dictionary };
