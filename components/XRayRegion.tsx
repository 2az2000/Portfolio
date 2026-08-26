import type { ReactNode } from "react";
import { XRAY_REGIONS, type XRayRegionId } from "@/lib/xray";

/**
 * Marks a slice of the page as an inspectable region for X-ray mode
 * (components/XRayProvider.tsx).
 *
 * It only stamps a data attribute — the outline and the file chip are drawn
 * entirely by CSS reading `attr(data-xray)`, so this holds no state, consumes
 * no context, and stays a server component. Toggling the mode never re-renders
 * anything here.
 *
 * `relative` is applied unconditionally rather than under `.is-xray`, so that
 * turning the mode on cannot reflow the page: the chip is absolutely
 * positioned against this box, and adding a containing block only while the
 * mode is active would risk shifting descendants at the exact moment the
 * visitor is looking closely at the layout.
 */
export function XRayRegion({ id, children }: { id: XRayRegionId; children: ReactNode }) {
  return (
    <div className="relative" data-xray={XRAY_REGIONS[id].file}>
      {children}
    </div>
  );
}
