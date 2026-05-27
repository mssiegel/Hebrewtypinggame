import { type Language } from "./types.ts";

const HEBREW_BY_CODE: Record<string, string> = {
  KeyQ: "/",
  KeyW: "'",
  KeyE: "ק",
  KeyR: "ר",
  KeyT: "א",
  KeyY: "ט",
  KeyU: "ו",
  KeyI: "ן",
  KeyO: "ם",
  KeyP: "פ",
  BracketLeft: "]",
  BracketRight: "[",
  KeyA: "ש",
  KeyS: "ד",
  KeyD: "ג",
  KeyF: "כ",
  KeyG: "ע",
  KeyH: "י",
  KeyJ: "ח",
  KeyK: "ל",
  KeyL: "ך",
  Semicolon: "ף",
  Quote: ",",
  KeyZ: "ז",
  KeyX: "ס",
  KeyC: "ב",
  KeyV: "ה",
  KeyB: "נ",
  KeyN: "מ",
  KeyM: "צ",
  Comma: "ת",
  Period: "ץ",
  Slash: ".",
};

const ENGLISH_BY_CODE: Record<string, string> = {
  KeyQ: "q",
  KeyW: "w",
  KeyE: "e",
  KeyR: "r",
  KeyT: "t",
  KeyY: "y",
  KeyU: "u",
  KeyI: "i",
  KeyO: "o",
  KeyP: "p",
  KeyA: "a",
  KeyS: "s",
  KeyD: "d",
  KeyF: "f",
  KeyG: "g",
  KeyH: "h",
  KeyJ: "j",
  KeyK: "k",
  KeyL: "l",
  KeyZ: "z",
  KeyX: "x",
  KeyC: "c",
  KeyV: "v",
  KeyB: "b",
  KeyN: "n",
  KeyM: "m",
};

const HEBREW_BY_ENGLISH_KEY = Object.fromEntries(
  Object.entries(ENGLISH_BY_CODE).map(([code, char]) => [char, HEBREW_BY_CODE[code]]),
) as Record<string, string>;

const ENGLISH_BY_HEBREW_KEY = Object.fromEntries(
  Object.entries(HEBREW_BY_CODE).map(([code, char]) => [char, ENGLISH_BY_CODE[code]]),
) as Record<string, string | undefined>;

export function getGameKey(key: string, code: string, language: Language) {
  if (language === "he") return HEBREW_BY_CODE[code] ?? HEBREW_BY_ENGLISH_KEY[key.toLowerCase()] ?? key;
  return ENGLISH_BY_CODE[code] ?? ENGLISH_BY_HEBREW_KEY[key] ?? key.toLowerCase();
}
