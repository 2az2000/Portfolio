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
};

module.exports = nextConfig;
