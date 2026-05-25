import { describe, it, expect } from "vitest";
import { WORD_BANK, makeGroups } from "./words.ts";

describe("WORD_BANK", () => {
  it("is non-empty", () => {
    expect(WORD_BANK.length).toBeGreaterThan(0);
  });

  it("contains only non-empty Hebrew strings", () => {
    for (const word of WORD_BANK) {
      expect(typeof word).toBe("string");
      expect(word.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicates", () => {
    const unique = new Set(WORD_BANK);
    expect(unique.size).toBe(WORD_BANK.length);
  });
});

describe("makeGroups", () => {
  it("easy: every group has exactly 1 word", () => {
    const groups = makeGroups("מתחיל");
    for (const g of groups) {
      expect(g).toHaveLength(1);
    }
  });

  it("medium: full groups have 2 or 3 words; last group may be a remainder", () => {
    for (let run = 0; run < 10; run++) {
      const groups = makeGroups("בינוני");
      const full = groups.slice(0, -1);
      for (const g of full) {
        expect(g.length).toBeGreaterThanOrEqual(2);
        expect(g.length).toBeLessThanOrEqual(3);
      }
      expect(groups.at(-1)!.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("hard: full groups have 4 or 5 words; last group may be a remainder", () => {
    for (let run = 0; run < 10; run++) {
      const groups = makeGroups("מהיר");
      const full = groups.slice(0, -1);
      for (const g of full) {
        expect(g.length).toBeGreaterThanOrEqual(4);
        expect(g.length).toBeLessThanOrEqual(5);
      }
      expect(groups.at(-1)!.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("covers every word in WORD_BANK exactly once", () => {
    const groups = makeGroups("מתחיל");
    const flat = groups.flat();
    expect(flat.sort()).toEqual([...WORD_BANK].sort());
  });

  it("returns a different order on each call (shuffle is live)", () => {
    // Extremely unlikely to produce identical orderings twice in a row
    const a = makeGroups("מתחיל").flat();
    const b = makeGroups("מתחיל").flat();
    expect(a).not.toEqual(b);
  });

  it("returns non-empty array for any difficulty", () => {
    expect(makeGroups("מתחיל").length).toBeGreaterThan(0);
    expect(makeGroups("בינוני").length).toBeGreaterThan(0);
    expect(makeGroups("מהיר").length).toBeGreaterThan(0);
  });
});
