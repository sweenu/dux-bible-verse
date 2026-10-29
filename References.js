.pragma library

// Book ids follow the Bolls numbering (1 = Genesis ... 66 = Revelation).
var BOOKS = [
    { id: 1, name: "Genesis", chapters: 50, aliases: ["gen", "ge", "gn"] },
    { id: 2, name: "Exodus", chapters: 40, aliases: ["exod", "exo", "ex"] },
    { id: 3, name: "Leviticus", chapters: 27, aliases: ["lev", "le", "lv"] },
    { id: 4, name: "Numbers", chapters: 36, aliases: ["num", "nu", "nm", "nb"] },
    { id: 5, name: "Deuteronomy", chapters: 34, aliases: ["deut", "deu", "dt"] },
    { id: 6, name: "Joshua", chapters: 24, aliases: ["josh", "jos", "jsh"] },
    { id: 7, name: "Judges", chapters: 21, aliases: ["judg", "jdg", "jg", "jdgs"] },
    { id: 8, name: "Ruth", chapters: 4, aliases: ["rut", "ru", "rth"] },
    { id: 9, name: "1 Samuel", chapters: 31, aliases: ["1sam", "1sa", "1sm", "1s"] },
    { id: 10, name: "2 Samuel", chapters: 24, aliases: ["2sam", "2sa", "2sm", "2s"] },
    { id: 11, name: "1 Kings", chapters: 22, aliases: ["1kgs", "1ki", "1kin", "1k"] },
    { id: 12, name: "2 Kings", chapters: 25, aliases: ["2kgs", "2ki", "2kin", "2k"] },
    { id: 13, name: "1 Chronicles", chapters: 29, aliases: ["1chr", "1ch", "1chron"] },
    { id: 14, name: "2 Chronicles", chapters: 36, aliases: ["2chr", "2ch", "2chron"] },
    { id: 15, name: "Ezra", chapters: 10, aliases: ["ezr", "ezra"] },
    { id: 16, name: "Nehemiah", chapters: 13, aliases: ["neh", "ne"] },
    { id: 17, name: "Esther", chapters: 10, aliases: ["esth", "est", "es"] },
    { id: 18, name: "Job", chapters: 42, aliases: ["job", "jb"] },
    { id: 19, name: "Psalms", chapters: 150, aliases: ["ps", "psa", "psalm", "pss", "psm", "pslm"] },
    { id: 20, name: "Proverbs", chapters: 31, aliases: ["prov", "pro", "prv", "pr"] },
    { id: 21, name: "Ecclesiastes", chapters: 12, aliases: ["eccl", "ecc", "eccles", "ec", "qoh"] },
    { id: 22, name: "Song of Solomon", chapters: 8, aliases: ["song", "sos", "so", "songofsongs", "cant", "ss"] },
    { id: 23, name: "Isaiah", chapters: 66, aliases: ["isa", "is"] },
    { id: 24, name: "Jeremiah", chapters: 52, aliases: ["jer", "je", "jr"] },
    { id: 25, name: "Lamentations", chapters: 5, aliases: ["lam", "la"] },
    { id: 26, name: "Ezekiel", chapters: 48, aliases: ["ezek", "eze", "ezk"] },
    { id: 27, name: "Daniel", chapters: 12, aliases: ["dan", "da", "dn"] },
    { id: 28, name: "Hosea", chapters: 14, aliases: ["hos", "ho"] },
    { id: 29, name: "Joel", chapters: 3, aliases: ["joel", "jl"] },
    { id: 30, name: "Amos", chapters: 9, aliases: ["amos", "am"] },
    { id: 31, name: "Obadiah", chapters: 1, aliases: ["obad", "oba", "ob"] },
    { id: 32, name: "Jonah", chapters: 4, aliases: ["jonah", "jon", "jnh"] },
    { id: 33, name: "Micah", chapters: 7, aliases: ["mic", "mc"] },
    { id: 34, name: "Nahum", chapters: 3, aliases: ["nah", "na"] },
    { id: 35, name: "Habakkuk", chapters: 3, aliases: ["hab", "hb"] },
    { id: 36, name: "Zephaniah", chapters: 3, aliases: ["zeph", "zep", "zp"] },
    { id: 37, name: "Haggai", chapters: 2, aliases: ["hag", "hg"] },
    { id: 38, name: "Zechariah", chapters: 14, aliases: ["zech", "zec", "zc"] },
    { id: 39, name: "Malachi", chapters: 4, aliases: ["mal", "ml"] },
    { id: 40, name: "Matthew", chapters: 28, aliases: ["matt", "mat", "mt"] },
    { id: 41, name: "Mark", chapters: 16, aliases: ["mark", "mrk", "mar", "mk", "mr"] },
    { id: 42, name: "Luke", chapters: 24, aliases: ["luke", "luk", "lk"] },
    { id: 43, name: "John", chapters: 21, aliases: ["john", "joh", "jhn", "jn"] },
    { id: 44, name: "Acts", chapters: 28, aliases: ["acts", "act", "ac"] },
    { id: 45, name: "Romans", chapters: 16, aliases: ["rom", "ro", "rm"] },
    { id: 46, name: "1 Corinthians", chapters: 16, aliases: ["1cor", "1co"] },
    { id: 47, name: "2 Corinthians", chapters: 13, aliases: ["2cor", "2co"] },
    { id: 48, name: "Galatians", chapters: 6, aliases: ["gal", "ga"] },
    { id: 49, name: "Ephesians", chapters: 6, aliases: ["eph", "ephes"] },
    { id: 50, name: "Philippians", chapters: 4, aliases: ["phil", "php", "pp"] },
    { id: 51, name: "Colossians", chapters: 4, aliases: ["col", "co"] },
    { id: 52, name: "1 Thessalonians", chapters: 5, aliases: ["1thess", "1th", "1thes"] },
    { id: 53, name: "2 Thessalonians", chapters: 3, aliases: ["2thess", "2th", "2thes"] },
    { id: 54, name: "1 Timothy", chapters: 6, aliases: ["1tim", "1ti", "1tm"] },
    { id: 55, name: "2 Timothy", chapters: 4, aliases: ["2tim", "2ti", "2tm"] },
    { id: 56, name: "Titus", chapters: 3, aliases: ["titus", "tit", "ti"] },
    { id: 57, name: "Philemon", chapters: 1, aliases: ["philem", "phlm", "phm"] },
    { id: 58, name: "Hebrews", chapters: 13, aliases: ["heb"] },
    { id: 59, name: "James", chapters: 5, aliases: ["jas", "jam", "jm"] },
    { id: 60, name: "1 Peter", chapters: 5, aliases: ["1pet", "1pe", "1pt", "1p"] },
    { id: 61, name: "2 Peter", chapters: 3, aliases: ["2pet", "2pe", "2pt", "2p"] },
    { id: 62, name: "1 John", chapters: 5, aliases: ["1john", "1jn", "1jhn", "1jo", "1j"] },
    { id: 63, name: "2 John", chapters: 1, aliases: ["2john", "2jn", "2jhn", "2jo", "2j"] },
    { id: 64, name: "3 John", chapters: 1, aliases: ["3john", "3jn", "3jhn", "3jo", "3j"] },
    { id: 65, name: "Jude", chapters: 1, aliases: ["jude", "jud", "jd"] },
    { id: 66, name: "Revelation", chapters: 22, aliases: ["rev", "re", "rv", "revelations", "apoc"] }
];

var MAX_CHAPTERS = 10;

// Lowercases, drops accents, dots and spaces, and turns a leading roman
// numeral ("II Cor", "iii john") into a digit so "2cor" style aliases match.
function normalizeBookName(name) {
    let s = String(name).toLowerCase();
    if (typeof s.normalize === "function")
        s = s.normalize("NFD").replace(/[̀-ͯ]/g, "");
    s = s.replace(/^(iii|ii|i)(?=[\s.]+\S)/, m => String(m.length));
    return s.replace(/[\s.]+/g, "");
}

// extraBooks: optional [{bookid, name, chapters}] from /get-books/<translation>/,
// used to match and display book names in the translation's language.
function buildBookIndex(extraBooks) {
    const byId = {};
    const keys = [];
    for (let i = 0; i < BOOKS.length; i++) {
        const b = BOOKS[i];
        byId[b.id] = { id: b.id, name: b.name, chapters: b.chapters };
        keys.push({ key: normalizeBookName(b.name), id: b.id, exactOnly: false });
        for (let j = 0; j < b.aliases.length; j++)
            keys.push({ key: b.aliases[j], id: b.id, exactOnly: true });
    }
    if (Array.isArray(extraBooks)) {
        for (let i = 0; i < extraBooks.length; i++) {
            const b = extraBooks[i];
            if (!b || !b.bookid || !b.name)
                continue;
            byId[b.bookid] = { id: b.bookid, name: b.name, chapters: b.chapters || (byId[b.bookid] ? byId[b.bookid].chapters : 0) };
            keys.push({ key: normalizeBookName(b.name), id: b.bookid, exactOnly: false });
        }
    }
    return { byId: byId, keys: keys };
}

function findBook(index, rawName) {
    const key = normalizeBookName(rawName);
    if (!key)
        return null;
    for (let i = 0; i < index.keys.length; i++) {
        if (index.keys[i].key === key)
            return index.byId[index.keys[i].id];
    }
    // Prefix match on full names, in canonical order ("Phili" -> Philippians).
    if (key.replace(/^\d/, "").length < 2)
        return null;
    let best = null;
    for (let i = 0; i < index.keys.length; i++) {
        const k = index.keys[i];
        if (k.exactOnly || !k.key.startsWith(key))
            continue;
        if (!best || k.id < best)
            best = k.id;
    }
    return best ? index.byId[best] : null;
}

// Parses the part after the book name: "5", "5-7", "5:38", "5:38-42",
// "5:38-6:4", "3:16,18-20", "3:16; 4:1-3". Returns a list of
// {chapter, from, to} (to = 0 means until the end of the chapter) or null.
function parseSpec(spec) {
    const parts = spec.replace(/[–—]/g, "-").replace(/\s+/g, "").split(/[,;]/);
    const segments = [];
    let chapter = 0;
    let verseMode = false;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part)
            return null;
        let m = part.match(/^(\d+)[:.](\d+)(?:-(?:(\d+)[:.])?(\d+))?$/);
        if (m) {
            chapter = parseInt(m[1]);
            verseMode = true;
            const from = parseInt(m[2]);
            if (m[3]) {
                const endChapter = parseInt(m[3]);
                const endVerse = parseInt(m[4]);
                if (endChapter < chapter || (endChapter === chapter && endVerse < from))
                    return null;
                if (endChapter === chapter) {
                    segments.push({ chapter: chapter, from: from, to: endVerse });
                } else {
                    segments.push({ chapter: chapter, from: from, to: 0 });
                    for (let c = chapter + 1; c < endChapter; c++)
                        segments.push({ chapter: c, from: 1, to: 0 });
                    segments.push({ chapter: endChapter, from: 1, to: endVerse });
                }
                chapter = endChapter;
            } else {
                const to = m[4] ? parseInt(m[4]) : from;
                if (to < from)
                    return null;
                segments.push({ chapter: chapter, from: from, to: to });
            }
            continue;
        }
        m = part.match(/^(\d+)(?:-(\d+))?$/);
        if (!m)
            return null;
        const a = parseInt(m[1]);
        const b = m[2] ? parseInt(m[2]) : a;
        if (b < a)
            return null;
        if (verseMode) {
            // "3:16,18" - bare numbers after a verse continue the same chapter.
            segments.push({ chapter: chapter, from: a, to: b });
        } else {
            for (let c = a; c <= b; c++)
                segments.push({ chapter: c, from: 1, to: 0 });
        }
    }
    for (let i = 0; i < segments.length; i++) {
        if (segments[i].chapter < 1 || segments[i].from < 1)
            return null;
    }
    return segments.length > 0 ? segments : null;
}

function formatSpec(spec) {
    return spec.replace(/[–—]/g, "-").replace(/\s+/g, "").replace(/(\d)\.(\d)/g, "$1:$2").replace(/;/g, "; ");
}

// Returns null when the query does not look like a reference at all, or
// {book, segments, chapters, spec, translation, error}.
// resolveTranslation(word) returns the translation code a trailing word
// stands for ("esv" -> "ESV"), or "" when it is not one.
function parseReference(query, index, resolveTranslation) {
    let q = String(query || "").trim();
    if (!q)
        return null;

    let translation = "";
    const tail = q.match(/^(.*\d)\s+([A-Za-z][A-Za-z0-9]*)$/);
    if (tail) {
        translation = resolveTranslation ? resolveTranslation(tail[2]) : "";
        if (!translation)
            return null;
        q = tail[1];
    }

    const m = q.match(/^((?:[1-3]|iii|ii|i)?\s*\.?\s*[^\d\s][^\d]*?)\s*\.?\s*(\d[\d\s:.,;\-–—]*)$/i);
    if (!m)
        return null;
    const book = findBook(index, m[1]);
    if (!book)
        return null;

    const spec = m[2].trim();
    const result = {
        book: book,
        segments: null,
        chapters: [],
        spec: formatSpec(spec),
        translation: translation,
        error: ""
    };

    const segments = parseSpec(spec);
    if (!segments) {
        result.error = "invalid";
        return result;
    }
    const chapters = [];
    for (let i = 0; i < segments.length; i++) {
        const c = segments[i].chapter;
        if (book.chapters && c > book.chapters) {
            result.error = "chapter";
            return result;
        }
        if (chapters.indexOf(c) === -1)
            chapters.push(c);
    }
    if (chapters.length > MAX_CHAPTERS) {
        result.error = "tooLong";
        return result;
    }
    result.segments = segments;
    result.chapters = chapters;
    return result;
}

function cleanVerseText(html) {
    return String(html || "")
        .replace(/<S>[^<]*<\/S>/gi, "")
        .replace(/<sup>[\s\S]*?<\/sup>/gi, "")
        .replace(/<b>[^<]*<\/b>\s*<br\s*\/?>/gi, "")
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&quot;/g, "\"")
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();
}

// chapterVerses: {chapterNumber: [{verse, text}]} as returned by /get-text/.
// Returns the selected verses in order: [{chapter, verse, text}].
function selectVerses(segments, chapterVerses) {
    const out = [];
    const seen = {};
    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        const verses = chapterVerses[seg.chapter] || [];
        for (let j = 0; j < verses.length; j++) {
            const v = verses[j];
            if (v.verse < seg.from || (seg.to && v.verse > seg.to))
                continue;
            const key = seg.chapter + ":" + v.verse;
            if (seen[key])
                continue;
            seen[key] = true;
            const text = cleanVerseText(v.text);
            if (text)
                out.push({ chapter: seg.chapter, verse: v.verse, text: text });
        }
    }
    return out;
}

// options: {verseNumbers, versePerLine, referencePosition: "before"|"after"|"none"}
function formatPassage(verses, label, options) {
    const multiChapter = verses.length > 0 && verses[0].chapter !== verses[verses.length - 1].chapter;
    const pieces = [];
    let lastChapter = 0;
    for (let i = 0; i < verses.length; i++) {
        const v = verses[i];
        let number = "";
        if (options.verseNumbers)
            number = (multiChapter && v.chapter !== lastChapter ? v.chapter + ":" : "") + v.verse + " ";
        lastChapter = v.chapter;
        pieces.push(number + v.text);
    }
    const body = pieces.join(options.versePerLine ? "\n" : " ");
    switch (options.referencePosition) {
    case "after":
        return body + "\n— " + label;
    case "none":
        return body;
    default:
        return label + "\n" + body;
    }
}
