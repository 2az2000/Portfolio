import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // ---- shadcn/ui semantic tokens (consumed via CSS vars, HSL) ----
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // ---- brand tokens (consumed via CSS vars, theme-aware) ----
        void: "rgb(var(--void) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        mist: "rgb(var(--mist) / <alpha-value>)",
        violet: {
          DEFAULT: "rgb(var(--violet) / <alpha-value>)",
          soft: "rgb(var(--violet-soft) / <alpha-value>)",
        },
        mint: {
          DEFAULT: "rgb(var(--mint) / <alpha-value>)",
          soft: "rgb(var(--mint-soft) / <alpha-value>)",
        },
        amber: "rgb(var(--amber) / <alpha-value>)",
        line: "var(--line)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        pill: "999px",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        fa: ["var(--font-fa)", "sans-serif"],
      },
      fontSize: {
        hero: ["clamp(2.75rem, 6vw, 5.5rem)", { lineHeight: "1.05" }],
        h1: ["clamp(2rem, 4vw, 3.25rem)", { lineHeight: "1.1" }],
        h2: ["clamp(1.5rem, 2.5vw, 2.25rem)", { lineHeight: "1.2" }],
        body: ["1rem", { lineHeight: "1.7" }],
        caption: [
          "0.8125rem",
          { lineHeight: "1.4", letterSpacing: "0.06em" },
        ],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 20%, rgba(124,92,252,0.18), transparent 40%), radial-gradient(circle at 80% 0%, rgba(51,230,184,0.14), transparent 45%)",
        aurora: "linear-gradient(120deg, #7C5CFC 0%, #33E6B8 50%, #FFB86B 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.45)",
        glow: "0 0 40px rgba(124,92,252,0.35)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        fast: "200ms",
        base: "500ms",
        slow: "1200ms",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          // `--marquee-distance` is set in px by TechMarquee once it
          // measures the real rendered width of one item set — a plain
          // `-50%` looked equivalent but is resolved against the
          // container's own (sometimes fractional) computed width, and
          // that sub-pixel rounding is what caused the visible jump/snap
          // at the loop point. The 50% fallback only covers the instant
          // before that first measurement runs.
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-1 * var(--marquee-distance, 50%)))" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 22s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
