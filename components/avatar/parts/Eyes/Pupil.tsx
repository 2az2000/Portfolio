import { forwardRef, memo } from "react";
import type { PupilProps } from "../../types";

/**
 * Reusable pupil/iris. Positioned via props instead of being hardcoded
 * twice, so LeftEye and RightEye both render this same component with
 * different coordinates — satisfies "no duplicated SVG paths".
 */
export const Pupil = memo(
  forwardRef<SVGGElement, PupilProps>(function Pupil(
    { cx, cy, highlightCx, highlightCy, children, ...rest },
    ref
  ) {
    return (
      <g id="LeftPupil" ref={ref} {...rest}>
        <circle className="eye-dark" cx={cx} cy={cy} r={8} />
        <circle className="eye-highlight" cx={highlightCx} cy={highlightCy} r={2} />
        {children}
      </g>
    );
  })
);
