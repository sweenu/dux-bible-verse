// Run with: node tests/references.test.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const source = fs.readFileSync(path.join(__dirname, "..", "References.js"), "utf8").replace(/^\.pragma library\s*/, "");
const R = {};
vm.createContext(R);
vm.runInContext(source + "\nthis.exports = { BOOKS, buildBookIndex, findBook, parseSpec, parseReference, cleanVerseText, selectVerses, formatPassage };", R);
const {
    BOOKS, buildBookIndex, findBook, parseSpec, parseReference, cleanVerseText, selectVerses, formatPassage
} = R.exports;

const codes = ["KJV", "ESV", "NKJV", "CSB17", "FRLSG", "WLCa"];
const resolve = w => codes.find(c => c.toLowerCase() === w.toLowerCase()) || "";
const index = buildBookIndex();
let passed = 0;

function test(name, fn) {
    fn();
    passed++;
}

const plain = x => JSON.parse(JSON.stringify(x));

test("book table", () => {
    assert.strictEqual(BOOKS.length, 66);
    BOOKS.forEach((b, i) => assert.strictEqual(b.id, i + 1));
});

test("book lookup", () => {
    const cases = {
        "Mat": 40, "Matt": 40, "mt": 40, "Matthew": 40, "Gen": 1, "Ex": 2, "Ps": 19, "Psalm": 19,
        "1 Cor": 46, "1Cor": 46, "I Cor": 46, "II Corinthians": 47, "1 Co": 46, "Phil": 50, "Phm": 57,
        "Philem": 57, "Jud": 65, "Judg": 7, "Jn": 43, "1 Jn": 62, "III John": 64, "Song of Solomon": 22,
        "Song of Songs": 22, "Rev": 66, "Revelation": 66, "Isa": 23, "Is": 23, "1 Sam": 9, "Jo": 6,
        "Phili": 50, "Eccl.": 21, "Jas": 59, "Heb": 58, "Joh": 43
    };
    for (const name in cases)
        assert.strictEqual(findBook(index, name)?.id, cases[name], name);
    assert.strictEqual(findBook(index, "J"), null);
    assert.strictEqual(findBook(index, "Firefox"), null);
});

test("localized book names", () => {
    const fr = buildBookIndex([{ bookid: 40, name: "Matthieu", chapters: 28 }, { bookid: 23, name: "Ésaïe", chapters: 66 }]);
    assert.strictEqual(findBook(fr, "Matthieu").name, "Matthieu");
    assert.strictEqual(findBook(fr, "esaie").id, 23);
    assert.strictEqual(findBook(fr, "Mat").name, "Matthieu");
});

test("spec parsing", () => {
    assert.deepStrictEqual(plain(parseSpec("5:38-42")), [{ chapter: 5, from: 38, to: 42 }]);
    assert.deepStrictEqual(plain(parseSpec("5:38")), [{ chapter: 5, from: 38, to: 38 }]);
    assert.deepStrictEqual(plain(parseSpec("5")), [{ chapter: 5, from: 1, to: 0 }]);
    assert.deepStrictEqual(plain(parseSpec("5-6")), [{ chapter: 5, from: 1, to: 0 }, { chapter: 6, from: 1, to: 0 }]);
    assert.deepStrictEqual(plain(parseSpec("5:38-7:2")), [
        { chapter: 5, from: 38, to: 0 }, { chapter: 6, from: 1, to: 0 }, { chapter: 7, from: 1, to: 2 }
    ]);
    assert.deepStrictEqual(plain(parseSpec("27:5-28:13")), [{ chapter: 27, from: 5, to: 0 }, { chapter: 28, from: 1, to: 13 }]);
    assert.deepStrictEqual(plain(parseSpec("27:5-28-13")), plain(parseSpec("27:5-28:13")));
    assert.deepStrictEqual(plain(parseSpec("3:16,18-20")), [{ chapter: 3, from: 16, to: 16 }, { chapter: 3, from: 18, to: 20 }]);
    assert.deepStrictEqual(plain(parseSpec("3:16; 4:1-3")), [{ chapter: 3, from: 16, to: 16 }, { chapter: 4, from: 1, to: 3 }]);
    assert.deepStrictEqual(plain(parseSpec("5.38–42")), [{ chapter: 5, from: 38, to: 42 }]);
    assert.strictEqual(parseSpec("5:42-38"), null);
    assert.strictEqual(parseSpec("5:"), null);
    assert.strictEqual(parseSpec("5:38-"), null);
    assert.strictEqual(parseSpec("0:1"), null);
});

test("reference parsing", () => {
    let r = parseReference("Mat 5:38-42", index, resolve);
    assert.strictEqual(r.book.id, 40);
    assert.strictEqual(r.spec, "5:38-42");
    assert.strictEqual(r.translation, "");
    assert.deepStrictEqual(plain(r.chapters), [5]);

    r = parseReference("1 Cor 13:4-7 esv", index, resolve);
    assert.strictEqual(r.book.id, 46);
    assert.strictEqual(r.translation, "ESV");

    r = parseReference("Matthew 27:5-28-13", index, resolve);
    assert.strictEqual(r.spec, "27:5-28:13");
    assert.deepStrictEqual(plain(r.chapters), [27, 28]);

    r = parseReference("Ps 23", index, resolve);
    assert.strictEqual(r.book.id, 19);
    assert.strictEqual(r.error, "");

    r = parseReference("Song of Solomon 2:1", index, resolve);
    assert.strictEqual(r.book.id, 22);

    assert.strictEqual(parseReference("Mat 29", index, resolve).error, "chapter");
    assert.strictEqual(parseReference("Ps 1-20", index, resolve).error, "tooLong");
    assert.strictEqual(parseReference("Mat 5:", index, resolve).error, "invalid");
    assert.strictEqual(parseReference("Mat 5:1 foo", index, resolve), null);
    assert.strictEqual(parseReference("Mat", index, resolve), null);
    assert.strictEqual(parseReference("firefox 3", index, resolve), null);
    assert.strictEqual(parseReference("", index, resolve), null);
});

test("verse text cleanup", () => {
    assert.strictEqual(cleanVerseText("For<S>1063</S> God<S>2316</S> so loved. <sup>again: or, from above</sup> Nicodemus"), "For God so loved. Nicodemus");
    assert.strictEqual(cleanVerseText("<b>You Must Be Born Again</b><br/>Now there was a man"), "Now there was a man");
    assert.strictEqual(cleanVerseText("Jésus lui répondit : <b>Amen, amen,</b> je te le dis"), "Jésus lui répondit : Amen, amen, je te le dis");
    assert.strictEqual(cleanVerseText("a &amp; b&nbsp; <i>c</i>"), "a & b c");
});

test("passage formatting", () => {
    const chapters = {
        5: [{ verse: 47, text: "Forty-seven." }, { verse: 48, text: "Forty-eight." }],
        6: [{ verse: 1, text: "One." }, { verse: 2, text: "Two." }]
    };
    const verses = selectVerses(parseSpec("5:48-6:1"), chapters);
    assert.strictEqual(verses.length, 2);
    assert.strictEqual(
        formatPassage(verses, "Matthew 5:48-6:1 (KJV)", { verseNumbers: true, versePerLine: true, referencePosition: "before" }),
        "Matthew 5:48-6:1 (KJV)\n5:48 Forty-eight.\n6:1 One.");
    assert.strictEqual(
        formatPassage(selectVerses(parseSpec("5:47-48"), chapters), "Matthew 5:47-48 (KJV)", { verseNumbers: false, versePerLine: false, referencePosition: "after" }),
        "Forty-seven. Forty-eight.\n— Matthew 5:47-48 (KJV)");
    assert.strictEqual(selectVerses(parseSpec("5:47,47"), chapters).length, 1);
});

console.log(passed + " tests passed");
