import type { MetadataRoute } from "next";
import { COLORS } from "@/lib/theme";
import { META, SITE_NAME } from "@/lib/site";

/**
 * Colours come from `lib/theme.ts` rather than being retyped as hex here —
 * the browser paints `theme_color` into the address bar and the splash screen,
 * so a stale value shows up as a seam between the chrome and the page.
 *
 * English is the default entry point, hence `start_url: "/"`; the manifest
 * describes the installed app, and there is one app with two languages inside
 * it rather than two apps.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: META.en.title,
    short_name: SITE_NAME,
    description: META.en.description,
    start_url: "/",
    display: "standalone",
    background_color: COLORS.void,
    theme_color: COLORS.void,
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
