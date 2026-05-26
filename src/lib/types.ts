export type Phase = "countdown" | "playing" | "finished";
export type Language = "he" | "en";
export type DifficultyId = "easy" | "medium" | "hard";

export interface FloatingChar {
  id: number;
  char: string;
  x: number;
}
