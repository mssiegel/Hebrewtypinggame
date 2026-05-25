import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import { Zap, Home, RotateCcw } from "lucide-react";
import { RunningCharacter } from "../components/RunningCharacter.tsx";
import { MiniKeyboard } from "../components/MiniKeyboard.tsx";

// ─── word bank ────────────────────────────────────────────────
const WORD_BANK = [
  "חבר", "שלום", "ספר", "בית", "ילד", "כלב", "חתול", "כיתה",
  "חלום", "מים", "לב", "יד", "עין", "שיר", "יום", "גן",
  "פרח", "עץ", "כוכב", "ירח", "צבע", "ענן", "נהר", "הר",
  "כדור", "דרך", "שם", "שמש", "עיר", "ארץ", "רוח", "לילה",
  "אבן", "ירוק", "אדום", "דג", "עוף", "פה", "אף", "שיער",
  "גג", "קיר", "דלת", "כיסא", "חלון", "אוכל", "זמן", "שמחה",
  "לחם", "חלב", "בוקר", "ערב", "ילדה", "מכתב", "תפוח", "בלון",
  "שמיים", "כחול", "לבן", "שחור", "גדול", "קטן", "יפה", "חדש",
  "ים", "אחד", "אש", "ענף", "שבת", "מלון", "ברכה", "נר",
];

const GAME_DURATION = 60;
type Phase = "countdown" | "playing" | "finished";

interface FloatingChar {
  id: number;
  char: string;
  x: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Groups words into bubbles based on difficulty
function makeGroups(difficulty: string): string[][] {
  const words = shuffle(WORD_BANK);
  const groups: string[][] = [];
  let i = 0;
  while (i < words.length) {
    let size = 1;
    if (difficulty === "בינוני") size = Math.random() < 0.5 ? 2 : 3;
    else if (difficulty === "מהיר") size = Math.random() < 0.5 ? 4 : 5;
    const end = Math.min(i + size, words.length);
    groups.push(words.slice(i, end));
    i += size;
  }
  return groups;
}

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
    group.length >= 4 ? "text-2xl" : group.length >= 2 ? "text-3xl" : "text-4xl";

  return (
    <div>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 rounded-3xl blur-xl bg-violet-400/35" />

          {/* Card */}
          <div className="relative px-6 py-4 rounded-3xl shadow-2xl border-2 bg-white border-violet-200 flex items-center gap-3 flex-wrap max-w-md">
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
                          <span key={ci} className={`transition-colors duration-100 ${cls}`}>
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
                  <span className="text-violet-200 text-lg font-bold select-none">·</span>
                )}
              </span>
            ))}
          </div>

          {/* Speed lines — trailing right as the bubble rushes left */}
          <div className="absolute top-1/2 -translate-y-1/2 left-full pl-3 flex flex-col gap-[6px] pointer-events-none">
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
                className="h-[3px] bg-violet-300/70 rounded-full origin-right"
                style={{ width: line.w }}
              />
            ))}
          </div>
        </div>

        {/* Floating shadow */}
        <motion.div
          animate={{ scaleX: [1, 0.72, 1], opacity: [0.22, 0.08, 0.22] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="mx-auto mt-2 w-3/4 h-3 bg-violet-400/30 rounded-full blur-md"
        />
      </motion.div>
    </div>
  );
}

// ─── Countdown overlay ────────────────────────────────────────
function CountdownOverlay({ countdown }: { countdown: number }) {
  const labels: Record<number, string> = { 3: "מוכנים?", 2: "התכוננו...", 1: "עוד שנייה!" };
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
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl ring-8 ring-violet-200/60">
              <span className="text-7xl font-bold text-white leading-none">{countdown}</span>
            </div>
            <p className="text-violet-500 font-semibold text-xl">{labels[countdown]}</p>
          </motion.div>
        ) : (
          <motion.div
            key="go"
            initial={{ scale: 0.5, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-center space-y-3"
          >
            <span className="text-8xl font-bold bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 bg-clip-text text-transparent block">
              קדימה!
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="h-1.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Results overlay ──────────────────────────────────────────
function ResultsOverlay({
  wpm, accuracy, wordsCompleted, onRestart, onHome,
}: {
  wpm: number; accuracy: number; wordsCompleted: number;
  onRestart: () => void; onHome: () => void;
}) {
  const grade =
    wpm >= 40 ? "מדהים!" : wpm >= 25 ? "כל הכבוד!" : wpm >= 10 ? "לא רע!" : "המשיכו להתאמן!";

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
        transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.08 }}
        className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-violet-200 w-full max-w-sm mx-4 text-center"
      >
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.18 }}
          className="text-6xl mb-2 block"
        >
          🏆
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-1">{grade}</h2>
        <p className="text-gray-400 text-sm mb-6">סיימתם 60 שניות</p>

        <div className="grid grid-cols-3 gap-3 mb-7">
          <div className="bg-violet-50 rounded-2xl p-3.5 border border-violet-100">
            <div className="text-2xl font-bold text-violet-700">{wpm}</div>
            <div className="text-xs text-violet-400 mt-0.5 font-medium">מ/ד</div>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-700">{accuracy}%</div>
            <div className="text-xs text-emerald-400 mt-0.5 font-medium">דיוק</div>
          </div>
          <div className="bg-pink-50 rounded-2xl p-3.5 border border-pink-100">
            <div className="text-2xl font-bold text-pink-700">{wordsCompleted}</div>
            <div className="text-xs text-pink-400 mt-0.5 font-medium">מילים</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="w-full py-3.5 px-6 bg-gradient-to-l from-violet-600 to-indigo-600 text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            שחקו שוב
          </button>
          <button
            onClick={onHome}
            className="w-full py-3.5 px-6 bg-gray-100 text-gray-700 rounded-2xl font-bold text-base hover:bg-gray-200 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            חזרה למסך הראשי
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
  const difficulty = (location.state?.difficulty as string) ?? "מתחיל";

  const [phase, setPhase] = useState<Phase>("countdown");
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  // Word groups — one bubble per group; size depends on difficulty
  const [wordGroups, setWordGroups] = useState<string[][]>(() => makeGroups(difficulty));
  const [groupIdx, setGroupIdx] = useState(0);       // which bubble
  const [groupWordIdx, setGroupWordIdx] = useState(0); // which word inside bubble

  const [inputValue, setInputValue] = useState("");
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [correctTyped, setCorrectTyped] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [justSucceeded, setJustSucceeded] = useState(false);
  const [wrongChar, setWrongChar] = useState<string | null>(null);
  const [floatingChars, setFloatingChars] = useState<FloatingChar[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const currentGroup = wordGroups[groupIdx % wordGroups.length];
  const currentWord = currentGroup[groupWordIdx];
  const wpm = elapsedSec > 0 ? Math.round((wordsCompleted / elapsedSec) * 60) : 0;
  const accuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;
  const timerPct = (timeLeft / GAME_DURATION) * 100;
  const timerColor = timeLeft < 10 ? "#ef4444" : timeLeft < 30 ? "#f97316" : "#8b5cf6";
  const wrongKeyPressed = wrongChar !== null;
  const nextChar = currentWord[inputValue.length] ?? "";

  // Countdown tick
  useEffect(() => {
    if (phase !== "countdown") return;
    const ms = countdown === 0 ? 700 : 1000;
    const t = setTimeout(() => {
      if (countdown > 0) setCountdown((c) => c - 1);
      else setPhase("playing");
    }, ms);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Focus input when game starts
  useEffect(() => {
    if (phase === "playing") inputRef.current?.focus();
  }, [phase]);

  // Game timer
  useEffect(() => {
    if (phase !== "playing") return;
    const iv = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { setPhase("finished"); return 0; }
        return t - 1;
      });
      setElapsedSec((s) => s + 1);
    }, 1000);
    return () => clearInterval(iv);
  }, [phase]);

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (phase !== "playing") return;
      if (e.key.length !== 1) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      e.preventDefault();

      const nextExpected = currentWord[inputValue.length];
      setTotalTyped((t) => t + 1);

      if (e.key === nextExpected) {
        setCorrectTyped((c) => c + 1);
        const newVal = inputValue + e.key;
        setInputValue(newVal);

        if (newVal === currentWord) {
          // Word complete — flash green
          setWordsCompleted((w) => w + 1);
          setJustSucceeded(true);
          setTimeout(() => setJustSucceeded(false), 200);

          if (groupWordIdx < currentGroup.length - 1) {
            // More words remain in this bubble — advance to next word
            setGroupWordIdx((i) => i + 1);
            setInputValue("");
          } else {
            // Bubble complete — move to next group
            setGroupIdx((i) => i + 1);
            setGroupWordIdx(0);
            setInputValue("");
          }
        }
      } else {
        // Wrong key — spawn floating red char, reject from input
        const id = Date.now() + Math.random();
        const x = Math.floor(Math.random() * 100 - 50);
        setFloatingChars((prev) => [...prev, { id, char: e.key, x }]);
        setTimeout(
          () => setFloatingChars((prev) => prev.filter((c) => c.id !== id)),
          750
        );
        setWrongChar(e.key);
        setTimeout(() => setWrongChar(null), 400);
      }
    },
    [phase, currentWord, currentGroup, groupWordIdx, inputValue]
  );

  const handleRestart = () => {
    setPhase("countdown");
    setCountdown(3);
    setTimeLeft(GAME_DURATION);
    setWordGroups(makeGroups(difficulty));
    setGroupIdx(0);
    setGroupWordIdx(0);
    setInputValue("");
    setWordsCompleted(0);
    setTotalTyped(0);
    setCorrectTyped(0);
    setElapsedSec(0);
    setJustSucceeded(false);
    setWrongChar(null);
    setFloatingChars([]);
  };

  const inputBorderClass = justSucceeded
    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
    : wrongKeyPressed
    ? "border-red-300 bg-red-50"
    : "border-violet-300 bg-white text-gray-900 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  return (
    <div
      dir="rtl"
      className="h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden"
    >
      {/* ── Status bar ── */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-violet-100/60 z-10">
        <div className="flex items-center justify-between px-4 py-2.5 gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white p-2 rounded-xl shadow">
              <Zap className="w-4 h-4" fill="currentColor" />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent hidden sm:inline whitespace-nowrap">
              מִרְדָּף הַמִּלִּים
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border transition-colors duration-500 ${
                timeLeft < 10
                  ? "bg-red-100 text-red-600 border-red-200"
                  : timeLeft < 30
                  ? "bg-orange-100 text-orange-600 border-orange-200"
                  : "bg-violet-100 text-violet-700 border-violet-200"
              }`}
            >
              <span className="text-xs">⏱</span>
              <span>{phase === "countdown" ? GAME_DURATION : timeLeft}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 text-sm font-bold">
              <span className="text-xs">⌨</span>
              <span>{wpm} מ/ד</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm font-bold">
              <span className="text-xs">✓</span>
              <span>{accuracy}%</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 border border-pink-200 text-sm font-bold">
              <span className="text-xs">📝</span>
              <span>{wordsCompleted}</span>
            </div>
            <div className="flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 text-sm font-semibold">
              {difficulty}
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
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-indigo-50 to-violet-100" />

        {/* Clouds */}
        <div className="absolute top-5 left-[6%] flex items-end">
          <div className="w-28 h-9 bg-white/75 rounded-full" />
          <div className="w-16 h-7 bg-white/65 rounded-full -ml-5 mb-0.5" />
          <div className="w-10 h-5 bg-white/55 rounded-full -ml-3 mb-1" />
        </div>
        <div className="absolute top-8 right-[12%] flex items-end">
          <div className="w-10 h-5 bg-white/55 rounded-full mb-1" />
          <div className="w-20 h-8 bg-white/70 rounded-full -ml-3" />
          <div className="w-12 h-5 bg-white/55 rounded-full -ml-4 mb-0.5" />
        </div>

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-[72px]">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-400/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400" />
          <div className="absolute bottom-[22px] left-0 right-0 flex gap-3 px-6">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="flex-1 h-0.5 bg-white/50 rounded-full" />
            ))}
          </div>
        </div>

        {/* Character */}
        <div className="absolute bottom-[68px] left-12 z-10">
          <RunningCharacter scared={wrongKeyPressed} />
        </div>

        {/* Mini keyboard — floats just above the grass, centered */}
        {phase === "playing" && (
          <div className="absolute bottom-[78px] left-1/2 -translate-x-1/2 z-[5]">
            <MiniKeyboard
              nextChar={nextChar}
              wrongChar={wrongChar}
              difficulty={difficulty}
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
          {phase === "countdown" && <CountdownOverlay countdown={countdown} />}
        </AnimatePresence>

        {/* Results overlay */}
        <AnimatePresence>
          {phase === "finished" && (
            <ResultsOverlay
              wpm={wpm}
              accuracy={accuracy}
              wordsCompleted={wordsCompleted}
              onRestart={handleRestart}
              onHome={() => navigate("/")}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Input area ── */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-t border-violet-100/60 px-5 py-4">
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
                className="absolute bottom-full mb-1 text-2xl font-bold text-red-400 drop-shadow pointer-events-none z-10"
                style={{ left: `calc(50% + ${fc.x}px)` }}
              >
                {fc.char}
              </motion.span>
            ))}
          </AnimatePresence>

          <motion.div
            animate={wrongKeyPressed ? { x: [-4, 4, -4, 4, -2, 2, 0] } : { x: 0 }}
            transition={{ duration: 0.32 }}
          >
            <input
              ref={inputRef}
              dir="rtl"
              type="text"
              value={inputValue}
              onChange={() => {}}
              onKeyDown={handleKeyDown}
              disabled={phase !== "playing"}
              placeholder={phase === "playing" ? "הקלידו כאן..." : ""}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className={`w-full text-2xl sm:text-3xl px-6 py-4 rounded-2xl border-2 outline-none transition-all duration-200 font-medium placeholder:text-gray-300 ${
                phase !== "playing"
                  ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                  : inputBorderClass
              }`}
            />
          </motion.div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-2 min-h-[1rem]">
          {phase === "playing" && "הקלידו את המילה לפני שהדמות מגיעה אליה"}
          {phase === "countdown" && "המשחק מתחיל בקרוב..."}
        </p>
      </div>
    </div>
  );
}
