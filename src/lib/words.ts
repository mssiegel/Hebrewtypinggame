export const WORD_BANK = [
  "חבר",
  "שלום",
  "ספר",
  "בית",
  "ילד",
  "כלב",
  "חתול",
  "כיתה",
  "חלום",
  "מים",
  "לב",
  "יד",
  "עין",
  "שיר",
  "יום",
  "גן",
  "פרח",
  "עץ",
  "כוכב",
  "ירח",
  "צבע",
  "ענן",
  "נהר",
  "הר",
  "כדור",
  "דרך",
  "שם",
  "שמש",
  "עיר",
  "ארץ",
  "רוח",
  "לילה",
  "אבן",
  "ירוק",
  "אדום",
  "דג",
  "עוף",
  "פה",
  "אף",
  "שיער",
  "גג",
  "קיר",
  "דלת",
  "כיסא",
  "חלון",
  "אוכל",
  "זמן",
  "שמחה",
  "לחם",
  "חלב",
  "בוקר",
  "ערב",
  "ילדה",
  "מכתב",
  "תפוח",
  "בלון",
  "שמיים",
  "כחול",
  "לבן",
  "שחור",
  "גדול",
  "קטן",
  "יפה",
  "חדש",
  "ים",
  "אחד",
  "אש",
  "ענף",
  "שבת",
  "מלון",
  "ברכה",
  "נר",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function makeGroups(difficulty: string): string[][] {
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
