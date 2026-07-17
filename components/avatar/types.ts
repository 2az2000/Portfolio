import type { SVGProps } from "react";

/**
 * Base props every avatar part accepts. We deliberately extend the native
 * SVG <g> props instead of hand-rolling className/style/transform/children
 * again — React's own SVGProps<SVGGElement> already types all of those
 * correctly (transform included), so redeclaring them here would be a
 * duplicated interface for no benefit.
 *
 * Every part component is `forwardRef<SVGGElement, AvatarPartProps>`, so
 * `ref` is covered by forwardRef's own typing, not by this interface.
 */
export type AvatarPartProps = SVGProps<SVGGElement>;

/** Which side of the body a mirrored part belongs to. */
export type Side = "left" | "right";

/** Props for the reusable <Pupil /> atom, positioned explicitly per eye. */
export interface PupilProps extends AvatarPartProps {
  cx: number;
  cy: number;
  highlightCx: number;
  highlightCy: number;
}

/** Props for the reusable <Hands /> atom, mirrored via `side`. */
export interface HandProps extends AvatarPartProps {
  side: Side;
}

/** Top-level props for <Avatar />. */
export interface AvatarProps extends SVGProps<SVGSVGElement> {
  /** Optional title for accessibility (rendered as <title> inside the svg). */
  title?: string;
}
