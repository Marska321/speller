const { englishWords } = require("../public/words/en");
const { afrikaansWords } = require("../public/words/af");
const { englishDictionary } = require("../public/dictionaries/en");
const { afrikaansDictionary } = require("../public/dictionaries/af");
const { translations } = require("../public/translations");

describe("localization wrappers", () => {
  test.each([
    ["grade2", 4],
    ["grade3", 5],
    ["grade4", 6],
  ])("english %s future words keep expected length", (grade, length) => {
    englishWords.future[grade].forEach((word) => {
      expect(word).toHaveLength(length);
    });
  });

  test.each([
    ["grade2", 4],
    ["grade3", 5],
    ["grade4", 6],
  ])("afrikaans %s future words keep expected length", (grade, length) => {
    afrikaansWords.future[grade].forEach((word) => {
      expect(word).toHaveLength(length);
    });
  });

  it("english dictionary contains the english puzzle words", () => {
    const allWords = []
      .concat(englishWords.words.grade2)
      .concat(englishWords.words.grade3)
      .concat(englishWords.words.grade4);

    expect(allWords.every((word) => englishDictionary.has(word))).toBe(true);
  });

  it("afrikaans dictionary contains the afrikaans puzzle words", () => {
    const allWords = []
      .concat(afrikaansWords.words.grade2)
      .concat(afrikaansWords.words.grade3)
      .concat(afrikaansWords.words.grade4);

    expect(allWords.every((word) => afrikaansDictionary.has(word))).toBe(true);
  });

  it("has UI translations for both languages", () => {
    ["en", "af"].forEach((language) => {
      expect(translations[language].labelLanguage).toBeTruthy();
      expect(translations[language].grade2).toBeTruthy();
      expect(translations[language].settingsTitle).toBeTruthy();
      expect(translations[language].share).toBeTruthy();
    });
  });

  it("prefers british english spellings in the english dictionary", () => {
    expect(englishDictionary.has("COLOUR")).toBe(true);
    expect(englishDictionary.has("FLAVOUR")).toBe(true);
    expect(englishDictionary.has("CENTRE")).toBe(true);
    expect(englishDictionary.has("COLOR")).toBe(false);
    expect(englishDictionary.has("FLAVOR")).toBe(false);
    expect(englishDictionary.has("CENTER")).toBe(false);
    expect(englishDictionary.has("TAKKIES")).toBe(true);
    expect(englishDictionary.has("TATTA")).toBe(true);
  });
});
