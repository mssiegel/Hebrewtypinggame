import { type DifficultyId, type Language } from "./types.ts";

export const DEFAULT_LANGUAGE: Language = "he";
export const LANGUAGE_STORAGE_KEY = "word-chase-language";

export const LANGUAGE_LABELS: Record<Language, string> = {
  he: "עברית",
  en: "English",
};

export function getLanguageFromPathname(pathname: string): Language {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "he";
}

export function getLanguageDirection(language: Language) {
  return language === "he" ? "rtl" : "ltr";
}

export function getHomePath(language: Language) {
  return language === "en" ? "/en" : "/";
}

export function getGamePath(language: Language) {
  return language === "en" ? "/en/game" : "/game";
}

export function getEquivalentLanguagePath(pathname: string, language: Language) {
  const isGame = pathname === "/game" || pathname === "/en/game";
  return isGame ? getGamePath(language) : getHomePath(language);
}

export function persistLanguage(language: Language) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export function normalizeDifficultyId(difficulty: unknown): DifficultyId {
  if (difficulty === "medium" || difficulty === "בינוני") return "medium";
  if (difficulty === "hard" || difficulty === "מהיר") return "hard";
  return "easy";
}
