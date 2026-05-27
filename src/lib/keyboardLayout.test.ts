import { describe, expect, it } from "vitest";
import { getGameKey } from "./keyboardLayout.ts";

describe("getGameKey", () => {
  it("maps English-layout keys to Hebrew game letters", () => {
    expect(getGameKey("t", "KeyT", "he")).toBe("א");
    expect(getGameKey("a", "KeyA", "he")).toBe("ש");
    expect(getGameKey("k", "KeyK", "he")).toBe("ל");
  });

  it("maps Hebrew-layout keys to English game letters", () => {
    expect(getGameKey("א", "KeyT", "en")).toBe("t");
    expect(getGameKey("ש", "KeyA", "en")).toBe("a");
    expect(getGameKey("ל", "KeyK", "en")).toBe("k");
  });

  it("falls back to the typed key when the physical key is unavailable", () => {
    expect(getGameKey("j", "", "he")).toBe("ח");
    expect(getGameKey("ח", "", "en")).toBe("j");
  });

  it("keeps unmapped typed keys usable when the physical key is unavailable", () => {
    expect(getGameKey("€", "", "he")).toBe("€");
    expect(getGameKey("B", "", "en")).toBe("b");
  });
});
