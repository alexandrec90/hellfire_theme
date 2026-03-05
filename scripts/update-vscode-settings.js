#!/usr/bin/env node
// Updates vscode_custom_css.imports in the user's VS Code settings.json
// to point to the currently installed version of the Hellfire theme extension.
//
// Usage:  npm run update-settings
//         node scripts/update-vscode-settings.js [--dry-run]

const fs = require('fs');
const os = require('os');
const path = require('path');

const pkg = require('../package.json');
const extId = `${pkg.publisher.toLowerCase()}.${pkg.name}`;
const dryRun = process.argv.includes('--dry-run');

// Resolve VS Code user settings path per platform
function getSettingsPath() {
  switch (process.platform) {
    case 'win32':
      return path.join(process.env.APPDATA, 'Code', 'User', 'settings.json');
    case 'darwin':
      return path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'User', 'settings.json');
    default:
      return path.join(os.homedir(), '.config', 'Code', 'User', 'settings.json');
  }
}

const settingsPath = getSettingsPath();

if (!fs.existsSync(settingsPath)) {
  console.error(`Could not find VS Code settings.json at:\n  ${settingsPath}`);
  process.exit(1);
}

const before = fs.readFileSync(settingsPath, 'utf8');
const after = before.replace(
  new RegExp(`${extId}-[\\d]+\\.[\\d]+\\.[\\d]+`, 'g'),
  `${extId}-${pkg.version}`
);

if (after === before) {
  console.log(`No Hellfire theme entries found in:\n  ${settingsPath}`);
  console.log('Make sure vscode_custom_css.imports already points to this extension.');
} else if (dryRun) {
  console.log(`[dry-run] Would update ${settingsPath} to version ${pkg.version}`);
} else {
  fs.writeFileSync(settingsPath, after);
  console.log(`settings.json updated to ${pkg.version}\n  ${settingsPath}`);
}
