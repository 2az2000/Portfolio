import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// `eslint-config-next` v16 ships native flat configs, so these are imported
// and spread directly — no FlatCompat bridge (running these through
// @eslint/eslintrc crashes on the plugin object's circular references).
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      // Vendored agent skill packs — not our source, and mostly Python.
      ".agents/**",
      "public/**",
      "assets/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // The animation layer legitimately holds values that outlive a render
      // (GSAP timelines, the Lenis instance, observers) in refs and reads
      // them from cleanups. Warn so they stay visible without failing CI on
      // a pattern that is correct here.
      "react-hooks/exhaustive-deps": "warn",

      // The next two are React Compiler-era heuristics. Both are worth
      // reading, neither is reliable enough here to gate a build on:
      //
      // `set-state-in-effect` fires on every `useEffect(() => setX(browserOnly))`
      // — matchMedia, navigator.platform, localStorage. That is the standard
      // hydration-safe way to read a value the server cannot know, it runs
      // once on mount, and it cascades nothing. The rule cannot distinguish it
      // from a genuine render loop.
      //
      // `refs` misfires on `useFitScale` in DocumentPreview.tsx, which returns
      // `{ ref, scale }` where `scale` is state and `ref` is a callback ref.
      // The rule sees the `ref` key, assumes the whole object is a ref
      // container, and reports eight reads of a perfectly ordinary state
      // value as render-time ref access.
      //
      // A couple of the remaining hits are real derived-state-in-effect smells
      // (hyper-text-with-decryption.tsx, the activeIndex clamp in
      // CommandPalette.tsx) and are worth converting to render-time
      // computation — as their own change, not as part of a config pass.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
    },
  },
  {
    // Build-time config files, not application code. `next.config.js` is
    // CommonJS by definition, and `require()` inside the Tailwind plugins
    // array is the documented way to register a plugin — neither ships to a
    // browser, so the ESM-only rule does not apply to them.
    files: ["next.config.js", "tailwind.config.ts", "postcss.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default config;
