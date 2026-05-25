import { useState, useEffect, useRef, useCallback } from "react";
import { GAME_DURATION } from "./constants.ts";
import { makeGroups } from "./words.ts";
import { type Phase, type FloatingChar } from "./types.ts";

export function useGameState(difficulty: string) {
  const [phase, setPhase] = useState<Phase>("countdown");
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const [wordGroups, setWordGroups] = useState<string[][]>(() => makeGroups(difficulty));
  const [groupIdx, setGroupIdx] = useState(0);
  const [groupWordIdx, setGroupWordIdx] = useState(0);

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
        if (t <= 1) {
          setPhase("finished");
          return 0;
        }
        return t - 1;
      });
      setElapsedSec((s) => s + 1);
    }, 1000);
    return () => clearInterval(iv);
  }, [phase]);

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
          setWordsCompleted((w) => w + 1);
          setJustSucceeded(true);
          setTimeout(() => setJustSucceeded(false), 200);

          if (groupWordIdx < currentGroup.length - 1) {
            setGroupWordIdx((i) => i + 1);
            setInputValue("");
          } else {
            setGroupIdx((i) => i + 1);
            setGroupWordIdx(0);
            setInputValue("");
          }
        }
      } else {
        const id = Date.now() + Math.random();
        const x = Math.floor(Math.random() * 100 - 50);
        setFloatingChars((prev) => [...prev, { id, char: e.key, x }]);
        setTimeout(() => setFloatingChars((prev) => prev.filter((c) => c.id !== id)), 750);
        setWrongChar(e.key);
        setTimeout(() => setWrongChar(null), 400);
      }
    },
    [phase, currentWord, currentGroup, groupWordIdx, inputValue],
  );

  const handleRestart = useCallback(() => {
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
  }, [difficulty]);

  return {
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
    currentWord,
    wpm,
    accuracy,
    timerPct,
    timerColor,
    wrongKeyPressed,
    nextChar,
    inputRef,
    handleKeyDown,
    handleRestart,
  };
}
