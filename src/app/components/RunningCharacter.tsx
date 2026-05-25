import { motion } from "motion/react";

interface RunningCharacterProps {
  scared?: boolean;
  /** Scale relative to the default game size (76×88 body). Default: 1 */
  scale?: number;
}

export function RunningCharacter({ scared = false, scale = 1 }: RunningCharacterProps) {
  const bw = Math.round(76 * scale);
  const bh = Math.round(88 * scale);
  const eyeSize = Math.round(14 * scale);
  const pupilSize = Math.round(8 * scale);
  const eyeTop = Math.round(26 * scale);
  const eyeInset = Math.round(14 * scale);
  const mouthTop = Math.round(54 * scale);
  const mouthW = Math.round(22 * scale);
  const mouthH = Math.round(11 * scale);
  const armW = Math.round(15 * scale);
  const armH = Math.round(7 * scale);
  const armTop = Math.round(34 * scale);
  const armOut = Math.round(15 * scale);
  const legW = Math.round(14 * scale);
  const legH = Math.round(18 * scale);
  const legGap = Math.round(10 * scale);
  const shadowW = Math.round(64 * scale);
  const lineW1 = Math.round(18 * scale);
  const lineW2 = Math.round(13 * scale);
  const lineW3 = Math.round(9 * scale);
  const lineTop1 = Math.round(28 * scale);
  const lineTop2 = Math.round(40 * scale);
  const lineTop3 = Math.round(50 * scale);
  const lineLeft = Math.round(34 * scale);

  return (
    <div className="relative select-none">
      {/* Ground shadow */}
      <motion.div
        animate={{ scaleX: [1, 0.65, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full blur-sm bg-violet-900/20"
        style={{ width: shadowW, height: Math.round(12 * scale) }}
      />

      {/* Body bounce */}
      <motion.div
        animate={{ y: [0, Math.round(-9 * scale), 0] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Blob body */}
        <div
          className={`relative rounded-[50%] shadow-xl transition-colors duration-200 ${
            scared
              ? "bg-gradient-to-br from-red-400 to-rose-500"
              : "bg-gradient-to-br from-violet-500 to-indigo-600"
          }`}
          style={{ width: bw, height: bh }}
        >
          {/* Left eye */}
          <div
            className="absolute bg-white rounded-full flex items-center justify-center shadow-sm"
            style={{ width: eyeSize, height: eyeSize, top: eyeTop, left: eyeInset }}
          >
            <div
              className={`rounded-full transition-colors duration-200 ${scared ? "bg-red-900" : "bg-gray-900"}`}
              style={{ width: pupilSize, height: pupilSize }}
            />
          </div>
          {/* Right eye */}
          <div
            className="absolute bg-white rounded-full flex items-center justify-center shadow-sm"
            style={{ width: eyeSize, height: eyeSize, top: eyeTop, right: eyeInset }}
          >
            <div
              className={`rounded-full transition-colors duration-200 ${scared ? "bg-red-900" : "bg-gray-900"}`}
              style={{ width: pupilSize, height: pupilSize }}
            />
          </div>

          {/* Mouth */}
          {scared ? (
            <div
              className="absolute left-1/2 -translate-x-1/2 border-t-2 border-white/90 rounded-t-full"
              style={{ top: mouthTop, width: Math.round(mouthW * 0.9), height: Math.round(mouthH * 0.9) }}
            />
          ) : (
            <div
              className="absolute left-1/2 -translate-x-1/2 border-b-2 border-white/90 rounded-b-full"
              style={{ top: mouthTop, width: mouthW, height: mouthH }}
            />
          )}

          {/* Left arm */}
          <motion.div
            animate={{ rotate: [-28, 28, -28] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            className={`absolute rounded-full origin-right transition-colors duration-200 ${
              scared ? "bg-red-300" : "bg-violet-400"
            }`}
            style={{ top: armTop, left: -armOut, width: armW, height: armH }}
          />
          {/* Right arm */}
          <motion.div
            animate={{ rotate: [28, -28, 28] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            className={`absolute rounded-full origin-left transition-colors duration-200 ${
              scared ? "bg-rose-400" : "bg-indigo-500"
            }`}
            style={{ top: armTop, right: -armOut, width: armW, height: armH }}
          />
        </div>

        {/* Legs */}
        <div className="flex justify-center" style={{ gap: legGap, paddingTop: 3 }}>
          <motion.div
            animate={{ y: [0, Math.round(-8 * scale), 0] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            className="bg-indigo-700 rounded-full"
            style={{ width: legW, height: legH }}
          />
          <motion.div
            animate={{ y: [Math.round(-8 * scale), 0, Math.round(-8 * scale)] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            className="bg-indigo-700 rounded-full"
            style={{ width: legW, height: legH }}
          />
        </div>
      </motion.div>

      {/* Motion lines trailing to the left */}
      <motion.div
        animate={{ x: [0, Math.round(-14 * scale), 0], opacity: [0.85, 0, 0.85] }}
        transition={{ duration: 0.4, repeat: Infinity }}
        className="absolute bg-violet-300/80 rounded-full"
        style={{ top: lineTop1, left: -lineLeft, width: lineW1, height: Math.round(3 * scale) }}
      />
      <motion.div
        animate={{ x: [0, Math.round(-11 * scale), 0], opacity: [0.55, 0, 0.55] }}
        transition={{ duration: 0.4, repeat: Infinity, delay: 0.13 }}
        className="absolute bg-violet-200/70 rounded-full"
        style={{ top: lineTop2, left: -lineLeft, width: lineW2, height: Math.round(2 * scale) }}
      />
      <motion.div
        animate={{ x: [0, Math.round(-9 * scale), 0], opacity: [0.35, 0, 0.35] }}
        transition={{ duration: 0.4, repeat: Infinity, delay: 0.24 }}
        className="absolute bg-violet-200/50 rounded-full"
        style={{ top: lineTop3, left: -lineLeft, width: lineW3, height: Math.round(2 * scale) }}
      />
    </div>
  );
}
