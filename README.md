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

### Step 1 — Install the theme extension

**Option A — From source (development install):**

1. Open a terminal in this folder.
2. Run `npm install -g @vscode/vsce` (if not already installed).
3. Run `vsce package` to produce a `.vsix` file.
4. In VS Code: **Extensions → ⋯ → Install from VSIX…** and select the generated file.

**Option B — Dev mode (no packaging):**

1. Copy this entire folder to your VS Code extensions directory:
   - Windows: `%USERPROFILE%\.vscode\extensions\hellfire-theme`
   - macOS/Linux: `~/.vscode/extensions/hellfire-theme`
2. Restart VS Code.

### Step 2 — Activate the color theme

`Ctrl+Shift+P` → **Preferences: Color Theme** → select **Hellfire**.

### Step 3 — Install "Custom CSS and JS Loader"

Search for **"Custom CSS and JS Loader"** (by `be5invis`) in the Extensions marketplace and install it.

### Step 4 — Point the extension at the Hellfire custom files

Add the following to your VS Code `settings.json` (`Ctrl+Shift+P` → **Open User Settings JSON**):

```json
"vscode_custom_css.imports": [
  "file:///C:/Users/YOUR_USERNAME/.vscode/extensions/hellfire-theme/custom/hellfire.css",
  "file:///C:/Users/YOUR_USERNAME/.vscode/extensions/hellfire-theme/custom/hellfire.js"
]
```

> **Windows note:** Use forward slashes and the `file:///` prefix.
> **macOS/Linux:** Use `file:///home/you/.vscode/extensions/hellfire-theme/custom/hellfire.css` etc.

Replace `YOUR_USERNAME` (and the path if you installed to a custom location).

### Step 5 — Enable the custom CSS

`Ctrl+Shift+P` → **Enable Custom CSS and JS** → click **Restart** when prompted.

VS Code will warn about a "corrupt installation" — this is expected. You can safely dismiss it or click **Don't show again**.

---

## Tweaking the flame

Open [custom/hellfire.js](custom/hellfire.js) and adjust the constants at the top:

| Constant | Default | Effect |
|---|---|---|
| `CELL_SIZE` | `4` | Resolution of the fire grid. Lower = sharper but heavier. |
| `DECAY_MAX` | `3` | Max heat lost per step. Higher = shorter, cooler flames. |
| `IGNITE_MIN/MAX` | `200/255` | Heat range of the base row. Lower = dimmer fire. |
| `FPS_TARGET` | `30` | Animation frame rate. |
| `FLAME_HEIGHT_FRAC` | `0.55` | How much of the window height the flames occupy. |

Open [custom/hellfire.css](custom/hellfire.css) to change the canvas `opacity` (line `#hellfire-canvas { opacity: 0.35 }`) for more or less visible flames.

After any edit, run `Ctrl+Shift+P` → **Reload Custom CSS and JS** to apply changes.

---

## Uninstalling / disabling the animation

`Ctrl+Shift+P` → **Disable Custom CSS and JS**, then disable or uninstall the "Custom CSS and JS Loader" extension.
The color theme will continue to work independently.
