// @ts-nocheck
/* global historicalWords, futureWords, words */

const puzzlesData =
  typeof module !== "undefined"
    ? require("../puzzles")
    : { historicalWords, futureWords, words };
const englishSourceData =
  typeof module !== "undefined" ? require("../english_words.json") : window.ENGLISH_WORDS_JSON || null;

const britishSpellingMap = {
  CENTER: "CENTRE",
  COLOR: "COLOUR",
  FLAVOR: "FLAVOUR",
  AIRPLANE: "AEROPLANE",
  THEATER: "THEATRE",
  ORGANIZED: "ORGANISED",
};

function withBritishSpellings(wordList) {
  return wordList.map((word) => britishSpellingMap[word] || word);
}

function normalizeWordList(wordList, expectedLength) {
  return wordList
    .map((word) => (word || "").toUpperCase())
    .map((word) => britishSpellingMap[word] || word)
    .filter((word) => word.length === expectedLength);
}

function dedupeWords(wordList) {
  return [...new Set(wordList)];
}

function getAllSourceWords() {
  return ["grade2", "grade3", "grade4"].flatMap((grade) =>
    ["easy", "medium", "hard"].flatMap((track) => {
      const expectedLength = track === "easy" ? 4 : track === "medium" ? 5 : 6;
      return normalizeWordList(englishSource[grade][track], expectedLength);
    })
  );
}

const englishSource = englishSourceData
  ? englishSourceData.en_za
  : {
      grade2: { easy: [], medium: [], hard: [] },
      grade3: { easy: [], medium: [], hard: [] },
      grade4: { easy: [], medium: [], hard: [] },
    };

const curatedActiveWords = {
  grade2: normalizeWordList(englishSource.grade2.easy, 4),
  grade3: normalizeWordList(englishSource.grade3.medium, 5),
  grade4: normalizeWordList(englishSource.grade4.hard, 6),
};

function buildActiveTrack(curatedWords, fallbackWords) {
  const normalizedFallback = withBritishSpellings(fallbackWords);
  return dedupeWords(curatedWords.concat(normalizedFallback));
}

const englishWords = {
  source: {
    grade2: {
      easy: normalizeWordList(englishSource.grade2.easy, 4),
      medium: normalizeWordList(englishSource.grade2.medium, 5),
      hard: normalizeWordList(englishSource.grade2.hard, 6),
    },
    grade3: {
      easy: normalizeWordList(englishSource.grade3.easy, 4),
      medium: normalizeWordList(englishSource.grade3.medium, 5),
      hard: normalizeWordList(englishSource.grade3.hard, 6),
    },
    grade4: {
      easy: normalizeWordList(englishSource.grade4.easy, 4),
      medium: normalizeWordList(englishSource.grade4.medium, 5),
      hard: normalizeWordList(englishSource.grade4.hard, 6),
    },
  },
  historical: {
    grade2: buildActiveTrack(curatedActiveWords.grade2, puzzlesData.historicalWords.easy),
    grade3: buildActiveTrack(curatedActiveWords.grade3, puzzlesData.historicalWords.medium),
    grade4: buildActiveTrack(curatedActiveWords.grade4, puzzlesData.historicalWords.hard),
  },
  future: {
    grade2: buildActiveTrack(curatedActiveWords.grade2, puzzlesData.futureWords.easy),
    grade3: buildActiveTrack(curatedActiveWords.grade3, puzzlesData.futureWords.medium),
    grade4: buildActiveTrack(curatedActiveWords.grade4, puzzlesData.futureWords.hard),
  },
  words: {
    grade2: buildActiveTrack(curatedActiveWords.grade2, puzzlesData.words.easy),
    grade3: buildActiveTrack(curatedActiveWords.grade3, puzzlesData.words.medium),
    grade4: buildActiveTrack(curatedActiveWords.grade4, puzzlesData.words.hard),
  },
};

if (typeof window !== "undefined") {
  window.languageWords = window.languageWords || {};
  window.languageWords.en = englishWords;
  window.curatedEnglishWords = getAllSourceWords();
}

if (typeof module !== "undefined") {
  module.exports = {
    englishWords,
    getAllSourceWords,
  };
}
