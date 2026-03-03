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

### Step 3 — Point Custom CSS and JS Loader at the Hellfire files

Add the following to your VS Code `settings.json` (`Ctrl+Shift+P` → **Open User Settings JSON**):

**Windows:**

```json
"vscode_custom_css.imports": [
  "file:///C:/Users/YOUR_USERNAME/.vscode/extensions/alexcharbonneau.hellfire-theme-1.0.0/custom/hellfire.css",
  "file:///C:/Users/YOUR_USERNAME/.vscode/extensions/alexcharbonneau.hellfire-theme-1.0.0/custom/hellfire.js"
]
```

**macOS / Linux:**

```json
"vscode_custom_css.imports": [
  "file:///home/YOUR_USERNAME/.vscode/extensions/alexcharbonneau.hellfire-theme-1.0.0/custom/hellfire.css",
  "file:///home/YOUR_USERNAME/.vscode/extensions/alexcharbonneau.hellfire-theme-1.0.0/custom/hellfire.js"
]
```

Replace `YOUR_USERNAME` with your system username. If you have a newer version installed, update `1.0.0` to match the folder name in your extensions directory.

### Step 4 — Enable the custom CSS

`Ctrl+Shift+P` → **Enable Custom CSS and JS** → click **Restart** when prompted.

VS Code will warn about a "corrupt installation" — this is expected. You can safely dismiss it or click **Don't show again**.

---

## Tweaking the flame

Open the `hellfire.js` file in your extension folder and adjust the constants at the top:

| Constant | Default | Effect |
|---|---|---|
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
