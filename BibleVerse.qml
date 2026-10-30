import QtQuick
import Quickshell
import qs.Common
import qs.Services
import "References.js" as Refs

QtObject {
    id: root

    property var pluginService: null
    readonly property string pluginId: "bibleVerse"
    readonly property string apiBase: "https://bolls.life"

    property string trigger: "bible"
    property bool noTrigger: false
    property string translation: "NET"
    property bool verseNumbers: false
    property string referencePosition: "before"

    // lowercase code -> {code, name}; filled from languages.json, the
    // fallback keeps common codes usable before (or without) that fetch.
    property var translations: ({})
    readonly property var fallbackTranslations: ["KJV", "NKJV", "ESV", "NASB", "BSB", "WEB", "YLT", "ASV", "RSV", "NLT", "CSB17", "LSB", "NET", "AMP", "MSG"]

    property var bookLists: ({})
    property var bookIndex: Refs.buildBookIndex([])

    property var chapterCache: ({})
    property var chapterWaiters: ({})
    property var requests: ({})
    property var passages: ({})
    property string pendingFetchKey: ""
    property string pendingCopyKey: ""

    signal itemsChanged

    property Timer fetchDebounce: Timer {
        interval: 250
        repeat: false
        onTriggered: root.fetchPassage(root.pendingFetchKey)
    }

    property Connections settingsConn: Connections {
        target: root.pluginService
        function onPluginDataChanged(changedId) {
            if (changedId === root.pluginId)
                root.loadSettings();
        }
    }

    Component.onCompleted: {
        loadSettings();
        loadTranslations();
    }

    onPluginServiceChanged: loadSettings()

    function loadSettings() {
        if (!pluginService)
            return;
        trigger = pluginService.loadPluginData(pluginId, "trigger", "bible");
        noTrigger = pluginService.loadPluginData(pluginId, "noTrigger", false);
        translation = pluginService.loadPluginData(pluginId, "translation", "NET") || "NET";
        verseNumbers = pluginService.loadPluginData(pluginId, "verseNumbers", false);
        referencePosition = pluginService.loadPluginData(pluginId, "referencePosition", "before");
        rebuildBookIndex();
        loadBooks(translation);
    }

    function httpGetJson(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== XMLHttpRequest.DONE)
                return;
            if (xhr.status !== 200) {
                callback(null);
                return;
            }
            try {
                callback(JSON.parse(xhr.responseText));
            } catch (e) {
                callback(null);
            }
        };
        xhr.open("GET", url);
        xhr.send();
    }

    function loadTranslations() {
        httpGetJson(apiBase + "/static/bolls/app/views/languages.json", data => {
            if (!Array.isArray(data))
                return;
            const map = {};
            for (let i = 0; i < data.length; i++) {
                const list = data[i].translations || [];
                for (let j = 0; j < list.length; j++)
                    map[list[j].short_name.toLowerCase()] = {
                        code: list[j].short_name,
                        name: list[j].full_name
                    };
            }
            translations = map;
        });
    }

    function resolveTranslation(word) {
        const lower = String(word).toLowerCase();
        const known = translations[lower];
        if (known)
            return known.code;
        for (let i = 0; i < fallbackTranslations.length; i++) {
            if (fallbackTranslations[i].toLowerCase() === lower)
                return fallbackTranslations[i];
        }
        return "";
    }

    // Book names in the translation's language, so "Matthieu 5:3" works and
    // the copied reference matches the text.
    function loadBooks(code) {
        if (!code || bookLists[code] !== undefined)
            return;
        const lists = Object.assign({}, bookLists);
        lists[code] = null;
        bookLists = lists;
        httpGetJson(apiBase + "/get-books/" + code + "/", data => {
            const updated = Object.assign({}, bookLists);
            if (!Array.isArray(data)) {
                delete updated[code];
                bookLists = updated;
                return;
            }
            updated[code] = data;
            bookLists = updated;
            rebuildBookIndex();
            requestUpdate();
        });
    }

    function rebuildBookIndex() {
        // The default translation goes last so its names win for display.
        let extra = [];
        for (const code in bookLists) {
            if (code !== translation && bookLists[code])
                extra = extra.concat(bookLists[code]);
        }
        if (bookLists[translation])
            extra = extra.concat(bookLists[translation]);
        bookIndex = Refs.buildBookIndex(extra);
    }

    function bookName(code, book) {
        const list = bookLists[code];
        if (list) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].bookid === book.id)
                    return list[i].name;
            }
        }
        return book.name;
    }

    function requestUpdate() {
        if (pluginService && typeof pluginService.requestLauncherUpdate === "function")
            pluginService.requestLauncherUpdate(pluginId);
        itemsChanged();
    }

    function messageItem(name, comment, icon) {
        return {
            name: name,
            icon: icon || "material:menu_book",
            comment: comment,
            action: "none",
            categories: ["Bible Verse"]
        };
    }

    function getItems(query) {
        const q = (query || "").trim();
        if (!q) {
            if (noTrigger)
                return [];
            return [messageItem(I18n.trFor("bibleVerse", "Type a Bible reference"), I18n.trFor("bibleVerse", "e.g. Mat 5:38-42, John 3:16 ESV, Ps 23"))];
        }

        const ref = Refs.parseReference(q, bookIndex, resolveTranslation);
        if (!ref)
            return [];

        const code = ref.translation || translation;
        loadBooks(code);
        const label = bookName(code, ref.book) + " " + ref.spec + " (" + code + ")";

        if (ref.error === "chapter")
            return [messageItem(label, I18n.trFor("bibleVerse", "This book has %1 chapters").arg(ref.book.chapters), "material:error")];
        if (ref.error === "tooLong")
            return [messageItem(label, I18n.trFor("bibleVerse", "Too many chapters, at most %1 at once").arg(Refs.MAX_CHAPTERS), "material:error")];
        if (ref.error)
            return [messageItem(label, I18n.trFor("bibleVerse", "Keep typing, e.g. 5:38-42"))];

        const key = code + "|" + ref.book.id + "|" + ref.spec;
        if (!requests[key]) {
            const updated = Object.assign({}, requests);
            updated[key] = {
                translation: code,
                book: ref.book.id,
                segments: ref.segments,
                chapters: ref.chapters
            };
            requests = updated;
        }
        requests[key].label = label;

        const passage = passages[key];
        const item = {
            name: label,
            icon: "material:menu_book",
            comment: "",
            action: "copy:" + key,
            categories: ["Bible Verse"]
        };

        if (!passage || passage.status === "loading") {
            if (!passage && pendingFetchKey !== key) {
                pendingFetchKey = key;
                fetchDebounce.restart();
            }
            item.comment = I18n.trFor("bibleVerse", "Loading…");
        } else if (passage.status === "error") {
            item.comment = I18n.trFor("bibleVerse", "Could not reach bolls.life, press Enter to retry");
            item.icon = "material:cloud_off";
        } else if (passage.verses.length === 0) {
            item.comment = I18n.trFor("bibleVerse", "No verses found in %1").arg(code);
            item.icon = "material:error";
            item.action = "none";
        } else {
            item.comment = passage.verses.map(v => v.text).join(" ");
        }
        return [item];
    }

    function loadChapter(code, book, chapter, callback) {
        const cacheKey = code + "/" + book + "/" + chapter;
        if (chapterCache[cacheKey]) {
            callback(chapterCache[cacheKey]);
            return;
        }
        if (chapterWaiters[cacheKey]) {
            chapterWaiters[cacheKey].push(callback);
            return;
        }
        chapterWaiters[cacheKey] = [callback];
        httpGetJson(apiBase + "/get-text/" + cacheKey + "/", data => {
            const verses = Array.isArray(data) ? data : null;
            if (verses) {
                const cache = Object.assign({}, chapterCache);
                cache[cacheKey] = verses;
                chapterCache = cache;
            }
            const waiters = chapterWaiters[cacheKey] || [];
            delete chapterWaiters[cacheKey];
            for (let i = 0; i < waiters.length; i++)
                waiters[i](verses);
        });
    }

    function setPassage(key, value) {
        const updated = Object.assign({}, passages);
        updated[key] = value;
        passages = updated;
    }

    function fetchPassage(key) {
        const req = requests[key];
        if (!req)
            return;
        const current = passages[key];
        if (current && current.status !== "error")
            return;
        setPassage(key, {
            status: "loading"
        });

        const chapterVerses = {};
        let remaining = req.chapters.length;
        let failed = false;
        for (let i = 0; i < req.chapters.length; i++) {
            const chapter = req.chapters[i];
            loadChapter(req.translation, req.book, chapter, verses => {
                if (verses)
                    chapterVerses[chapter] = verses;
                else
                    failed = true;
                remaining--;
                if (remaining > 0)
                    return;
                if (failed)
                    setPassage(key, {
                        status: "error"
                    });
                else
                    setPassage(key, {
                        status: "ready",
                        verses: Refs.selectVerses(req.segments, chapterVerses)
                    });
                if (pendingCopyKey === key) {
                    pendingCopyKey = "";
                    copyPassage(key);
                }
                requestUpdate();
            });
        }
    }

    function keyFromItem(item) {
        if (!item?.action || !item.action.startsWith("copy:"))
            return "";
        return item.action.substring(5);
    }

    function passageText(key) {
        const req = requests[key];
        const passage = passages[key];
        if (!req || !passage || passage.status !== "ready" || passage.verses.length === 0)
            return "";
        return Refs.formatPassage(passage.verses, req.label, {
            verseNumbers: verseNumbers,
            versePerLine: verseNumbers,
            referencePosition: referencePosition
        });
    }

    function copyPassage(key) {
        const passage = passages[key];
        if (passage?.status === "error") {
            ToastService.showError(I18n.trFor("bibleVerse", "Could not reach bolls.life"));
            return;
        }
        const text = passageText(key);
        if (!text) {
            ToastService.showWarning(I18n.trFor("bibleVerse", "No verses found"));
            return;
        }
        Quickshell.execDetached(["dms", "cl", "copy", text]);
        ToastService.showInfo(I18n.trFor("bibleVerse", "Copied %1").arg(requests[key].label));
    }

    function executeItem(item) {
        const key = keyFromItem(item);
        if (!key)
            return;
        const passage = passages[key];
        if (passage && passage.status === "ready") {
            copyPassage(key);
            return;
        }
        // Enter pressed before the text arrived: copy as soon as it does.
        pendingCopyKey = key;
        fetchDebounce.stop();
        fetchPassage(key);
    }

    function getPasteText(item) {
        return passageText(keyFromItem(item)) || null;
    }

    function getContextMenuActions(item) {
        const key = keyFromItem(item);
        const req = requests[key];
        if (!req)
            return [];
        const first = req.segments[0];
        const url = apiBase + "/" + req.translation + "/" + req.book + "/" + first.chapter + "/" + (first.from > 1 || first.to ? first.from + "/" : "");
        return [
            {
                icon: "content_copy",
                text: I18n.trFor("bibleVerse", "Copy"),
                action: () => executeItem(item)
            },
            {
                icon: "open_in_new",
                text: I18n.trFor("bibleVerse", "Open on bolls.life"),
                action: () => Qt.openUrlExternally(url)
            }
        ];
    }
}
