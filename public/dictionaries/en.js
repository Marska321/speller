// @ts-nocheck
/* global validWords */

const englishDictionary =
  typeof module !== "undefined" ? new Set(require("../dictionary").validWords) : new Set(validWords);
const curatedEnglishWordSource = typeof module !== "undefined" ? require("../english_words.json") : window.ENGLISH_WORDS_JSON || null;

const britishPreferredSpellings = {
  COLOR: "COLOUR",
  FLAVOR: "FLAVOUR",
  CENTER: "CENTRE",
  AIRPLANE: "AEROPLANE",
  THEATER: "THEATRE",
  ORGANIZED: "ORGANISED",
};

const southAfricanEnglishWords = [
  "ROBOT",
  "BRAAI",
  "BAKKIE",
  "SARMIE",
  "VELD",
  "KOPJE",
  "TAKKIES",
  "LEKKER",
  "MENSE",
  "TATTA",
];

const britishEnglishWords = [
  "CHEQUE",
  "PROGRAMME",
  "NEIGHBOUR",
  "DEFENCE",
  "OFFENCE",
  "LICENCE",
];

Object.entries(britishPreferredSpellings).forEach(([northAmerican, british]) => {
  englishDictionary.delete(northAmerican);
  englishDictionary.add(british);
});

southAfricanEnglishWords.forEach((word) => {
  englishDictionary.add(word);
});

britishEnglishWords.forEach((word) => {
  englishDictionary.add(word);
});

if (curatedEnglishWordSource && curatedEnglishWordSource.en_za) {
  ["grade2", "grade3", "grade4"].forEach((grade) => {
    ["easy", "medium", "hard"].forEach((track) => {
      (curatedEnglishWordSource.en_za[grade][track] || []).forEach((word) => {
        englishDictionary.add(word.toUpperCase());
      });
    });
  });
}

if (typeof window !== "undefined") {
  window.languageDictionaries = window.languageDictionaries || {};
  window.languageDictionaries.en = englishDictionary;
}

if (typeof module !== "undefined") {
  module.exports = {
    englishDictionary,
  };
}
