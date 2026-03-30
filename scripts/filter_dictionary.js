const fs = require('fs');
const path = require('path');
const afAnswers = require('../public/afrikaans_words.json');

// 1. Path to your downloaded Openwall file
const inputPath = path.join(__dirname, 'lower.lst'); 
const outputPath = path.join(__dirname, '../public/dictionaries/af.js');

// 2. Your South African Supplement (from our previous chat)
const saExtras = [
    "stoep", "kraal", "braai", "bakkie", "robot", "veld", "koppie", "kloof", "donga",
    "sarmie", "takkies", "boer", "mense", "tatta", "blits", "skop", "stoot", "trek",
    "kombuis", "venster", "heining", "skuur", "kaste", "waatlemoen", "lemoen", "vygie",
    "renoster", "olifant", "kameelperd", "springbok", "koedoe", "duiker", "vlermuis",
    "haas", "skilpad", "akkedis", "padda", "voël", "vlerk", "veer", "eier",
    "skooltas", "pouse", "juffrou", "meneer", "maatjie", "skryf", "teken", "verf",
    "gom", "skêr", "reën", "son", "wolke", "storm", "bliksem", "donder", "weer",
    "boek", "pen", "potlood", "bank", "stoel", "tafel", "bord", "kryt", "papiere",
    "hardloop", "staan", "sit", "lê", "slaap", "eet", "drink", "praat", "lag", "huil",
    "werk", "speel", "koop", "verkoop", "ry", "stap", "kyk", "luister", "voel",
    "lekker", "mooi", "lelik", "groot", "klein", "warm", "koue", "nuut", "oud", "vinnig",
    "stadig", "soet", "suur", "bitter", "skoon", "vuil", "swaar", "lig", "sterk", "swak"
];

try {
    console.log("Reading lower.lst...");
    const data = fs.readFileSync(inputPath, 'utf8');
    const allWords = data.split(/\r?\n/);

    const filtered = allWords.filter(word => {
        const w = word.trim().toLowerCase();
        
        // --- THE FILTER RULES ---
        // Rule A: Length must be between 3 and 7 letters
        const isRightLength = w.length >= 3 && w.length <= 7;
        
        // Rule B: Only allow Afrikaans alphabet (including accents)
        // This regex allows a-z plus ë, ê, ï, ô, û, á, é, í, ó, ú
        const isAfrikaans = /^[a-zëêïôûáéíóú]+$/.test(w);
        
        return isRightLength && isAfrikaans;
    });

    const allAnswers = [
        ...afAnswers.af.grade2.easy, ...afAnswers.af.grade2.medium, ...afAnswers.af.grade2.hard,
        ...afAnswers.af.grade3.easy, ...afAnswers.af.grade3.medium, ...afAnswers.af.grade3.hard,
        ...afAnswers.af.grade4.easy, ...afAnswers.af.grade4.medium, ...afAnswers.af.grade4.hard
    ];

    // 3. Merge with your SA Extras and answer lists, then remove duplicates
    const finalSet = new Set([...filtered, ...saExtras, ...allAnswers]);
    const finalArray = Array.from(finalSet).sort();

    // 4. Format as a browser-compatible Javascript file
    const dictionaryJson = JSON.stringify(finalArray, null, 2);
    const extrasJson = JSON.stringify(saExtras, null, 2);
    const fileContent = `// @ts-nocheck

const AF_DICTIONARY = ${dictionaryJson};

const AF_EXTRA_WORDS = ${extrasJson}.map((word) => word.toLowerCase());

function normalize(word) {
  return (word || "").toUpperCase();
}

function withoutDiacritics(word) {
  return normalize(word)
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "");
}

const mergedAfrikaansWords = [...new Set([...AF_DICTIONARY, ...AF_EXTRA_WORDS])];
const afrikaansDictionary = new Set(
  mergedAfrikaansWords.flatMap((word) => {
    const original = normalize(word);
    const plain = withoutDiacritics(word);
    return original === plain ? [original] : [original, plain];
  })
);

if (typeof window !== "undefined") {
  window.AF_DICTIONARY = mergedAfrikaansWords;
  window.AF_EXTRA_WORDS = AF_EXTRA_WORDS;
  window.languageDictionaries = window.languageDictionaries || {};
  window.languageDictionaries.af = afrikaansDictionary;
}

if (typeof module !== "undefined") {
  module.exports = {
    AF_DICTIONARY: mergedAfrikaansWords,
    AF_EXTRA_WORDS,
    afrikaansDictionary,
  };
}
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`✅ Success! Dictionary filtered from ${allWords.length} down to ${finalArray.length} words.`);
    console.log(`📍 Saved to: ${outputPath}`);

} catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error processing file:", message);
}
