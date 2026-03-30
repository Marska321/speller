// @ts-nocheck
const wordData = require("../public/afrikaans_words.json");
const dictionary = require("../public/afrikaans_dictionary.json");
const fs = require("fs");
const path = require("path");

const DIACRITIC_PATTERN = /[^\u0000-\u007f]/;
const MIN_POOL_SIZE_WARNING = 30;

function validateAfrikaans() {
  const strictMode = process.argv.includes("--strict");
  const masterDict = new Set(dictionary.af_dictionary.map((word) => word.toLowerCase()));
  const seenWords = new Map();
  const diacriticWords = [];
  const warningsList = [];
  const errorsList = [];
  let errors = 0;
  let warnings = 0;

  console.log("--- Starting Afrikaans Word Validation ---");

  for (const [grade, tracks] of Object.entries(wordData.af)) {
    for (const [difficulty, words] of Object.entries(tracks)) {
      if (words.length < MIN_POOL_SIZE_WARNING) {
        const message = `Warning: ${grade} (${difficulty}) only has ${words.length} words. Consider expanding this pool for archive longevity.`;
        console.warn(message);
        warningsList.push({
          type: "pool-size",
          grade,
          difficulty,
          count: words.length,
          message,
        });
        warnings += 1;
      }

      words.forEach((word) => {
        const normalizedWord = word.toLowerCase();
        const location = `${grade} (${difficulty})`;

        if (!masterDict.has(normalizedWord)) {
          const message = `Error: "${word}" in ${grade} (${difficulty}) is missing from the dictionary!`;
          console.error(message);
          errorsList.push({
            type: "missing-dictionary-word",
            grade,
            difficulty,
            word,
            message,
          });
          errors += 1;
        }

        const expectedLength = difficulty === "easy" ? 4 : difficulty === "medium" ? 5 : 6;
        if (word.length !== expectedLength) {
          const message = `Length Error: "${word}" is ${word.length} letters, but should be ${expectedLength}.`;
          console.error(message);
          errorsList.push({
            type: "length-mismatch",
            grade,
            difficulty,
            word,
            expectedLength,
            actualLength: word.length,
            message,
          });
          errors += 1;
        }

        if (seenWords.has(normalizedWord)) {
          const message = `Duplicate Error: "${word}" appears in both ${seenWords.get(normalizedWord)} and ${location}.`;
          console.error(message);
          errorsList.push({
            type: "duplicate-word",
            word,
            firstLocation: seenWords.get(normalizedWord),
            secondLocation: location,
            message,
          });
          errors += 1;
        } else {
          seenWords.set(normalizedWord, location);
        }

        if (DIACRITIC_PATTERN.test(word)) {
          diacriticWords.push({ word, location });
        }
      });
    }
  }

  if (diacriticWords.length > 0) {
    console.warn("--- Diacritic Report ---");
    diacriticWords.forEach(({ word, location }) => {
      const message = `Diacritic word detected: "${word}" in ${location}.`;
      console.warn(message);
      warningsList.push({
        type: "diacritic-word",
        word,
        location,
        message,
      });
    });
    warnings += diacriticWords.length;
  }

  const report = {
    ok: errors === 0 && (!strictMode || warnings === 0),
    strictMode,
    summary: {
      errors,
      warnings,
      totalDictionaryWords: masterDict.size,
      totalPuzzleWords: Array.from(seenWords.keys()).length,
    },
    warnings: warningsList,
    errors: errorsList,
  };
  const reportPath = path.join(__dirname, "afrikaans_validation_report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Report written to ${reportPath}`);

  if (errors === 0) {
    console.log("All Afrikaans words are valid and present in the dictionary!");
    if (warnings > 0) {
      console.log(`Validation completed with ${warnings} warning(s).`);
    }
    if (strictMode && warnings > 0) {
      console.log("Strict validation failed because warnings are treated as failures.");
      process.exitCode = 1;
    }
    return;
  }

  console.log(`Validation failed with ${errors} errors.`);
  process.exitCode = 1;
}

validateAfrikaans();
