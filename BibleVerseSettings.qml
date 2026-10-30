import QtQuick
import qs.Common
import qs.Widgets
import qs.Modules.Plugins

PluginSettings {
    id: root
    pluginId: "bibleVerse"

    // Bolls serves a notice instead of the text for these.
    readonly property var unavailable: ["NIV", "NIV2011"]

    property var translationOptions: [
        {
            label: "NET - New English Translation",
            value: "NET"
        }
    ]

    Component.onCompleted: {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== XMLHttpRequest.DONE || xhr.status !== 200)
                return;
            try {
                const languages = JSON.parse(xhr.responseText);
                const options = [];
                for (let i = 0; i < languages.length; i++) {
                    const language = languages[i].language.split(" ")[0];
                    const list = languages[i].translations || [];
                    for (let j = 0; j < list.length; j++) {
                        if (unavailable.indexOf(list[j].short_name) !== -1)
                            continue;
                        options.push({
                            label: list[j].short_name + " - " + list[j].full_name + " (" + language + ")",
                            value: list[j].short_name
                        });
                    }
                }
                if (options.length > 0)
                    translationOptions = options;
            } catch (e) {
                console.warn("bibleVerse: could not parse translations", e);
            }
        };
        xhr.open("GET", "https://bolls.life/static/bolls/app/views/languages.json");
        xhr.send();
    }

    StyledText {
        width: parent.width
        text: I18n.trFor("bibleVerse", "Bible Verse")
        font.pixelSize: Theme.fontSizeLarge
        font.weight: Font.Bold
        color: Theme.surfaceText
    }

    StyledText {
        width: parent.width
        text: I18n.trFor("bibleVerse", "Type a reference such as Mat 5:38-42 in the launcher and press Enter to copy the passage. Add a translation code at the end (John 3:16 ESV) to override the default. Text from bolls.life.")
        font.pixelSize: Theme.fontSizeSmall
        color: Theme.surfaceVariantText
        wrapMode: Text.WordWrap
    }

    Rectangle {
        width: parent.width
        height: 1
        color: Theme.outline
        opacity: 0.3
    }

    StringSetting {
        settingKey: "trigger"
        label: I18n.trFor("bibleVerse", "Trigger")
        description: I18n.trFor("bibleVerse", "Prefix that shows only Bible results (default: bible). References also work without it.")
        placeholder: "bible"
        defaultValue: "bible"
    }

    SelectionSetting {
        settingKey: "translation"
        label: I18n.trFor("bibleVerse", "Default Translation")
        description: I18n.trFor("bibleVerse", "Used when the reference does not name one")
        options: root.translationOptions
        defaultValue: "NET"
    }

    SelectionSetting {
        settingKey: "referencePosition"
        label: I18n.trFor("bibleVerse", "Reference")
        description: I18n.trFor("bibleVerse", "Where the copied text names the passage")
        options: [
            {
                label: I18n.trFor("bibleVerse", "Before the text"),
                value: "before"
            },
            {
                label: I18n.trFor("bibleVerse", "After the text"),
                value: "after"
            },
            {
                label: I18n.trFor("bibleVerse", "Not included"),
                value: "none"
            }
        ]
        defaultValue: "before"
    }

    ToggleSetting {
        settingKey: "verseNumbers"
        label: I18n.trFor("bibleVerse", "Verse Numbers")
        description: I18n.trFor("bibleVerse", "Put each verse on its own line, prefixed with its number (and its chapter when the passage spans several). Otherwise the passage is copied as one paragraph.")
        defaultValue: false
    }
}
