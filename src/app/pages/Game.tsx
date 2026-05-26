import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import { Zap, Home, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import { RunningCharacter } from "../components/RunningCharacter.tsx";
import { MiniKeyboard } from "../components/MiniKeyboard.tsx";
import { LanguageToggle } from "../components/LanguageToggle.tsx";
import { useGameState } from "../../lib/useGameState.ts";
import { GAME_DURATION } from "../../lib/constants.ts";
import {
  getEquivalentLanguagePath,
  getHomePath,
  getLanguageDirection,
  getLanguageFromPathname,
  normalizeDifficultyId,
  persistLanguage,
} from "../../lib/language.ts";
import { translations } from "../../lib/translations.ts";
import { type DifficultyId, type Language } from "../../lib/types.ts";

// ─── Word pill ────────────────────────────────────────────────
function WordPill({
  group,
  groupWordIdx,
  typed,
}: {
  group: string[];
  groupWordIdx: number;
  typed: string;
}) {
  // Shrink font for longer groups
  const fontSize =
    group.length >= 4
      ? "text-2xl"
      : group.length >= 2
        ? "text-3xl"
        : "text-4xl";

  return (
    <div>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      >
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 rounded-3xl bg-violet-400/35 blur-xl" />

          {/* Card */}
          <div className="relative flex max-w-md flex-wrap items-center gap-3 rounded-3xl border-2 border-violet-200 bg-white px-6 py-4 shadow-2xl">
            {group.map((word, wi) => (
              <span key={wi} className="flex items-center gap-3">
                {/* Word */}
                <span className={`font-bold tracking-wider ${fontSize}`}>
                  {wi < groupWordIdx ? (
                    // Completed word — dimmed violet with check
                    <span className="text-violet-300 line-through decoration-violet-300/60">
                      {word}
                    </span>
                  ) : wi === groupWordIdx ? (
                    // Current word — character-by-character highlighting
                    <>
                      {word.split("").map((char, ci) => {
                        const tc = typed[ci];
                        const cls =
                          tc === undefined
                            ? "text-gray-800"
                            : tc === char
                              ? "text-violet-600"
                              : "text-red-500";
                        return (
                          <span
                            key={ci}
                            className={`transition-colors duration-100 ${cls}`}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </>
                  ) : (
                    // Future word — placeholder gray
                    <span className="text-gray-300">{word}</span>
                  )}
                </span>

                {/* Separator dot between words (not after last) */}
                {wi < group.length - 1 && (
                  <span className="text-lg font-bold text-violet-200 select-none">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Speed lines — trailing right as the bubble rushes left */}
          <div className="pointer-events-none absolute top-1/2 left-full flex -translate-y-1/2 flex-col gap-[6px] pl-3">
            {[
              { w: 22, delay: 0, opacity: [0.75, 0.15, 0.75] },
              { w: 32, delay: 0.1, opacity: [0.55, 0.08, 0.55] },
              { w: 18, delay: 0.2, opacity: [0.4, 0.05, 0.4] },
            ].map((line, i) => (
              <motion.div
                key={i}
                animate={{ opacity: line.opacity, scaleX: [1, 0.5, 1] }}
                transition={{
                  duration: 0.45 + i * 0.08,
                  repeat: Infinity,
                  delay: line.delay,
                  ease: "easeInOut",
                }}
                className="h-[3px] origin-right rounded-full bg-violet-300/70"
                style={{ width: line.w }}
              />
            ))}
          </div>
        </div>

        {/* Floating shadow */}
        <motion.div
          animate={{ scaleX: [1, 0.72, 1], opacity: [0.22, 0.08, 0.22] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
          className="mx-auto mt-2 h-3 w-3/4 rounded-full bg-violet-400/30 blur-md"
        />
      </motion.div>
    </div>
  );
}

// ─── Countdown overlay ────────────────────────────────────────
function CountdownOverlay({
  countdown,
  language,
}: {
  countdown: number;
  language: Language;
}) {
  const copy = translations[language].game;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-indigo-50/85 backdrop-blur-sm"
    >
      <AnimatePresence mode="wait">
        {countdown > 0 ? (
          <motion.div
            key={`n${countdown}`}
            initial={{ scale: 0.35, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2.2, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}
            className="flex flex-col items-center gap-5"
          >
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-2xl ring-8 ring-violet-200/60">
              <span className="text-7xl leading-none font-bold text-white">
                {countdown}
              </span>
            </div>
            <p className="text-xl font-semibold text-violet-500">
              {copy.countdown[countdown]}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="go"
            initial={{ scale: 0.5, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="space-y-3 text-center"
          >
            <span className="block bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 bg-clip-text text-8xl font-bold text-transparent">
              {copy.go}
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Results overlay ──────────────────────────────────────────
const DIFFICULTY_TARGET: Record<DifficultyId, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

function ResultsOverlay({
  wpm,
  accuracy,
  wordsCompleted,
  difficulty,
  language,
  onRestart,
  onHome,
}: {
  wpm: number;
  accuracy: number;
  wordsCompleted: number;
  difficulty: DifficultyId;
  language: Language;
  onRestart: () => void;
  onHome: () => void;
}) {
  const copy = translations[language].game;
  const grade =
    wpm >= 40
      ? copy.grades.exceptional
      : wpm >= 25
        ? copy.grades.great
        : wpm >= 10
          ? copy.grades.good
          : copy.grades.practice;

  useEffect(() => {
    const target = DIFFICULTY_TARGET[difficulty];
    const ratio = wpm / target;

    if (ratio < 0.5) return;

    const colors = ["#8b5cf6", "#6366f1", "#ec4899", "#f97316", "#10b981"];
    const origin = { y: 0.55 };

    if (ratio >= 2.0) {
      // Exceptional — double burst
      confetti({ particleCount: 160, spread: 80, origin, colors });
      setTimeout(
        () =>
          confetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.4 },
            colors,
          }),
        300,
      );
    } else if (ratio >= 1.5) {
      confetti({ particleCount: 120, spread: 75, origin, colors });
    } else if (ratio >= 1.0) {
      confetti({ particleCount: 70, spread: 65, origin, colors });
    } else {
      // ratio 0.5–1.0: decent attempt, light celebration
      confetti({ particleCount: 30, spread: 50, origin, colors });
    }
  }, [wpm, difficulty]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-indigo-100/75 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.82, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 22,
          delay: 0.08,
        }}
        className="mx-4 w-full max-w-sm rounded-3xl border-2 border-violet-200 bg-white p-8 text-center shadow-2xl"
      >
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 14,
            delay: 0.18,
          }}
          className="mb-2 block text-6xl"
        >
          🏆
        </motion.div>
        <h2 className="mb-1 text-3xl font-bold text-gray-900">{grade}</h2>
        <p className="mb-6 text-sm text-gray-400">{copy.finished}</p>

        <div className="mb-7 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-violet-100 bg-violet-50 p-3.5">
            <div className="text-2xl font-bold text-violet-700">{wpm}</div>
            <div className="mt-0.5 text-xs font-medium text-violet-400">
              {copy.stats.wpm}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3.5">
            <div className="text-2xl font-bold text-emerald-700">
              {accuracy}%
            </div>
            <div className="mt-0.5 text-xs font-medium text-emerald-400">
              {copy.stats.accuracy}
            </div>
          </div>
          <div className="rounded-2xl border border-pink-100 bg-pink-50 p-3.5">
            <div className="text-2xl font-bold text-pink-700">
              {wordsCompleted}
            </div>
            <div className="mt-0.5 text-xs font-medium text-pink-400">
              {copy.stats.words}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-600 to-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            {copy.restart}
          </button>
          <button
            onClick={onHome}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-100 px-6 py-3.5 text-base font-bold text-gray-700 transition-all duration-200 hover:bg-gray-200 active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            {copy.home}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main game component ──────────────────────────────────────
export default function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const language = getLanguageFromPathname(location.pathname);
  const dir = getLanguageDirection(language);
  const copy = translations[language];
  const difficulty = normalizeDifficultyId(
    location.state?.difficultyId ?? location.state?.difficulty,
  );
  const difficultyLabel =
    copy.difficulties.find((item) => item.id === difficulty)?.name ??
    copy.difficulties[0].name;

  useEffect(() => {
    document.title = copy.title;
    document.documentElement.lang = language;
  }, [copy.title, language]);

  const handleLanguageChange = (nextLanguage: Language) => {
    persistLanguage(nextLanguage);
    navigate(getEquivalentLanguagePath(location.pathname, nextLanguage), {
      state: { difficultyId: difficulty },
    });
  };

  const {
    phase,
    countdown,
    timeLeft,
    groupIdx,
    groupWordIdx,
    inputValue,
    wordsCompleted,
    justSucceeded,
    wrongChar,
    floatingChars,
    currentGroup,
    wpm,
    accuracy,
    timerPct,
    timerColor,
    wrongKeyPressed,
    nextChar,
    inputRef,
    handleKeyDown,
    handleRestart,
  } = useGameState(difficulty, language);

  const inputBorderClass = justSucceeded
    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
    : wrongKeyPressed
      ? "border-red-300 bg-red-50"
      : "border-violet-300 bg-white text-gray-900 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  return (
    <div
      dir={dir}
      className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
    >
      {/* ── Status bar ── */}
      <div className="z-10 flex-shrink-0 border-b border-violet-100/60 bg-white/80 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
          <button
            onClick={() => navigate(getHomePath(language))}
            className="flex flex-shrink-0 items-center gap-2 rounded-xl transition-opacity duration-150 hover:opacity-70"
          >
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 p-2 text-white shadow">
              <Zap className="h-4 w-4" fill="currentColor" />
            </div>
            <span className="hidden bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-sm font-bold whitespace-nowrap text-transparent sm:inline">
              {copy.gameTitle}
            </span>
          </button>

          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <LanguageToggle language={language} onChange={handleLanguageChange} />
            <div
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold transition-colors duration-500 ${
                timeLeft < 10
                  ? "border-red-200 bg-red-100 text-red-600"
                  : timeLeft < 30
                    ? "border-orange-200 bg-orange-100 text-orange-600"
                    : "border-violet-200 bg-violet-100 text-violet-700"
              }`}
            >
              <span className="text-xs">⏱</span>
              <span>{phase === "countdown" ? GAME_DURATION : timeLeft}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700">
              <span className="text-xs">⌨</span>
              <span>
                {wpm} {copy.game.stats.wpm}
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
              <span className="text-xs">✓</span>
              <span>{accuracy}%</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-100 px-3 py-1 text-sm font-bold text-pink-700">
              <span className="text-xs">📝</span>
              <span>{wordsCompleted}</span>
            </div>
            <div className="flex items-center rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
              {difficultyLabel}
            </div>
          </div>
        </div>

        {/* Timer bar */}
        <div className="h-1.5 bg-gray-100">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${timerPct}%`, backgroundColor: timerColor }}
          />
        </div>
      </div>

      {/* ── Game area ── */}
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-indigo-50 to-violet-100" />

        {/* Clouds */}
        <div className="absolute top-5 left-[6%] flex items-end">
          <div className="h-9 w-28 rounded-full bg-white/75" />
          <div className="mb-0.5 -ml-5 h-7 w-16 rounded-full bg-white/65" />
          <div className="mb-1 -ml-3 h-5 w-10 rounded-full bg-white/55" />
        </div>
        <div className="absolute top-8 right-[12%] flex items-end">
          <div className="mb-1 h-5 w-10 rounded-full bg-white/55" />
          <div className="-ml-3 h-8 w-20 rounded-full bg-white/70" />
          <div className="mb-0.5 -ml-4 h-5 w-12 rounded-full bg-white/55" />
        </div>

        {/* Ground */}
        <div className="absolute right-0 bottom-0 left-0 h-[72px]">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-400/70 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 h-5 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400" />
          <div className="absolute right-0 bottom-[22px] left-0 flex gap-3 px-6">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="h-0.5 flex-1 rounded-full bg-white/50" />
            ))}
          </div>
        </div>

        {/* Character */}
        <div className="absolute bottom-[68px] left-12 z-10">
          <RunningCharacter scared={wrongKeyPressed} />
        </div>

        {/* Mini keyboard — floats just above the grass, centered */}
        {phase === "playing" && (
          <div className="absolute bottom-[78px] left-1/2 z-[5] -translate-x-1/2">
            <MiniKeyboard
              nextChar={nextChar}
              wrongChar={wrongChar}
              difficulty={difficulty}
              language={language}
            />
          </div>
        )}

        {/* Bubble — sweeps in from the right, stops centered above the keyboard */}
        {phase !== "countdown" && (
          <motion.div
            key={`drift-${groupIdx}`}
            className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ x: 380, opacity: 0, scale: 0.85 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{
              x: { duration: 6.0, ease: [0.25, 0.46, 0.45, 0.94] },
              opacity: { duration: 0.4 },
              scale: { duration: 5.5, ease: [0.25, 0.46, 0.45, 0.94] },
            }}
          >
            <WordPill
              group={currentGroup}
              groupWordIdx={groupWordIdx}
              typed={inputValue}
            />
          </motion.div>
        )}

        {/* Countdown overlay */}
        <AnimatePresence>
          {phase === "countdown" && (
            <CountdownOverlay countdown={countdown} language={language} />
          )}
        </AnimatePresence>

        {/* Results overlay */}
        <AnimatePresence>
          {phase === "finished" && (
            <ResultsOverlay
              wpm={wpm}
              accuracy={accuracy}
              wordsCompleted={wordsCompleted}
              difficulty={difficulty}
              language={language}
              onRestart={handleRestart}
              onHome={() => navigate(getHomePath(language))}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Input area ── */}
      <div className="flex-shrink-0 border-t border-violet-100/60 bg-white/80 px-5 py-4 backdrop-blur-sm">
        <div className="relative">
          {/* Floating wrong characters */}
          <AnimatePresence>
            {floatingChars.map((fc) => (
              <motion.span
                key={fc.id}
                initial={{ y: 0, opacity: 1, scale: 1 }}
                animate={{ y: -64, opacity: 0, scale: 0.6 }}
                exit={{}}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="pointer-events-none absolute bottom-full z-10 mb-1 text-2xl font-bold text-red-400 drop-shadow"
                style={{ left: `calc(50% + ${fc.x}px)` }}
              >
                {fc.char}
              </motion.span>
            ))}
          </AnimatePresence>

          <motion.div
            animate={
              wrongKeyPressed ? { x: [-4, 4, -4, 4, -2, 2, 0] } : { x: 0 }
            }
            transition={{ duration: 0.32 }}
          >
            <input
              ref={inputRef}
              dir={dir}
              type="text"
              value={inputValue}
              onChange={() => {}}
              onKeyDown={handleKeyDown}
              disabled={phase !== "playing"}
              placeholder={phase === "playing" ? copy.game.inputPlaceholder : ""}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className={`w-full rounded-2xl border-2 px-6 py-4 text-2xl font-medium transition-all duration-200 outline-none placeholder:text-gray-300 sm:text-3xl ${
                phase !== "playing"
                  ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                  : inputBorderClass
              }`}
            />
          </motion.div>
        </div>

        <p className="mt-2 min-h-[1rem] text-center text-xs text-gray-400">
          {phase === "playing" && copy.game.playingHint}
          {phase === "countdown" && copy.game.countdownHint}
        </p>
      </div>
    </div>
  );
}
