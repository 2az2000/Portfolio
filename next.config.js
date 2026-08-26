const { PHASE_PRODUCTION_BUILD } = require("next/constants");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // turbopack: false, // غیرفعال کردن Turbopack

  // Lets Next.js rewrite deep-package imports from these libraries into
  // per-icon/per-module paths automatically, so the client bundle only
  // ships the specific icons/helpers actually used instead of pulling in
  // each package's full module graph.
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons", "framer-motion"],
  },

  // Build facts for the footer colophon (components/Footer.tsx). They have to
  // be inlined here because the footer renders on the client, where neither
  // the filesystem nor Next's own package.json is reachable — and the point of
  // that section is that these are the real numbers for the bundle you are
  // looking at, not a version string somebody typed once.
  //
  // The version is a constant. The timestamp is not, and that matters: `env`
  // values are inlined into the client bundle, so a value that changes on
  // every evaluation of this file makes the compiled output change with it.
  // In dev that leaves the running page holding a bundle the server no longer
  // agrees with, and Next's dev client resolves the mismatch by hard-reloading
  // the page — which looks exactly like the site reloading itself at random.
  // So the clock is only read during an actual production build; dev gets a
  // stable empty value and the footer falls back to "—".
  env: {
    NEXT_PUBLIC_NEXT_VERSION: require("next/package.json").version,
  },
};

module.exports = (phase) => ({
  ...nextConfig,
  env: {
    ...nextConfig.env,
    NEXT_PUBLIC_BUILD_TIME: phase === PHASE_PRODUCTION_BUILD ? new Date().toISOString() : "",
  },
});
