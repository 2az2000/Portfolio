/**
 * A tiny subsequence matcher for the command palette
 * (components/ui/CommandPalette.tsx).
 *
 * Hand-written rather than pulled from npm for one reason: every off-the-shelf
 * fuzzy matcher assumes Latin text, and half this site is Persian. Persian
 * input is genuinely ambiguous at the codepoint level — the same word is
 * spelled with different characters depending on the keyboard, and words carry
 * an invisible joiner that no visitor is going to type. A matcher that ignores
 * that returns nothing for perfectly reasonable queries, which reads as a
 * broken feature rather than a spelling difference.
 */

/**
 * Persian and Arabic share a block, and the two keyboard layouts disagree on
 * which codepoint a key produces. A visitor on an Arabic layout types ARABIC
 * YEH where the dictionary holds FARSI YEH; the glyphs are identical on screen
 * and the codepoints are not.
 */
const CHAR_FOLDING: Record<string, string> = {
  // yeh: Arabic / Alef Maksura -> Farsi Yeh
  "ي": "ی",
  "ى": "ی",
  // kaf: Arabic Kaf -> Keheh
  "ك": "ک",
  // alef with hamza/madda -> bare alef
  "أ": "ا",
  "إ": "ا",
  "آ": "ا",
  // teh marbuta -> heh
  "ة": "ه",
  // heh with hamza -> heh
  "ۀ": "ه",
};

/** Harakat and friends: typed almost never, present in text occasionally. */
const DIACRITICS = /[ً-ْٰـ]/g;

/** Zero-width non-joiner. Sits inside words like "پروژه‌ها"; nobody types it. */
const ZWNJ = /[‌‍‎‏]/g;

/** Arabic-Indic and extended Arabic-Indic digits -> ASCII. */
function foldDigits(char: string): string | null {
  const code = char.codePointAt(0)!;
  if (code >= 0x0660 && code <= 0x0669) return String(code - 0x0660);
  if (code >= 0x06f0 && code <= 0x06f9) return String(code - 0x06f0);
  return null;
}

/** Lowercased, de-accented, script-folded form used for all comparisons. */
export function normalize(input: string): string {
  let out = input
    .toLowerCase()
    // Splits accented Latin into base + combining mark so the marks can be
    // dropped — "café" should be reachable by typing "cafe".
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(DIACRITICS, "")
    .replace(ZWNJ, "");

  let folded = "";
  for (const char of out) {
    folded += CHAR_FOLDING[char] ?? foldDigits(char) ?? char;
  }
  return folded;
}

/** Query form: the same folding, minus whitespace. Lets "case st" match
 *  "case studies" and "پروژه ها" match "پروژه‌ها" without the matcher having
 *  to reason about where word breaks landed. */
export function normalizeQuery(input: string): string {
  return normalize(input).replace(/\s+/g, "");
}

const BOUNDARY = /[\s\-_/.·—–]/;

/**
 * Scores `target` against an already-normalized `query`. Returns -1 when the
 * query isn't a subsequence of the target at all.
 *
 * Higher is better. The bonuses encode what actually makes a result feel
 * right: characters typed in an unbroken run beat scattered hits, a match at
 * the start of a word beats one buried mid-word, and among equally good
 * matches the shorter label wins — "Skills" should outrank "Case Studies" for
 * the query "s".
 */
export function scoreAgainst(query: string, target: string): number {
  if (!query) return 0;

  const haystack = normalize(target);
  if (!haystack) return -1;

  let score = 0;
  let cursor = 0;
  let previousIndex = -2;

  for (const char of query) {
    const found = haystack.indexOf(char, cursor);
    if (found === -1) return -1;

    score += 1;
    if (found === previousIndex + 1) score += 4;
    if (found === 0) score += 6;
    else if (BOUNDARY.test(haystack[found - 1])) score += 3;
    // Skipping ahead costs, but only up to a point — otherwise a long label
    // is punished for being long rather than for matching badly.
    score -= Math.min(found - cursor, 4) * 0.3;

    previousIndex = found;
    cursor = found + 1;
  }

  return score + 8 / (haystack.length + 8);
}

/**
 * Best score across several fields of one item (label, subtitle, keywords),
 * so a project is findable by its name *or* its stack without the caller
 * having to concatenate everything into one string and lose the per-field
 * word-boundary bonuses.
 */
export function scoreFields(query: string, fields: (string | undefined)[]): number {
  let best = -1;
  for (const field of fields) {
    if (!field) continue;
    const score = scoreAgainst(query, field);
    if (score > best) best = score;
  }
  return best;
}
