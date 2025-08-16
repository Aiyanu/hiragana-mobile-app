import type { Character, HiraganaCharacter } from "../types";

export const katakanaCharacters: Character[] = [
  // Basic Katakana (a-row)
  {
    id: "kata_a",
    character: "ア",
    romaji: "a",
    pronunciation: "ah",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_i",
    character: "イ",
    romaji: "i",
    pronunciation: "ee",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_u",
    character: "ウ",
    romaji: "u",
    pronunciation: "oo",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_e",
    character: "エ",
    romaji: "e",
    pronunciation: "eh",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_o",
    character: "オ",
    romaji: "o",
    pronunciation: "oh",
    category: "basic",
    type: "katakana",
  },

  // k-row
  {
    id: "kata_ka",
    character: "カ",
    romaji: "ka",
    pronunciation: "kah",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_ki",
    character: "キ",
    romaji: "ki",
    pronunciation: "kee",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_ku",
    character: "ク",
    romaji: "ku",
    pronunciation: "koo",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_ke",
    character: "ケ",
    romaji: "ke",
    pronunciation: "keh",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_ko",
    character: "コ",
    romaji: "ko",
    pronunciation: "koh",
    category: "basic",
    type: "katakana",
  },

  // s-row
  {
    id: "kata_sa",
    character: "サ",
    romaji: "sa",
    pronunciation: "sah",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_shi",
    character: "シ",
    romaji: "shi",
    pronunciation: "shee",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_su",
    character: "ス",
    romaji: "su",
    pronunciation: "soo",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_se",
    character: "セ",
    romaji: "se",
    pronunciation: "seh",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_so",
    character: "ソ",
    romaji: "so",
    pronunciation: "soh",
    category: "basic",
    type: "katakana",
  },

  // t-row
  {
    id: "kata_ta",
    character: "タ",
    romaji: "ta",
    pronunciation: "tah",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_chi",
    character: "チ",
    romaji: "chi",
    pronunciation: "chee",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_tsu",
    character: "ツ",
    romaji: "tsu",
    pronunciation: "tsoo",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_te",
    character: "テ",
    romaji: "te",
    pronunciation: "teh",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_to",
    character: "ト",
    romaji: "to",
    pronunciation: "toh",
    category: "basic",
    type: "katakana",
  },

  // n-row
  {
    id: "kata_na",
    character: "ナ",
    romaji: "na",
    pronunciation: "nah",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_ni",
    character: "ニ",
    romaji: "ni",
    pronunciation: "nee",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_nu",
    character: "ヌ",
    romaji: "nu",
    pronunciation: "noo",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_ne",
    character: "ネ",
    romaji: "ne",
    pronunciation: "neh",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_no",
    character: "ノ",
    romaji: "no",
    pronunciation: "noh",
    category: "basic",
    type: "katakana",
  },

  // h-row
  {
    id: "kata_ha",
    character: "ハ",
    romaji: "ha",
    pronunciation: "hah",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_hi",
    character: "ヒ",
    romaji: "hi",
    pronunciation: "hee",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_fu",
    character: "フ",
    romaji: "fu",
    pronunciation: "foo",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_he",
    character: "ヘ",
    romaji: "he",
    pronunciation: "heh",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_ho",
    character: "ホ",
    romaji: "ho",
    pronunciation: "hoh",
    category: "basic",
    type: "katakana",
  },

  // m-row
  {
    id: "kata_ma",
    character: "マ",
    romaji: "ma",
    pronunciation: "mah",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_mi",
    character: "ミ",
    romaji: "mi",
    pronunciation: "mee",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_mu",
    character: "ム",
    romaji: "mu",
    pronunciation: "moo",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_me",
    character: "メ",
    romaji: "me",
    pronunciation: "meh",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_mo",
    character: "モ",
    romaji: "mo",
    pronunciation: "moh",
    category: "basic",
    type: "katakana",
  },

  // y-row
  {
    id: "kata_ya",
    character: "ヤ",
    romaji: "ya",
    pronunciation: "yah",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_yu",
    character: "ユ",
    romaji: "yu",
    pronunciation: "yoo",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_yo",
    character: "ヨ",
    romaji: "yo",
    pronunciation: "yoh",
    category: "basic",
    type: "katakana",
  },

  // r-row
  {
    id: "kata_ra",
    character: "ラ",
    romaji: "ra",
    pronunciation: "rah",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_ri",
    character: "リ",
    romaji: "ri",
    pronunciation: "ree",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_ru",
    character: "ル",
    romaji: "ru",
    pronunciation: "roo",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_re",
    character: "レ",
    romaji: "re",
    pronunciation: "reh",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_ro",
    character: "ロ",
    romaji: "ro",
    pronunciation: "roh",
    category: "basic",
    type: "katakana",
  },

  // w-row and n
  {
    id: "kata_wa",
    character: "ワ",
    romaji: "wa",
    pronunciation: "wah",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_wo",
    character: "ヲ",
    romaji: "wo",
    pronunciation: "woh",
    category: "basic",
    type: "katakana",
  },
  {
    id: "kata_n",
    character: "ン",
    romaji: "n",
    pronunciation: "n",
    category: "basic",
    type: "katakana",
  },
];

export const kanjiCharacters: Character[] = [
  // Numbers
  {
    id: "kanji_one",
    character: "一",
    romaji: "ichi",
    pronunciation: "ee-chee",
    meaning: "one",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_two",
    character: "二",
    romaji: "ni",
    pronunciation: "nee",
    meaning: "two",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_three",
    character: "三",
    romaji: "san",
    pronunciation: "sahn",
    meaning: "three",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_four",
    character: "四",
    romaji: "shi/yon",
    pronunciation: "shee/yohn",
    meaning: "four",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_five",
    character: "五",
    romaji: "go",
    pronunciation: "goh",
    meaning: "five",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_six",
    character: "六",
    romaji: "roku",
    pronunciation: "roh-koo",
    meaning: "six",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_seven",
    character: "七",
    romaji: "shichi/nana",
    pronunciation: "shee-chee/nah-nah",
    meaning: "seven",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_eight",
    character: "八",
    romaji: "hachi",
    pronunciation: "hah-chee",
    meaning: "eight",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_nine",
    character: "九",
    romaji: "kyuu",
    pronunciation: "kyoo",
    meaning: "nine",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_ten",
    character: "十",
    romaji: "juu",
    pronunciation: "joo",
    meaning: "ten",
    category: "basic",
    type: "kanji",
  },

  // Basic concepts
  {
    id: "kanji_person",
    character: "人",
    romaji: "hito/jin",
    pronunciation: "hee-toh/jeen",
    meaning: "person",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_day",
    character: "日",
    romaji: "hi/nichi",
    pronunciation: "hee/nee-chee",
    meaning: "day/sun",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_month",
    character: "月",
    romaji: "tsuki/getsu",
    pronunciation: "tsoo-kee/get-soo",
    meaning: "month/moon",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_fire",
    character: "火",
    romaji: "hi/ka",
    pronunciation: "hee/kah",
    meaning: "fire",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_water",
    character: "水",
    romaji: "mizu/sui",
    pronunciation: "mee-zoo/soo-ee",
    meaning: "water",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_tree",
    character: "木",
    romaji: "ki/moku",
    pronunciation: "kee/moh-koo",
    meaning: "tree/wood",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_gold",
    character: "金",
    romaji: "kane/kin",
    pronunciation: "kah-neh/keen",
    meaning: "gold/money",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_earth",
    character: "土",
    romaji: "tsuchi/do",
    pronunciation: "tsoo-chee/doh",
    meaning: "earth/soil",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_big",
    character: "大",
    romaji: "ookii/dai",
    pronunciation: "oh-kee/dah-ee",
    meaning: "big",
    category: "basic",
    type: "kanji",
  },
  {
    id: "kanji_small",
    character: "小",
    romaji: "chiisai/shou",
    pronunciation: "chee-sah-ee/shoh",
    meaning: "small",
    category: "basic",
    type: "kanji",
  },
];

export const hiraganaCharacters: HiraganaCharacter[] = [
  // Basic Hiragana (a-row)
  {
    id: "a",
    character: "あ",
    romaji: "a",
    pronunciation: "ah",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "i",
    character: "い",
    romaji: "i",
    pronunciation: "ee",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "u",
    character: "う",
    romaji: "u",
    pronunciation: "oo",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "e",
    character: "え",
    romaji: "e",
    pronunciation: "eh",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "o",
    character: "お",
    romaji: "o",
    pronunciation: "oh",
    category: "basic",
    type: "hiragana",
  },

  // k-row
  {
    id: "ka",
    character: "か",
    romaji: "ka",
    pronunciation: "kah",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "ki",
    character: "き",
    romaji: "ki",
    pronunciation: "kee",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "ku",
    character: "く",
    romaji: "ku",
    pronunciation: "koo",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "ke",
    character: "け",
    romaji: "ke",
    pronunciation: "keh",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "ko",
    character: "こ",
    romaji: "ko",
    pronunciation: "koh",
    category: "basic",
    type: "hiragana",
  },

  // s-row
  {
    id: "sa",
    character: "さ",
    romaji: "sa",
    pronunciation: "sah",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "shi",
    character: "し",
    romaji: "shi",
    pronunciation: "shee",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "su",
    character: "す",
    romaji: "su",
    pronunciation: "soo",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "se",
    character: "せ",
    romaji: "se",
    pronunciation: "seh",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "so",
    character: "そ",
    romaji: "so",
    pronunciation: "soh",
    category: "basic",
    type: "hiragana",
  },

  // t-row
  {
    id: "ta",
    character: "た",
    romaji: "ta",
    pronunciation: "tah",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "chi",
    character: "ち",
    romaji: "chi",
    pronunciation: "chee",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "tsu",
    character: "つ",
    romaji: "tsu",
    pronunciation: "tsoo",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "te",
    character: "て",
    romaji: "te",
    pronunciation: "teh",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "to",
    character: "と",
    romaji: "to",
    pronunciation: "toh",
    category: "basic",
    type: "hiragana",
  },

  // n-row
  {
    id: "na",
    character: "な",
    romaji: "na",
    pronunciation: "nah",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "ni",
    character: "に",
    romaji: "ni",
    pronunciation: "nee",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "nu",
    character: "ぬ",
    romaji: "nu",
    pronunciation: "noo",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "ne",
    character: "ね",
    romaji: "ne",
    pronunciation: "neh",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "no",
    character: "の",
    romaji: "no",
    pronunciation: "noh",
    category: "basic",
    type: "hiragana",
  },

  // h-row
  {
    id: "ha",
    character: "は",
    romaji: "ha",
    pronunciation: "hah",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "hi",
    character: "ひ",
    romaji: "hi",
    pronunciation: "hee",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "fu",
    character: "ふ",
    romaji: "fu",
    pronunciation: "foo",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "he",
    character: "へ",
    romaji: "he",
    pronunciation: "heh",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "ho",
    character: "ほ",
    romaji: "ho",
    pronunciation: "hoh",
    category: "basic",
    type: "hiragana",
  },

  // m-row
  {
    id: "ma",
    character: "ま",
    romaji: "ma",
    pronunciation: "mah",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "mi",
    character: "み",
    romaji: "mi",
    pronunciation: "mee",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "mu",
    character: "む",
    romaji: "mu",
    pronunciation: "moo",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "me",
    character: "め",
    romaji: "me",
    pronunciation: "meh",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "mo",
    character: "も",
    romaji: "mo",
    pronunciation: "moh",
    category: "basic",
    type: "hiragana",
  },

  // y-row
  {
    id: "ya",
    character: "や",
    romaji: "ya",
    pronunciation: "yah",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "yu",
    character: "ゆ",
    romaji: "yu",
    pronunciation: "yoo",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "yo",
    character: "よ",
    romaji: "yo",
    pronunciation: "yoh",
    category: "basic",
    type: "hiragana",
  },

  // r-row
  {
    id: "ra",
    character: "ら",
    romaji: "ra",
    pronunciation: "rah",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "ri",
    character: "り",
    romaji: "ri",
    pronunciation: "ree",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "ru",
    character: "る",
    romaji: "ru",
    pronunciation: "roo",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "re",
    character: "れ",
    romaji: "re",
    pronunciation: "reh",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "ro",
    character: "ろ",
    romaji: "ro",
    pronunciation: "roh",
    category: "basic",
    type: "hiragana",
  },

  // w-row and n
  {
    id: "wa",
    character: "わ",
    romaji: "wa",
    pronunciation: "wah",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "wo",
    character: "を",
    romaji: "wo",
    pronunciation: "woh",
    category: "basic",
    type: "hiragana",
  },
  {
    id: "n",
    character: "ん",
    romaji: "n",
    pronunciation: "n",
    category: "basic",
    type: "hiragana",
  },
];

export const allCharacters: Character[] = [
  ...hiraganaCharacters,
  ...katakanaCharacters,
  ...kanjiCharacters,
];

export const getRandomCharacters = (
  count: number,
  exclude?: string[],
  types?: string[]
): Character[] => {
  let availableCharacters = allCharacters;

  if (types && types.length > 0) {
    availableCharacters = allCharacters.filter((char) =>
      types.includes(char.type)
    );
  }

  if (exclude) {
    availableCharacters = availableCharacters.filter(
      (char) => !exclude.includes(char.id)
    );
  }

  const shuffled = [...availableCharacters].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getRandomCharactersFromDifferentCategories = (
  count: number,
  exclude?: string[],
  types?: string[]
): Character[] => {
  let availableCharacters = allCharacters;

  if (types && types.length > 0) {
    availableCharacters = allCharacters.filter((char) =>
      types.includes(char.type)
    );
  }

  if (exclude) {
    availableCharacters = availableCharacters.filter(
      (char) => !exclude.includes(char.id)
    );
  }

  // Try to get characters from different rows/categories for better variety
  const categories = ["a", "k", "s", "t", "n", "h", "m", "y", "r", "w"];
  const selectedChars: Character[] = [];

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

export const getCharacterById = (id: string): Character | undefined => {
  return allCharacters.find((char) => char.id === id);
};

export const getCharactersByType = (type: string): Character[] => {
  return allCharacters.filter((char) => char.type === type);
};

// Re-export types for backward compatibility
export type { Character, HiraganaCharacter } from "../types";
