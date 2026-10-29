# Bible Verse

A [Dux Shell](https://github.com/duxlabs-dev/dux-shell) launcher plugin that looks up Bible passages and copies them to the clipboard. Text comes from the [Bolls Bible API](https://github.com/Bolls-Bible/bain/blob/master/docs/API.md).

Open the launcher, type a reference and press <kbd>Enter</kbd>:

```
Mat 5:38-42
```

copies

```
Matthew 5:38-42 (NET)
“You have heard that it was said, ‘An eye for an eye and a tooth for a tooth.’
But I say to you, do not resist the evildoer. But whoever strikes you on the right cheek, turn the other to him as well.
...
```

References work straight from the launcher search. Prefix them with `bible` to see only Bible results.

## References

| You type | You get |
| --- | --- |
| `John 3:16` | one verse |
| `Mat 5:38-42` | a range of verses |
| `Mat 27:5-28:13` | a range across chapters |
| `Ps 23` | a whole chapter |
| `Mat 5-7` | several chapters (up to 10) |
| `John 3:16,18-20` or `Rom 3:23; 6:23` | a list |
| `1 Cor 13:4-7 ESV` | a specific translation |

Book names can be full or abbreviated (`Matt`, `Mt`, `1 Co`, `I Cor`, `Phil`, `Phm`, `Song`...). Book names in the default translation's language also work, so with a French default translation `Matthieu 5:3` is recognized and the copied reference uses the French name.

<kbd>Shift</kbd>+<kbd>Enter</kbd> pastes the passage into the focused window. The context menu can also open the passage on bolls.life.

## Settings

- **Trigger**: prefix for Bible-only results (default `bible`)
- **Default Translation**: any translation Bolls offers (default NET)
- **Reference**: put the reference before the text, after it, or leave it out
- **Verse Numbers**: prefix each verse with its number, and its chapter when the passage spans several (off by default)
- **One Verse per Line**: otherwise verses are joined into a paragraph

NIV is not offered because its publisher does not allow Bolls to serve it.

## Installation

```sh
dms plugins install bibleVerse
```

Or clone this repository into `~/.config/dms/plugins/` and run `dms restart`.

## Development

The reference parser and text formatting live in `References.js`, which has no Qt dependencies:

```sh
node tests/references.test.js
```
