import { motion, AnimatePresence } from "motion/react";
import { Play, Zap, Leaf, Flame, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { RunningCharacter } from "../components/RunningCharacter.tsx";
import { LanguageToggle } from "../components/LanguageToggle.tsx";
import {
  getEquivalentLanguagePath,
  getGamePath,
  getLanguageDirection,
  getLanguageFromPathname,
  persistLanguage,
} from "../../lib/language.ts";
import { translations } from "../../lib/translations.ts";
import { type Language } from "../../lib/types.ts";

export default function Landing() {
  const [selectedSpeed, setSelectedSpeed] = useState(2);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const language = getLanguageFromPathname(location.pathname);
  const dir = getLanguageDirection(language);
  const copy = translations[language];

  useEffect(() => {
    document.title = copy.title;
    document.documentElement.lang = language;
  }, [copy.title, language]);

  const speedLevels = [
    {
      id: 1,
      difficultyId: copy.difficulties[0].id,
      name: copy.difficulties[0].name,
      wpm: copy.difficulties[0].wpm,
      icon: Leaf,
      iconColor: "text-emerald-500",
      activeBg: "bg-emerald-50",
      activeBorder: "border-emerald-400",
    },
    {
      id: 2,
      difficultyId: copy.difficulties[1].id,
      name: copy.difficulties[1].name,
      wpm: copy.difficulties[1].wpm,
      icon: Flame,
      iconColor: "text-orange-500",
      activeBg: "bg-orange-50",
      activeBorder: "border-orange-400",
      badge: copy.difficulties[1].badge,
    },
    {
      id: 3,
      difficultyId: copy.difficulties[2].id,
      name: copy.difficulties[2].name,
      wpm: copy.difficulties[2].wpm,
      icon: Zap,
      iconColor: "text-pink-500",
      activeBg: "bg-pink-50",
      activeBorder: "border-pink-400",
    },
  ];

  const floatingWords = copy.landing.floatingWords;
  const keyboardRows = copy.keyboardRows;

  const handleLanguageChange = (nextLanguage: Language) => {
    persistLanguage(nextLanguage);
    navigate(getEquivalentLanguagePath(location.pathname, nextLanguage));
  };

  const handlePlay = () => {
    if (window.matchMedia("(max-width: 768px)").matches) {
      setShowMobileWarning(true);
      return;
    }
    navigate(getGamePath(language), {
      state: { difficultyId: speedLevels[selectedSpeed - 1].difficultyId },
    });
  };

  return (
    <div
      dir={dir}
      className="min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-16 right-16 h-72 w-72 rounded-full bg-gradient-to-br from-violet-300/20 to-purple-300/20 blur-3xl" />
        <div className="absolute bottom-16 left-16 h-96 w-96 rounded-full bg-gradient-to-br from-pink-300/20 to-rose-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:py-20">
        <header className="mb-14 flex items-center justify-between gap-4">
          <LanguageToggle language={language} onChange={handleLanguageChange} />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 p-3 text-white shadow-lg">
              <Zap className="h-6 w-6" fill="currentColor" />
            </div>
            <h3 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
              {copy.title}
            </h3>
          </motion.div>
          <div className="w-[132px]" />
        </header>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Right column: content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-5xl leading-tight font-bold lg:text-6xl xl:text-7xl"
              >
                <span className="bg-gradient-to-l from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {copy.landing.headlineTop}
                </span>
                <br />
                <span className="bg-gradient-to-l from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                  {copy.landing.headlineBottom}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="max-w-xl text-xl leading-relaxed text-gray-600 lg:text-2xl"
              >
                {copy.landing.description}
              </motion.p>
            </div>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <button
                onClick={handlePlay}
                className="group relative transform overflow-hidden rounded-2xl bg-gradient-to-l from-violet-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-l from-violet-700 to-indigo-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative flex items-center gap-2">
                  {copy.landing.start}
                  <Play className="h-5 w-5" fill="currentColor" />
                </span>
              </button>
            </motion.div>

            {/* Speed selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="space-y-3"
            >
              <p className="text-sm font-semibold tracking-wide text-gray-500">
                {copy.landing.speedPrompt}
              </p>
              <div className="grid grid-cols-3 gap-3">
                {speedLevels.map((level, index) => {
                  const isSelected = selectedSpeed === level.id;
                  return (
                    <motion.div
                      key={level.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      onClick={() => setSelectedSpeed(level.id)}
                      className="relative cursor-pointer"
                    >
                      {level.badge && isSelected && (
                        <div className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-bold whitespace-nowrap text-white">
                          {level.badge}
                        </div>
                      )}
                      <div
                        className={`space-y-2 rounded-2xl border-2 bg-white p-4 text-center shadow-md transition-all duration-250 ${
                          isSelected
                            ? `${level.activeBorder} ${level.activeBg} -translate-y-1 scale-105 shadow-xl`
                            : "border-gray-100 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg"
                        } `}
                      >
                        <div
                          className={`inline-flex rounded-xl p-2 transition-colors duration-200 ${
                            isSelected ? level.activeBg : "bg-gray-50"
                          }`}
                        >
                          <level.icon
                            className={`h-5 w-5 ${level.iconColor}`}
                          />
                        </div>
                        <h3 className="text-base leading-none font-bold text-gray-900">
                          {level.name}
                        </h3>
                        <p className="text-xs text-gray-500">{level.wpm}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Left column: game mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl border-4 border-violet-200 bg-white shadow-2xl">
              {/* Game screen */}
              <div className="relative h-[320px] overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-indigo-100">
                <div className="absolute right-0 bottom-0 left-0 h-20 bg-gradient-to-t from-teal-300/70 to-transparent" />
                <div className="absolute right-0 bottom-0 left-0 h-5 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400" />

                {floatingWords.map((word, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, y: [0, -9, 0] }}
                    transition={{
                      duration: 0.6,
                      delay: word.delay,
                      y: {
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: word.delay,
                      },
                    }}
                    className="absolute"
                    style={{ top: word.top, right: word.right }}
                  >
                    <div className="relative">
                      <div className="rounded-xl border border-violet-200 bg-white px-4 py-2 shadow-md">
                        <span className="text-xl font-bold text-gray-900">
                          {word.text}
                        </span>
                      </div>

                      {/* Speed lines — same as game word pill, trailing to the right */}
                      <div className="pointer-events-none absolute top-1/2 left-full flex -translate-y-1/2 flex-col gap-[5px] pl-2">
                        {[
                          {
                            w: 14,
                            delay: 0,
                            opacity: [0.7, 0.12, 0.7] as [
                              number,
                              number,
                              number,
                            ],
                          },
                          {
                            w: 20,
                            delay: 0.1,
                            opacity: [0.5, 0.08, 0.5] as [
                              number,
                              number,
                              number,
                            ],
                          },
                          {
                            w: 11,
                            delay: 0.2,
                            opacity: [0.3, 0.05, 0.3] as [
                              number,
                              number,
                              number,
                            ],
                          },
                        ].map((line, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              opacity: line.opacity,
                              scaleX: [1, 0.5, 1],
                            }}
                            transition={{
                              duration: 0.45 + i * 0.08,
                              repeat: Infinity,
                              delay: line.delay + word.delay,
                              ease: "easeInOut",
                            }}
                            className="h-[2px] origin-right rounded-full bg-violet-300/70"
                            style={{ width: line.w }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Character — same component as the game, scaled to fit preview */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute bottom-[60px] left-8"
                >
                  <RunningCharacter scale={0.72} />
                </motion.div>
              </div>

              {/* Typing input row */}
              <div className="border-t border-gray-100 bg-white px-5 py-3">
                <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity }}
                    className="inline-block h-4 w-0.5 flex-shrink-0 rounded bg-violet-500"
                  />
                  <span className="text-base text-gray-400">
                    {copy.landing.inputPlaceholder}
                  </span>
                </div>
              </div>

              {/* Blurred keyboard */}
              <div className="pointer-events-none bg-[#d1d5db] px-3 pt-2 pb-4 select-none">
                <div className="space-y-1.5 opacity-90 blur-[1.5px]">
                  {keyboardRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-1">
                      {row.map((key, keyIndex) => (
                        <div
                          key={`${rowIndex}-${keyIndex}`}
                          className="flex h-[42px] max-w-[34px] flex-1 items-center justify-center rounded-[6px] bg-white text-[13px] font-normal text-gray-800 shadow-[0_1px_0_rgba(0,0,0,0.35)]"
                        >
                          {key}
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="flex justify-center gap-1">
                    <div className="h-[42px] w-[44px] rounded-[6px] bg-[#adb5bd] shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                    <div className="h-[42px] flex-1 rounded-[6px] bg-white shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                    <div className="h-[42px] w-[84px] rounded-[6px] bg-[#adb5bd] shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showMobileWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileWarning(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              dir={dir}
              className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
            >
              <div className="mb-5 flex justify-center">
                <div className="rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 p-4">
                  <Monitor className="h-10 w-10 text-violet-600" />
                </div>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-gray-900">
                {copy.landing.mobileTitle}
              </h2>
              <p className="mb-6 leading-relaxed text-gray-500">
                {copy.landing.mobileDescription}
              </p>
              <button
                onClick={() => setShowMobileWarning(false)}
                className="w-full rounded-2xl bg-gradient-to-l from-violet-600 to-indigo-600 py-3 font-bold text-white"
              >
                {copy.landing.mobileButton}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
