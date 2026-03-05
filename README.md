# Hellfire Theme

A blazing red-and-black VS Code color theme with an animated fire background.

---

## Features

- Full **red/black color theme** covering editor, UI chrome, terminal, git decorations, and more
- **Doom-style cellular-automata fire animation** rendered on a canvas behind all surfaces
- Semi-transparent editor and sidebar panels so the flames show through
- Glowing ember **cursor pulse** animation
- Ember glow on activity bar icons, scrollbars, selection highlights, and status bar flicker

---

## Installation

### Step 1 — Activate the color theme

`Ctrl+Shift+P` → **Preferences: Color Theme** → select **Hellfire**.

### Step 2 — Install "Custom CSS and JS Loader"

Search for **"Custom CSS and JS Loader"** (by `be5invis`) in the Extensions panel and install it.
The animated fire background requires this extension to inject the custom CSS and JS.

### Step 3 — Enable the custom CSS

The Hellfire extension automatically adds its CSS and JS files to `vscode_custom_css.imports` on startup, so no manual path configuration is needed.

`Ctrl+Shift+P` → **Enable Custom CSS and JS** → click **Restart** when prompted.

VS Code will warn about a "corrupt installation" — this is expected. You can safely dismiss it or click **Don't show again**.

---

## Tweaking the flame

Open the `hellfire.js` file in your extension folder and adjust the constants at the top:

| Constant | Default | Effect |
| --- | --- | --- |
| `CELL_SIZE` | `4` | Resolution of the fire grid. Lower = sharper but heavier. |
| `DECAY_MAX` | `3` | Max heat lost per step. Higher = shorter, cooler flames. |
| `IGNITE_MIN/MAX` | `200/255` | Heat range of the base row. Lower = dimmer fire. |
| `FPS_TARGET` | `30` | Animation frame rate. |
| `FLAME_HEIGHT_FRAC` | `0.55` | How much of the window height the flames occupy. |

Open `hellfire.css` in the same folder to change the canvas `opacity` (`#hellfire-canvas { opacity: 0.35 }`) for more or less visible flames.

After any edit, run `Ctrl+Shift+P` → **Reload Custom CSS and JS** to apply changes.

---

## Disabling the animation

`Ctrl+Shift+P` → **Disable Custom CSS and JS**, then disable or uninstall the "Custom CSS and JS Loader" extension.
The color theme will continue to work independently.

---

## Changelog

### 1.0.4

- Automatically update css import setting.

### 1.0.3

- Added opacity controls for the fire canvas
- Refined editor and UI color settings

### 1.0.2

- Fixed diff editor colors (added/modified/deleted regions)
- Fixed a typo in the VS Code build task command

### 1.0.1

- Improved text contrast in CSS for better readability

### 1.0.0

- Initial release: full red/black color theme with Doom-style animated fire background, ember cursor pulse, and semi-transparent panels
