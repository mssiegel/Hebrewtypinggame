import { motion } from "motion/react";

const ROWS = [
  ["פ", "ם", "ן", "ו", "ט", "א", "ר", "ק", "'", "/"],
  ["ף", "ך", "ל", "ח", "י", "ע", "כ", "ג", "ד", "ש"],
  [".", ",", "ץ", "ת", "צ", "מ", "נ", "ה", "ב", "ס", "ז"],
];

interface MiniKeyboardProps {
  nextChar: string;
  wrongChar: string | null;
  difficulty: string;
}

export function MiniKeyboard({ nextChar, wrongChar, difficulty }: MiniKeyboardProps) {
  if (difficulty === "מהיר") return null;

  const pulse = difficulty === "מתחיל";

  return (
    <div className="flex flex-col items-center gap-[3px] rounded-2xl border border-violet-100/80 bg-white/70 px-3 py-2 shadow-lg shadow-violet-100/40 backdrop-blur-sm">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-[3px]">
          {row.map((char) => (
            <Key
              key={char}
              char={char}
              isNext={char === nextChar}
              isWrong={char === wrongChar}
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
  pulse,
}: {
  char: string;
  isNext: boolean;
  isWrong: boolean;
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
  return (
    <div
      className={`${base} border border-violet-200 bg-violet-50 text-violet-500`}
      style={{ boxShadow: "0 2px 0 rgba(99,102,241,0.18)" }}
    >
      {char}
    </div>
  );
}
