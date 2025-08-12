import type { HiraganaCharacter } from "../types";

// Re-export HiraganaCharacter for backward compatibility
export type { HiraganaCharacter } from "../types";

export const hiraganaCharacters: HiraganaCharacter[] = [
  // Basic Hiragana (a-row)
  {
    id: "a",
    character: "あ",
    romaji: "a",
    pronunciation: "ah",
    category: "basic",
  },
  {
    id: "i",
    character: "い",
    romaji: "i",
    pronunciation: "ee",
    category: "basic",
  },
  {
    id: "u",
    character: "う",
    romaji: "u",
    pronunciation: "oo",
    category: "basic",
  },
  {
    id: "e",
    character: "え",
    romaji: "e",
    pronunciation: "eh",
    category: "basic",
  },
  {
    id: "o",
    character: "お",
    romaji: "o",
    pronunciation: "oh",
    category: "basic",
  },

  // k-row
  {
    id: "ka",
    character: "か",
    romaji: "ka",
    pronunciation: "kah",
    category: "basic",
  },
  {
    id: "ki",
    character: "き",
    romaji: "ki",
    pronunciation: "kee",
    category: "basic",
  },
  {
    id: "ku",
    character: "く",
    romaji: "ku",
    pronunciation: "koo",
    category: "basic",
  },
  {
    id: "ke",
    character: "け",
    romaji: "ke",
    pronunciation: "keh",
    category: "basic",
  },
  {
    id: "ko",
    character: "こ",
    romaji: "ko",
    pronunciation: "koh",
    category: "basic",
  },

  // s-row
  {
    id: "sa",
    character: "さ",
    romaji: "sa",
    pronunciation: "sah",
    category: "basic",
  },
  {
    id: "shi",
    character: "し",
    romaji: "shi",
    pronunciation: "shee",
    category: "basic",
  },
  {
    id: "su",
    character: "す",
    romaji: "su",
    pronunciation: "soo",
    category: "basic",
  },
  {
    id: "se",
    character: "せ",
    romaji: "se",
    pronunciation: "seh",
    category: "basic",
  },
  {
    id: "so",
    character: "そ",
    romaji: "so",
    pronunciation: "soh",
    category: "basic",
  },

  // t-row
  {
    id: "ta",
    character: "た",
    romaji: "ta",
    pronunciation: "tah",
    category: "basic",
  },
  {
    id: "chi",
    character: "ち",
    romaji: "chi",
    pronunciation: "chee",
    category: "basic",
  },
  {
    id: "tsu",
    character: "つ",
    romaji: "tsu",
    pronunciation: "tsoo",
    category: "basic",
  },
  {
    id: "te",
    character: "て",
    romaji: "te",
    pronunciation: "teh",
    category: "basic",
  },
  {
    id: "to",
    character: "と",
    romaji: "to",
    pronunciation: "toh",
    category: "basic",
  },

  // n-row
  {
    id: "na",
    character: "な",
    romaji: "na",
    pronunciation: "nah",
    category: "basic",
  },
  {
    id: "ni",
    character: "に",
    romaji: "ni",
    pronunciation: "nee",
    category: "basic",
  },
  {
    id: "nu",
    character: "ぬ",
    romaji: "nu",
    pronunciation: "noo",
    category: "basic",
  },
  {
    id: "ne",
    character: "ね",
    romaji: "ne",
    pronunciation: "neh",
    category: "basic",
  },
  {
    id: "no",
    character: "の",
    romaji: "no",
    pronunciation: "noh",
    category: "basic",
  },

  // h-row
  {
    id: "ha",
    character: "は",
    romaji: "ha",
    pronunciation: "hah",
    category: "basic",
  },
  {
    id: "hi",
    character: "ひ",
    romaji: "hi",
    pronunciation: "hee",
    category: "basic",
  },
  {
    id: "fu",
    character: "ふ",
    romaji: "fu",
    pronunciation: "foo",
    category: "basic",
  },
  {
    id: "he",
    character: "へ",
    romaji: "he",
    pronunciation: "heh",
    category: "basic",
  },
  {
    id: "ho",
    character: "ほ",
    romaji: "ho",
    pronunciation: "hoh",
    category: "basic",
  },

  // m-row
  {
    id: "ma",
    character: "ま",
    romaji: "ma",
    pronunciation: "mah",
    category: "basic",
  },
  {
    id: "mi",
    character: "み",
    romaji: "mi",
    pronunciation: "mee",
    category: "basic",
  },
  {
    id: "mu",
    character: "む",
    romaji: "mu",
    pronunciation: "moo",
    category: "basic",
  },
  {
    id: "me",
    character: "め",
    romaji: "me",
    pronunciation: "meh",
    category: "basic",
  },
  {
    id: "mo",
    character: "も",
    romaji: "mo",
    pronunciation: "moh",
    category: "basic",
  },

  // y-row
  {
    id: "ya",
    character: "や",
    romaji: "ya",
    pronunciation: "yah",
    category: "basic",
  },
  {
    id: "yu",
    character: "ゆ",
    romaji: "yu",
    pronunciation: "yoo",
    category: "basic",
  },
  {
    id: "yo",
    character: "よ",
    romaji: "yo",
    pronunciation: "yoh",
    category: "basic",
  },

  // r-row
  {
    id: "ra",
    character: "ら",
    romaji: "ra",
    pronunciation: "rah",
    category: "basic",
  },
  {
    id: "ri",
    character: "り",
    romaji: "ri",
    pronunciation: "ree",
    category: "basic",
  },
  {
    id: "ru",
    character: "る",
    romaji: "ru",
    pronunciation: "roo",
    category: "basic",
  },
  {
    id: "re",
    character: "れ",
    romaji: "re",
    pronunciation: "reh",
    category: "basic",
  },
  {
    id: "ro",
    character: "ろ",
    romaji: "ro",
    pronunciation: "roh",
    category: "basic",
  },

  // w-row and n
  {
    id: "wa",
    character: "わ",
    romaji: "wa",
    pronunciation: "wah",
    category: "basic",
  },
  {
    id: "wo",
    character: "を",
    romaji: "wo",
    pronunciation: "woh",
    category: "basic",
  },
  {
    id: "n",
    character: "ん",
    romaji: "n",
    pronunciation: "n",
    category: "basic",
  },
];

export const getRandomCharacters = (
  count: number,
  exclude?: string[]
): HiraganaCharacter[] => {
  const availableCharacters = exclude
    ? hiraganaCharacters.filter((char) => !exclude.includes(char.id))
    : hiraganaCharacters;

  const shuffled = [...availableCharacters].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getRandomCharactersFromDifferentCategories = (
  count: number,
  exclude?: string[]
): HiraganaCharacter[] => {
  const availableCharacters = exclude
    ? hiraganaCharacters.filter((char) => !exclude.includes(char.id))
    : hiraganaCharacters;

  // Try to get characters from different rows/categories for better variety
  const categories = ["a", "k", "s", "t", "n", "h", "m", "y", "r", "w"];
  const selectedChars: HiraganaCharacter[] = [];

  // First, try to get one character from each category
  for (const category of categories) {
    if (selectedChars.length >= count) break;

    const categoryChars = availableCharacters.filter(
      (char) =>
        char.romaji.startsWith(category) && !selectedChars.includes(char)
    );

    if (categoryChars.length > 0) {
      const randomChar =
        categoryChars[Math.floor(Math.random() * categoryChars.length)];
      selectedChars.push(randomChar);
    }
  }

  // Fill remaining slots with random characters
  while (
    selectedChars.length < count &&
    selectedChars.length < availableCharacters.length
  ) {
    const remainingChars = availableCharacters.filter(
      (char) => !selectedChars.includes(char)
    );
    if (remainingChars.length === 0) break;

    const randomChar =
      remainingChars[Math.floor(Math.random() * remainingChars.length)];
    selectedChars.push(randomChar);
  }

  return selectedChars.slice(0, count);
};

export const getCharacterById = (id: string): HiraganaCharacter | undefined => {
  return hiraganaCharacters.find((char) => char.id === id);
};
