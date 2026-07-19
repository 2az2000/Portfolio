/**
 * Slow-drifting brand-colour glow behind the entire page — dark mode only
 * (light mode's background is bright enough that these would just look
 * like smudges). Same violet/mint/amber palette as everywhere else on the
 * site (SkillsGraph's ambient orbs, the hero aurora), just stretched
 * across the whole viewport instead of one section.
 *
 * Pure CSS `translate` keyframes (see globals.css), not Framer Motion —
 * this sits behind every section for the entire session rather than one
 * that can be paused off-screen, so it has to be compositor-only and
 * essentially free to run forever. No client JS needed, so this stays a
 * server component.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden dark:block"
    >
      <div
        className="absolute -left-[10%] -top-[15%] h-[55vmax] w-[55vmax] rounded-full opacity-40 blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(124,92,252,0.55), transparent 70%)",
          animation: "ambientDrift1 32s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-[10%] top-[10%] h-[50vmax] w-[50vmax] rounded-full opacity-30 blur-[130px]"
        style={{
          background: "radial-gradient(circle, rgba(51,230,184,0.5), transparent 70%)",
          animation: "ambientDrift2 38s ease-in-out infinite",
          animationDelay: "-9s",
        }}
      />
      <div
        className="absolute -bottom-[15%] left-[25%] h-[40vmax] w-[40vmax] rounded-full opacity-20 blur-[110px]"
        style={{
          background: "radial-gradient(circle, rgba(255,184,107,0.45), transparent 70%)",
          animation: "ambientDrift3 44s ease-in-out infinite",
          animationDelay: "-17s",
        }}
      />
    </div>
  );
}
