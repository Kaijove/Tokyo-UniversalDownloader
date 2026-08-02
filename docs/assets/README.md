# Documentation assets

This folder holds images referenced by the README and docs. They are
**placeholders** until real captures are added — the docs reference these paths
so images render automatically once the files exist.

Expected files:

| File | Used by | What it should show |
| ---- | ------- | ------------------- |
| `logo.png` | README banner | The app icon / logo (square, ~128px) |
| `screenshot-main.png` | README | The main screen with a download in progress |

You can export `logo.png` from the existing app icon at
`../../src-tauri/icons/icon.png`. Screenshots need a running build, so they
can't be generated automatically here — capture them from the app and drop them
in this folder with the names above.
