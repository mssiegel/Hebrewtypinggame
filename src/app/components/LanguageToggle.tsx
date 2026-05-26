import { type Language } from "../../lib/types.ts";
import { LANGUAGE_LABELS } from "../../lib/language.ts";

interface LanguageToggleProps {
  language: Language;
  onChange: (language: Language) => void;
}

export function LanguageToggle({ language, onChange }: LanguageToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-violet-200 bg-white/80 p-1 shadow-sm backdrop-blur-sm">
      {(["he", "en"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`rounded-full px-3 py-1.5 text-sm font-bold transition-all duration-200 ${
            language === item
              ? "bg-gradient-to-l from-violet-600 to-indigo-600 text-white shadow"
              : "text-gray-500 hover:text-violet-700"
          }`}
        >
          {LANGUAGE_LABELS[item]}
        </button>
      ))}
    </div>
  );
}
