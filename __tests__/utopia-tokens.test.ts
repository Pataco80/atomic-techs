import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Guards the Utopia fluid type scale in app/globals.css. These tokens are part
 * of the design foundation (spec 01) and are referenced as `text-(length:--step-N)`
 * across the marketing site, so silently dropping or renaming one would break
 * typography app-wide without a TypeScript error to catch it.
 */
describe("Utopia fluid type scale (globals.css)", () => {
  const css = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf-8");

  const STEPS = [
    "--step--2",
    "--step--1",
    "--step-0",
    "--step-1",
    "--step-2",
    "--step-3",
    "--step-4",
    "--step-5",
  ] as const;

  it("defines all 8 step tokens", () => {
    for (const step of STEPS) {
      expect(css).toContain(`${step}:`);
    }
  });

  it("declares every step as a fluid clamp() value", () => {
    for (const step of STEPS) {
      const match = css.match(
        new RegExp(`${step.replace(/-/g, "\\-")}:\\s*(clamp\\([^;]+\\))`),
      );
      expect(match, `${step} should use clamp()`).not.toBeNull();
      expect(match?.[1]).toContain("vw");
    }
  });
});
