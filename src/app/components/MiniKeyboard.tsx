import { motion } from "motion/react";
import { translations } from "../../lib/translations.ts";
import { type Language } from "../../lib/types.ts";

const HOME_KEYS: Record<Language, Set<string>> = {
  he: new Set(["ש", "ד", "ג", "כ", "ח", "ל", "ך", "ף"]),
  en: new Set(["a", "s", "d", "f", "j", "k", "l"]),
};

interface MiniKeyboardProps {
  nextChar: string;
  wrongChar: string | null;
  difficulty: string;
  language: Language;
}

export function MiniKeyboard({ nextChar, wrongChar, difficulty, language }: MiniKeyboardProps) {
  if (difficulty === "hard" || difficulty === "מהיר") return null;

  const pulse = difficulty === "easy" || difficulty === "מתחיל";
  const rows = translations[language].keyboardRows;
  const homeKeys = HOME_KEYS[language];

  return (
    <div className="flex flex-col items-center gap-[3px] rounded-2xl border border-violet-100/80 bg-white/70 px-3 py-2 shadow-lg shadow-violet-100/40 backdrop-blur-sm">
      {rows.map((row, ri) => (
        <div key={ri} className="flex gap-[3px]">
          {row.map((char) => (
            <Key
              key={char}
              char={char}
              isNext={char === nextChar}
              isWrong={char === wrongChar}
              isHomeKey={homeKeys.has(char)}
              pulse={pulse}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Individual key ───────────────────────────────────────────
function Key({
  char,
  isNext,
  isWrong,
  isHomeKey,
  pulse,
}: {
  char: string;
  isNext: boolean;
  isWrong: boolean;
  isHomeKey: boolean;
  pulse: boolean;
}) {
  const base =
    "w-[27px] h-[31px] rounded-md flex items-center justify-center text-[11px] font-bold select-none";

  // Wrong key — red flash
  if (isWrong) {
    return (
      <motion.div
        className={`${base} border border-rose-400 bg-rose-100 text-rose-600`}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{ boxShadow: "0 0 12px rgba(251,113,133,0.75)" }}
      >
        {char}
      </motion.div>
    );
  }

  // Next key — green, pulsing (easy) or solid (medium)
  if (isNext) {
    const nextClass = `${base} bg-emerald-100 border border-emerald-400 text-emerald-700`;

    if (pulse) {
      return (
        <motion.div
          className={nextClass}
          animate={{
            scale: [1, 1.12, 1],
            boxShadow: [
              "0 0 6px rgba(52,211,153,0.4)",
              "0 0 18px rgba(52,211,153,0.9)",
              "0 0 6px rgba(52,211,153,0.4)",
            ],
          }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        >
          {char}
        </motion.div>
      );
    }

    return (
      <div className={nextClass} style={{ boxShadow: "0 0 12px rgba(52,211,153,0.65)" }}>
        {char}
      </div>
    );
  }

  // Default key — muted violet
  const defaultClass = isHomeKey
    ? `${base} border border-amber-300 bg-amber-100 text-amber-900`
    : `${base} border border-violet-200 bg-violet-50 text-violet-500`;

  return (
    <div
      className={defaultClass}
      style={{ boxShadow: "0 2px 0 rgba(99,102,241,0.18)" }}
    >
      {char}
    </div>
  );
}
