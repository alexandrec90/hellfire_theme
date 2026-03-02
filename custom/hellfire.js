/**
 * Hellfire Theme — Fire Animation
 * Injected via "Custom CSS and JS Loader" extension.
 *
 * Renders a classic cellular-automata fire simulation onto a fixed canvas
 * that sits behind all VS Code UI surfaces.
 *
 * Algorithm (Doom-style fire):
 *  - A 2D grid of "heat" values (0-255) fills the canvas at a low resolution.
 *  - Each frame the bottom row is re-ignited.
 *  - Each cell's heat propagates upward with a small random decay,
 *    creating the characteristic flickering flame shape.
 *  - Heat values are mapped through a fire palette (black → red → orange → yellow → white).
 */
(function hellfire() {
  "use strict";

  // ── Config ─────────────────────────────────────────────────────────────
  const CELL_SIZE   = 4;     // pixels per simulation cell (lower = higher res, heavier)
  const DECAY_MAX   = 1;     // max heat lost per propagation step (controls flame height)
  const IGNITE_MIN  = 200;   // minimum heat at the base ignition row
  const IGNITE_MAX  = 255;   // maximum heat at the base ignition row
  const FPS_TARGET  = 30;    // target frames per second
  const FLAME_HEIGHT_FRAC = 1.0; // fraction of the canvas height the flames fill

  // ── Palette: index 0 = coolest, 255 = hottest ─────────────────────────
  // Colours: black → deep red → red → orange → bright orange → yellow → white
  function buildPalette() {
    const palette = new Uint32Array(256); // packed ABGR for ImageData
    for (let i = 0; i < 256; i++) {
      let r, g, b, a;
      if (i < 32) {
        // black → deep red
        r = Math.round((i / 31) * 120);
        g = 0;
        b = 0;
        a = Math.round((i / 31) * 180);
      } else if (i < 96) {
        // deep red → bright red
        const t = (i - 32) / 63;
        r = Math.round(120 + t * 135);
        g = 0;
        b = 0;
        a = Math.round(180 + t * 50);
      } else if (i < 160) {
        // red → orange
        const t = (i - 96) / 63;
        r = 255;
        g = Math.round(t * 130);
        b = 0;
        a = 230 + Math.round(t * 20);
      } else if (i < 220) {
        // orange → yellow
        const t = (i - 160) / 59;
        r = 255;
        g = Math.round(130 + t * 105);
        b = Math.round(t * 40);
        a = 250;
      } else {
        // yellow → near-white
        const t = (i - 220) / 35;
        r = 255;
        g = Math.round(235 + t * 20);
        b = Math.round(40 + t * 215);
        a = 255;
      }
      // Pack as ABGR (ImageData is RGBA in little-endian Uint32)
      palette[i] = (a << 24) | (b << 16) | (g << 8) | r;
    }
    return palette;
  }

  // ── DOM setup ──────────────────────────────────────────────────────────
  function createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.id = "hellfire-canvas";
    canvas.style.cssText = [
      "position:fixed",
      "bottom:0",
      "left:0",
      "width:100%",
      "height:100%",
      "z-index:0",
      "pointer-events:none",
    ].join(";");
    document.body.insertBefore(canvas, document.body.firstChild);
    return canvas;
  }

  // ── Simulation ─────────────────────────────────────────────────────────
  function createSim(cols, rows) {
    // Flat Uint8Array, row-major.  Row 0 = top, row (rows-1) = bottom (ignition).
    return new Uint8Array(cols * rows);
  }

  function igniteBase(grid, cols, rows) {
    const baseRow = rows - 1;
    const off = baseRow * cols;
    for (let x = 0; x < cols; x++) {
      grid[off + x] = IGNITE_MIN + Math.floor(Math.random() * (IGNITE_MAX - IGNITE_MIN + 1));
    }
  }

  function stepSim(grid, cols, rows) {
    for (let y = 0; y < rows - 1; y++) {
      for (let x = 0; x < cols; x++) {
        // Read heat from the row below
        const srcIdx = (y + 1) * cols + x;
        const heat   = grid[srcIdx];

        // Slight random horizontal drift (wind)
        const drift = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const dstX  = (x + drift + cols) % cols;
        const dstIdx = y * cols + dstX;

        // Decay
        const decay = Math.floor(Math.random() * (DECAY_MAX + 1));
        grid[dstIdx] = Math.max(0, heat - decay);
      }
    }
  }

  // ── Rendering ──────────────────────────────────────────────────────────
  function renderSim(grid, cols, rows, imageData, palette, simRows) {
    const data = new Uint32Array(imageData.data.buffer);
    const canvasCols = imageData.width;
    const canvasRows = imageData.height;

    // The simulation occupies the bottom `simRows` of the canvas.
    const yOffset = canvasRows - simRows * CELL_SIZE;

    for (let y = 0; y < simRows; y++) {
      for (let x = 0; x < cols; x++) {
        const heat  = grid[y * cols + x];
        const color = palette[heat];

        // Paint CELL_SIZE × CELL_SIZE block
        const px = x * CELL_SIZE;
        const py = yOffset + y * CELL_SIZE;

        for (let dy = 0; dy < CELL_SIZE; dy++) {
          const row = py + dy;
          if (row < 0 || row >= canvasRows) continue;
          const rowOff = row * canvasCols + px;
          for (let dx = 0; dx < CELL_SIZE; dx++) {
            if (px + dx >= canvasCols) break;
            data[rowOff + dx] = color;
          }
        }
      }
    }
  }

  // ── Main loop ──────────────────────────────────────────────────────────
  function init() {
    // Remove any previous instance (hot-reload safe)
    const prev = document.getElementById("hellfire-canvas");
    if (prev) prev.remove();

    const canvas  = createCanvas();
    const ctx     = canvas.getContext("2d");
    const palette = buildPalette();

    let cols, rows, simRows, grid, imageData;
    let lastTime  = 0;
    const frameMs = 1000 / FPS_TARGET;
    let rafId;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;

      cols    = Math.ceil(canvas.width  / CELL_SIZE);
      simRows = Math.ceil(canvas.height * FLAME_HEIGHT_FRAC / CELL_SIZE);
      rows    = simRows + 1; // +1 so the ignition row is always just below canvas bottom

      grid      = createSim(cols, rows);
      imageData = ctx.createImageData(canvas.width, canvas.height);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function frame(timestamp) {
      rafId = requestAnimationFrame(frame);

      if (timestamp - lastTime < frameMs) return;
      lastTime = timestamp;

      igniteBase(grid, cols, rows);
      stepSim(grid, cols, rows);

      // Clear only the flame region each frame for performance
      const flameTop = canvas.height - simRows * CELL_SIZE;
      ctx.clearRect(0, flameTop - CELL_SIZE, canvas.width, canvas.height - flameTop + CELL_SIZE);

      // Also clear above for trailing cells that might have rendered there before
      ctx.clearRect(0, 0, canvas.width, flameTop - CELL_SIZE);

      renderSim(grid, cols, rows, imageData, palette, simRows);
      ctx.putImageData(imageData, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    rafId = requestAnimationFrame(frame);

    // Expose cleanup so hot-reloads work
    window.__hellfireCleanup = function () {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      canvas.remove();
      delete window.__hellfireCleanup;
    };
  }

  // Run after VS Code has finished rendering its DOM
  function waitForBody() {
    if (document.body) {
      // Clean up any previous run
      if (typeof window.__hellfireCleanup === "function") {
        window.__hellfireCleanup();
      }
      init();
    } else {
      requestAnimationFrame(waitForBody);
    }
  }

  waitForBody();
})();
