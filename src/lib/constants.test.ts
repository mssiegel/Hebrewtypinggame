import { describe, it, expect } from "vitest";
import { GAME_DURATION } from "./constants.ts";

describe("GAME_DURATION", () => {
  it("is a positive integer", () => {
    expect(Number.isInteger(GAME_DURATION)).toBe(true);
    expect(GAME_DURATION).toBeGreaterThan(0);
  });

  it("is 60 seconds", () => {
    expect(GAME_DURATION).toBe(60);
  });
});
