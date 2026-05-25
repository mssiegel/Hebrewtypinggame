import { motion } from "motion/react";
import { Play, Zap, Leaf, Flame } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { RunningCharacter } from "../components/RunningCharacter.tsx";

export default function Landing() {
  const [selectedSpeed, setSelectedSpeed] = useState(2);
  const navigate = useNavigate();

  const speedLevels = [
    {
      id: 1,
      name: "מתחיל",
      wpm: "10 מילים בדקה",
      icon: Leaf,
      iconColor: "text-emerald-500",
      activeBg: "bg-emerald-50",
      activeBorder: "border-emerald-400",
    },
    {
      id: 2,
      name: "בינוני",
      wpm: "25 מילים בדקה",
      icon: Flame,
      iconColor: "text-orange-500",
      activeBg: "bg-orange-50",
      activeBorder: "border-orange-400",
      badge: "מומלץ",
    },
    {
      id: 3,
      name: "מהיר",
      wpm: "50 מילים בדקה",
      icon: Zap,
      iconColor: "text-pink-500",
      activeBg: "bg-pink-50",
      activeBorder: "border-pink-400",
    },
  ];

  const floatingWords = [
    { text: "כיתה", top: "16%", right: "52%", delay: 0 },
    { text: "חבר", top: "36%", right: "12%", delay: 0.25 },
    { text: "חלום", top: "55%", right: "42%", delay: 0.5 },
  ];

  const keyboardRows = [
    ["פ", "ם", "ן", "ו", "ט", "א", "ר", "ק", "'", "/"],
    ["ף", "ך", "ל", "ח", "י", "ע", "כ", "ג", "ד", "ש"],
    [".", ",", "ץ", "ת", "צ", "מ", "נ", "ה", "ב", "ס", "ז"],
  ];

  const handlePlay = () => {
    navigate("/game", {
      state: { difficulty: speedLevels[selectedSpeed - 1].name },
    });
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 right-16 w-72 h-72 bg-gradient-to-br from-violet-300/20 to-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-16 left-16 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-rose-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <header className="mb-14">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white p-3 rounded-2xl shadow-lg">
              <Zap className="w-6 h-6" fill="currentColor" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              מִרְדָּף הַמִּלִּים
            </h3>
          </motion.div>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
                className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
              >
                <span className="bg-gradient-to-l from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  תַּקְלִידוּ בְּעִבְרִית.
                </span>
                <br />
                <span className="bg-gradient-to-l from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                  תָּרוּצוּ קָדִימָה.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-xl"
              >
                משחק הקלדה פשוט וכיפי שעוזר לכם להשתפר בעברית, מילה אחרי מילה.
                בלי לחץ, רק אתם והמקלדת.
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
                className="group relative px-8 py-4 bg-gradient-to-l from-violet-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-l from-violet-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  התחילו לשחק
                  <Play className="w-5 h-5" fill="currentColor" />
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
              <p className="text-sm font-semibold text-gray-500 tracking-wide">
                בחרו את הקצב שלכם:
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
                      {"badge" in level && isSelected && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 bg-orange-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          {level.badge}
                        </div>
                      )}
                      <div
                        className={`
                          bg-white rounded-2xl p-4 text-center space-y-2 shadow-md
                          border-2 transition-all duration-250
                          ${isSelected
                            ? `${level.activeBorder} ${level.activeBg} scale-105 -translate-y-1 shadow-xl`
                            : "border-gray-100 hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg"
                          }
                        `}
                      >
                        <div
                          className={`inline-flex p-2 rounded-xl transition-colors duration-200 ${
                            isSelected ? level.activeBg : "bg-gray-50"
                          }`}
                        >
                          <level.icon className={`w-5 h-5 ${level.iconColor}`} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-base leading-none">
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
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-violet-200">
              {/* Game screen */}
              <div className="relative h-[320px] bg-gradient-to-b from-sky-200 via-sky-100 to-indigo-100 overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-teal-300/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400" />

                {floatingWords.map((word, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, y: [0, -9, 0] }}
                    transition={{
                      duration: 0.6,
                      delay: word.delay,
                      y: { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: word.delay },
                    }}
                    className="absolute"
                    style={{ top: word.top, right: word.right }}
                  >
                    <div className="relative">
                      <div className="bg-white rounded-xl px-4 py-2 shadow-md border border-violet-200">
                        <span className="text-xl font-bold text-gray-900">{word.text}</span>
                      </div>

                      {/* Speed lines — same as game word pill, trailing to the right */}
                      <div className="absolute top-1/2 -translate-y-1/2 left-full pl-2 flex flex-col gap-[5px] pointer-events-none">
                        {[
                          { w: 14, delay: 0,   opacity: [0.7, 0.12, 0.7] as [number, number, number] },
                          { w: 20, delay: 0.1, opacity: [0.5, 0.08, 0.5] as [number, number, number] },
                          { w: 11, delay: 0.2, opacity: [0.3, 0.05, 0.3] as [number, number, number] },
                        ].map((line, i) => (
                          <motion.div
                            key={i}
                            animate={{ opacity: line.opacity, scaleX: [1, 0.5, 1] }}
                            transition={{
                              duration: 0.45 + i * 0.08,
                              repeat: Infinity,
                              delay: line.delay + word.delay,
                              ease: "easeInOut",
                            }}
                            className="h-[2px] bg-violet-300/70 rounded-full origin-right"
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
              <div className="px-5 py-3 bg-white border-t border-gray-100">
                <div className="bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 flex items-center gap-1.5">
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 bg-violet-500 rounded flex-shrink-0"
                  />
                  <span className="text-base text-gray-400">הקלד כאן...</span>
                </div>
              </div>

              {/* Blurred keyboard */}
              <div className="px-3 pb-4 pt-2 bg-[#d1d5db] select-none pointer-events-none">
                <div className="space-y-1.5 blur-[1.5px] opacity-90">
                  {keyboardRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1 justify-center">
                      {row.map((key, keyIndex) => (
                        <div
                          key={`${rowIndex}-${keyIndex}`}
                          className="flex-1 max-w-[34px] h-[42px] bg-white rounded-[6px] shadow-[0_1px_0_rgba(0,0,0,0.35)] flex items-center justify-center text-[13px] font-normal text-gray-800"
                        >
                          {key}
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="flex gap-1 justify-center">
                    <div className="w-[44px] h-[42px] bg-[#adb5bd] rounded-[6px] shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                    <div className="flex-1 h-[42px] bg-white rounded-[6px] shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                    <div className="w-[84px] h-[42px] bg-[#adb5bd] rounded-[6px] shadow-[0_1px_0_rgba(0,0,0,0.35)]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
