import { type DifficultyId, type Language } from "./types.ts";

interface DifficultyCopy {
  id: DifficultyId;
  name: string;
  wpm: string;
  badge?: string;
}

export const translations: Record<
  Language,
  {
    title: string;
    gameTitle: string;
    landing: {
      headlineTop: string;
      headlineBottom: string;
      description: string;
      start: string;
      speedPrompt: string;
      floatingWords: Array<{ text: string; top: string; right: string; delay: number }>;
      inputPlaceholder: string;
      mobileTitle: string;
      mobileDescription: string;
      mobileButton: string;
    };
    game: {
      countdown: Record<number, string>;
      go: string;
      finished: string;
      grades: {
        exceptional: string;
        great: string;
        good: string;
        practice: string;
      };
      stats: {
        wpm: string;
        accuracy: string;
        words: string;
      };
      restart: string;
      home: string;
      inputPlaceholder: string;
      playingHint: string;
      countdownHint: string;
    };
    difficulties: DifficultyCopy[];
    keyboardRows: string[][];
  }
> = {
  he: {
    title: "מִרְדָּף הַמִּלִּים",
    gameTitle: "מִרְדָּף הַמִּלִּים",
    landing: {
      headlineTop: "תַּקְלִידוּ בְּעִבְרִית.",
      headlineBottom: "תָּרוּצוּ קָדִימָה.",
      description:
        "משחק הקלדה פשוט וכיפי שעוזר לכם להשתפר בעברית, מילה אחרי מילה. בלי לחץ, רק אתם והמקלדת.",
      start: "התחילו לשחק",
      speedPrompt: "בחרו את הקצב שלכם:",
      floatingWords: [
        { text: "כיתה", top: "16%", right: "52%", delay: 0 },
        { text: "חבר", top: "36%", right: "12%", delay: 0.25 },
        { text: "חלום", top: "55%", right: "42%", delay: 0.5 },
      ],
      inputPlaceholder: "הקלד כאן...",
      mobileTitle: "המשחק פועל במחשב בלבד",
      mobileDescription: "כדי לשחק צריך מקלדת פיזית. פתחו את המשחק מהמחשב שלכם ותהנו!",
      mobileButton: "הבנתי",
    },
    game: {
      countdown: {
        3: "מוכנים?",
        2: "התכוננו...",
        1: "עוד שנייה!",
      },
      go: "קדימה!",
      finished: "סיימתם 60 שניות",
      grades: {
        exceptional: "מדהים!",
        great: "כל הכבוד!",
        good: "לא רע!",
        practice: "המשיכו להתאמן!",
      },
      stats: {
        wpm: "מ/ד",
        accuracy: "דיוק",
        words: "מילים",
      },
      restart: "שחקו שוב",
      home: "חזרה למסך הראשי",
      inputPlaceholder: "הקלידו כאן...",
      playingHint: "הקלידו את המילה לפני שהדמות מגיעה אליה",
      countdownHint: "המשחק מתחיל בקרוב...",
    },
    difficulties: [
      { id: "easy", name: "מתחיל", wpm: "10 מילים בדקה" },
      { id: "medium", name: "בינוני", wpm: "25 מילים בדקה", badge: "מומלץ" },
      { id: "hard", name: "מהיר", wpm: "50 מילים בדקה" },
    ],
    keyboardRows: [
      ["פ", "ם", "ן", "ו", "ט", "א", "ר", "ק", "'", "/"],
      ["ף", "ך", "ל", "ח", "י", "ע", "כ", "ג", "ד", "ש"],
      [".", ",", "ץ", "ת", "צ", "מ", "נ", "ה", "ב", "ס", "ז"],
    ],
  },
  en: {
    title: "Word Chase",
    gameTitle: "Word Chase",
    landing: {
      headlineTop: "Type fast.",
      headlineBottom: "Keep moving.",
      description:
        "A simple typing game that helps you build speed, one word at a time. No pressure, just you and the keyboard.",
      start: "Start playing",
      speedPrompt: "Choose your pace:",
      floatingWords: [
        { text: "class", top: "16%", right: "52%", delay: 0 },
        { text: "friend", top: "36%", right: "12%", delay: 0.25 },
        { text: "dream", top: "55%", right: "42%", delay: 0.5 },
      ],
      inputPlaceholder: "type here...",
      mobileTitle: "This game works on desktop",
      mobileDescription: "You need a physical keyboard to play. Open the game on your computer and enjoy!",
      mobileButton: "Got it",
    },
    game: {
      countdown: {
        3: "Ready?",
        2: "Get set...",
        1: "Almost!",
      },
      go: "Go!",
      finished: "You finished 60 seconds",
      grades: {
        exceptional: "Amazing!",
        great: "Great job!",
        good: "Not bad!",
        practice: "Keep practicing!",
      },
      stats: {
        wpm: "wpm",
        accuracy: "accuracy",
        words: "words",
      },
      restart: "Play again",
      home: "Back to home",
      inputPlaceholder: "type here...",
      playingHint: "Type the word before the character reaches it",
      countdownHint: "The game starts soon...",
    },
    difficulties: [
      { id: "easy", name: "Beginner", wpm: "10 words per minute" },
      { id: "medium", name: "Medium", wpm: "25 words per minute", badge: "Recommended" },
      { id: "hard", name: "Fast", wpm: "50 words per minute" },
    ],
    keyboardRows: [
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
      ["z", "x", "c", "v", "b", "n", "m"],
    ],
  },
};
