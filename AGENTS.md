# AGENTS.md — Amirali Zand Portfolio

This file is the single reference document for this project. Any AI editor or developer working on this codebase **must read this file before writing any code** and follow it exactly. The goals of this document are threefold:

1. Explain the UI/design concept (why this portfolio should not look like a template)
2. Define a **single Design Token / Theme System** that the entire project draws from
3. Define the file structure and the rules that keep components modular

> **Golden rule of this project:** No color, font, size, radius, or animation value is ever hardcoded inside a component. Everything comes from `tailwind.config.ts` and `lib/theme.ts`. If a new value is needed, add it to the tokens first, then consume it.

---

## 1. Project Overview

- **Owner:** Amirali Zand — Frontend Developer
- **Skills:** React, Next.js, TypeScript, Node.js, and the broader front-end/back-end ecosystem around them
- **Goal of the page:** Instead of *telling* the visitor "I'm a good frontend developer," the site should *show* it. The experience of using the site — the micro-interactions, performance, animation quality, attention to detail — is itself the proof of skill.
- **Language:** Fully bilingual Persian/English with a live switch (text content **and** RTL/LTR direction) with no page reload.
- **Mood:** Dark, glassy (glassmorphism), modern, precise — closer to a "developer tool / product lab" feel than a plain resume page.

---

## 2. Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Industry standard, good SSR/SEO |
| Styling | Tailwind CSS | Token consistency, fast iteration |
| Scroll / heavy animation | **GSAP** + ScrollTrigger | Precise timelines, scroll-driven sequences, high performance |
| UI / state animation | **Framer Motion** | Component transitions, enter/exit, hover/tap states |
| Icons | lucide-react | Minimal, consistent icon set |
| Fonts | next/font (Vazirmatn for Persian) + Fontshare CDN (display) | Persian readability + typographic personality |
| Component inspiration | [21st.dev](https://21st.dev) | Visual reference for modern component patterns (spotlight card, magnetic button, bento grid) — **we don't copy, we reinterpret with our own theme** |

Animation division of labor:
- **GSAP** → anything scroll- or timeline-driven (section reveals, hero "assembly" effect, parallax)
- **Framer Motion** → anything state-driven (hover, tap, language toggle, modals, accordions, tab indicators)

Never let two animation libraries control the same element's transform at the same time.

---

## 3. Signature UI Concepts (all features, one theme)

This is the most important section. Every idea below has a stated "why" that must survive implementation — none of these are decoration, each is a deliberate structural choice.

### 3.1 Hero → "Proof, not Promise"
Instead of a classic hero (big headline + photo + button), the hero contains several **real, clickable mini components** floating in an irregular bento layout (a toggle switch, a badge, a small slider, a progress ring) that the visitor can actually play with. Skill is *experienced*, not described.
- Entrance animation with GSAP: pieces fly in from off-canvas, rotated and scaled down, and snap into their bento position (the "Assembly" effect).
- Hero typography: a bilingual display headline, with a mono-font line underneath styled like a code comment: `// building interfaces that actually respond`.

### 3.2 Playground Section → "Component Shelf"
A dedicated section (inspired by 21st.dev) that behaves like a **live component shelf**, not a screenshot gallery. At least four components are fully functional:
1. **Spotlight Card** — light follows the cursor position over the card (CSS mask/gradient driven by mousemove)
2. **Magnetic Button** — button subtly pulls toward the cursor as it approaches
3. **Animated Tabs** — tabs with a sliding indicator using Framer Motion's `layoutId`
4. **Command Palette Preview** — a ⌘K-style input with a live-filtered mock result list

Each card has a small mono-font label above it styled like a filename (`spotlight-card.tsx`, `magnetic-button.tsx`) — this is a meaningful structural device: this section literally *is* live code, not decoration.

### 3.3 Skills → "Constellation" instead of Progress Bars
Linear progress bars are a tired cliché and communicate nothing meaningful (`React: 90%` means nothing). Instead:
- Technologies are shown as floating dots/badges with a gentle `float` animation, arranged in loose clusters, connected by thin SVG lines showing real relationships (e.g. React ↔ Next.js ↔ TypeScript in one cluster, Node.js ↔ databases in another).
- Hovering a node highlights its connected lines and dims the rest.
- This is meaningful because it actually shows how the technologies relate to each other, rather than an arbitrary percentage.

### 3.4 Projects → Asymmetric Bento Grid
Cards are not uniform; the flagship project gets a larger cell (2×2), others get 1×1. On hover: image zooms slightly and a glass layer slides up from the bottom revealing the tech stack (Framer Motion `initial`/`animate` on `y`).

### 3.5 Experience / Timeline → "Commit Log"
Instead of a generic vertical timeline, work history is displayed like a **git log**: each entry has a short hash (`a3f9c2d`), a commit-style message (the role/achievement), and a date. This is a meaningful structural device — a developer's career genuinely reads like a log of commits, not an arbitrary decoration.

### 3.6 Contact → "Terminal Input"
The contact form looks like a minimal terminal session: a prompt (`amirali@portfolio:~$`) with fields entered like command flags (`--name`, `--email`, `--message`). The submit button reads `run send.sh` (or similar). A subtle, on-brand joke for a front-end/back-end audience.

### 3.7 Language Switcher → a feature that demonstrates skill by itself
The FA/EN toggle doesn't just swap text — it flips the **entire page direction** (`dir`) with a smooth cross-fade instead of an abrupt jump. Very few portfolios implement this correctly, so it's deliberately showcased rather than hidden.

### 3.8 Custom Cursor + Magnetic States
A subtle custom cursor (desktop only, `pointer: fine` media query) that grows and softens near large interactive elements. Never active on touch devices.

> **Important constraint:** per the "spend your boldness in one place" principle, these ideas don't compete with each other. Color and motion language stay calm and consistent across every section; only the *structure* of each section is distinct and meaningful.

---

## 4. Theme / Design Tokens (single source of truth)

Use these tokens everywhere (defined in `tailwind.config.ts`, mirrored in `lib/theme.ts` for use in JS/GSAP):

### Colors
```
void        #0A0A0F   main background
surface     #12121A   card/panel background (before glass effect)
ink         #F5F5F7   primary text
mist        #9A9AB0   secondary/muted text
violet      #7C5CFC   primary brand color (CTAs, links, focus rings)
violet-soft #A493FF   lighter violet for gradients/hover
mint        #33E6B8   secondary accent (data emphasis, secondary CTA)
mint-soft   #8FF5D9
amber       #FFB86B   special-emphasis color — used very sparingly (e.g. primary CTA hover only)
line        rgba(255,255,255,0.08)  general glass border color
```
Rule: no other colors are introduced anywhere in the project. All shading is achieved via opacity of these same colors.

### Typography
```
--font-display : Latin display face (Clash Display, Fontshare) — large Latin headings only
--font-body    : Latin body face (General Sans, Fontshare)
--font-mono    : JetBrains Mono — labels, code, commit log, UI tags ("spotlight-card.tsx")
--font-fa      : Vazirmatn (variable, via next/font/google) — all Persian text, both headings and body (Latin display faces don't render Persian correctly)
```
Type scale (custom Tailwind scale, used via utility classes, never manual `px`):
```
text-hero    : clamp(2.75rem, 6vw, 5.5rem) — hero only
text-h1      : clamp(2rem, 4vw, 3.25rem)
text-h2      : clamp(1.5rem, 2.5vw, 2.25rem)
text-body    : 1rem / line-height 1.7
text-caption : 0.8125rem / font-mono / tracking-wide / uppercase (labels, eyebrows)
```

### Spacing & Shape
```
radius-card : 20px      (rounded-[20px] or a custom rounded-3xl)
radius-pill : 999px     (badges, small buttons)
section-py  : py-24 md:py-32   (identical vertical rhythm across all sections)
container   : max-w-6xl mx-auto px-6
glass       : bg-white/[0.04] backdrop-blur-xl border border-line
```

### Motion Tokens
```
ease-brand    : cubic-bezier(0.16, 1, 0.3, 1)   — used by every smooth transition (both Framer and GSAP)
duration-fast : 0.2s   (hover, focus)
duration-base : 0.5s   (element entrances)
duration-slow : 1.2s   (GSAP sequences, hero assembly effect)
stagger-base  : 0.08s  (delay between items in a group entrance)
```
All of these live as exported constants in `lib/theme.ts` so GSAP timelines use the exact same easing/duration as Framer Motion — never a mismatched ease that feels inconsistent.

---

## 5. File Structure

```
/app
  layout.tsx          → fonts, LanguageProvider, <html dir="">
  page.tsx            → section layout only (imports components, no logic)
  globals.css         → @tailwind directives + a few global utility classes (glass, aurora-text, ...)

/components
  /ui                 → reusable atoms (no business logic)
    Button.tsx
    Badge.tsx
    GlassCard.tsx
    SpotlightCard.tsx
    MagneticButton.tsx
    AnimatedTabs.tsx
    CommandPalette.tsx
  /sections            → full page sections (each wraps a <section id="...">)
    Hero.tsx
    About.tsx
    Skills.tsx
    Projects.tsx
    Playground.tsx
    Experience.tsx
    Contact.tsx
  Navbar.tsx
  Footer.tsx
  CustomCursor.tsx
  LanguageProvider.tsx  → Context for fa/en + dir + dictionary access

/lib
  theme.ts             → exports motion/easing constants for GSAP (mirrors Tailwind tokens)
  i18n/
    fa.ts              → Persian dictionary
    en.ts              → English dictionary
    index.ts

/public
  /projects            → project images (placeholders for now)
  /icons               → technology icons (svg)
```

### Modularity Rules
1. Every component in `/ui` has **zero hardcoded text and zero project-specific data**; it only accepts props. It should be reusable in a completely different project.
2. Every component in `/sections` reads its text from the `lib/i18n` dictionary — never a hardcoded Persian/English string in JSX.
3. No component writes a raw hex color or raw pixel value directly; only the Tailwind classes defined by the tokens above.
4. GSAP animations live behind one shared hook, `useGsapReveal()` (in `lib/`), so section-entrance behavior stays identical everywhere — copy-pasting a GSAP timeline into multiple files is not allowed.
5. Every `<section>` has exactly one meaningful `id` for scroll/navigation (`#hero`, `#playground`, `#projects`, ...).

---

## 6. Responsiveness & Accessibility (non-negotiable quality floor)

- Mobile-first; the bento grid collapses into a clean vertical stack on mobile without losing its appeal.
- Every interactive element has a visible `focus-visible` ring (violet).
- `prefers-reduced-motion` is respected: the assembly effect and parallax are disabled and replaced with a simple fade in that mode.
- The custom cursor and magnetic effects are only active on `pointer: fine` devices — never on touch.
- Text contrast on the dark background meets at least AA (the `mist` color is only used for secondary text, never primary body copy).

---

## 7. Content & Placeholders

- Project content and contact links (GitHub, LinkedIn, email, etc.) will be filled in by the site owner. All of these are marked with a `// TODO: replace` comment inside `lib/i18n/*.ts`.
- Project images are currently gradient SVG placeholders built from the theme's own color tokens, so the page's color harmony isn't broken until real images are added.

---

## 9. shadcn/ui Integration

This project uses **shadcn/ui** for structural/interactive primitives (Button, Dialog, Separator, Avatar, Tabs base, etc.) so we're not hand-building accessible low-level behavior from scratch. Our custom signature pieces (SpotlightCard, MagneticButton, AnimatedTabs, CommandPalette, the Skills constellation, the commit-log timeline) are **not** shadcn components — they are bespoke and already implemented; do not try to regenerate them via the CLI.

### 9.1 How the theme is wired
`components.json` and `app/globals.css` are already configured — do not re-run `shadcn init`, it will overwrite the CSS variables. Every shadcn component consumes color via the semantic CSS variables already defined in `globals.css` (`--background`, `--foreground`, `--primary`, `--card`, `--border`, `--ring`, etc.), which are themselves the exact HSL conversion of the brand palette in §4. That means:

- Any `npx shadcn add <component>` you run will **automatically match the theme** with zero manual recoloring.
- `--radius` is set to `1.25rem` to match `radius-card` from §4, so shadcn's rounded corners stay consistent with the rest of the site.
- `--accent` is deliberately mapped to a **neutral** dark surface, not violet or mint. This is intentional (see the comment in `globals.css`): shadcn uses `accent` for hover backgrounds inside menus, dropdowns, and command lists. If we wired brand violet/mint into `accent`, every dropdown hover would flash brand color and dilute the "spend your boldness in one place" principle from the design brief. Brand colors are applied deliberately in specific components instead (buttons, links, the constellation, focus rings via `--ring`).

### 9.2 Which components to pull from shadcn
Use the CLI only for genuinely generic primitives. Suggested set for this project:
```
npx shadcn@latest add button badge separator avatar dialog tabs label textarea
```
- **button / badge** → use for anything that is *not* the hero CTA or a playground demo (those use our own `MagneticButton` / `BadgeProof` on purpose, since they're signature moments).
- **dialog** → use for things like a project "details" modal, if one is added.
- **tabs** → the shadcn base is fine for plain content tabs elsewhere in the site (e.g. a code-snippet viewer). The **AnimatedTabs** component we already built is specifically for the Playground section's sliding-indicator demo — don't replace it with the shadcn version, they serve different purposes.
- **label / textarea / input** → good fit for the real `<Contact />` form fields, styled with the terminal-prompt treatment described in §3.6.

### 9.3 Where generated files land
The CLI will write into `components/ui/`, the same folder our bespoke pieces (`SpotlightCard.tsx`, `MagneticButton.tsx`, etc.) already live in. This is intentional and matches shadcn's own convention — just don't let a generated file name collide with an existing bespoke one. If shadcn ever proposes overwriting `SpotlightCard.tsx`, `MagneticButton.tsx`, `AnimatedTabs.tsx`, or `CommandPalette.tsx`, decline — those are already hand-built for this brief.

### 9.4 Rule recap
- Never let a shadcn component introduce a color outside the token table in §4.
- Never duplicate a signature component (§3) with a generic shadcn equivalent.
- Do re-use shadcn for everything else — that's exactly what it's for.

---

## 10. Pre-Commit Checklist

- [ ] No new hardcoded color/font/size was introduced (everything comes from tokens)
- [ ] Persian/English text is read from the dictionary, not hardcoded
- [ ] Any new `/ui` component has zero dependency on business/project data
- [ ] Any new GSAP animation uses easing/duration from `lib/theme.ts`
- [ ] Visually tested with `prefers-reduced-motion` enabled and on a mobile viewport
- [ ] No shadcn component introduces a color outside the §4 token table
