#!/usr/bin/env node
// Inserts a new changelog entry at the top of the ## Changelog section in README.md.
// Reads the version from package.json and the message from the CHANGELOG_MSG env var.
// Runs automatically as part of the `postversion` npm lifecycle hook.

const fs = require('fs');
const path = require('path');

const msg = process.env.CHANGELOG_MSG;
if (!msg || !msg.trim()) {
  console.log('No CHANGELOG_MSG set, skipping changelog entry.');
  process.exit(0);
}

const pkg = require('../package.json');
const readmePath = path.join(__dirname, '..', 'README.md');
const readme = fs.readFileSync(readmePath, 'utf8');

const entry = `### ${pkg.version}\n\n- ${msg.trim()}\n\n`;
const marker = '## Changelog\n\n';
const idx = readme.indexOf(marker);

if (idx === -1) {
  console.error('Could not find ## Changelog section in README.md');
  process.exit(1);
}

const updated = readme.slice(0, idx + marker.length) + entry + readme.slice(idx + marker.length);
fs.writeFileSync(readmePath, updated);
console.log(`Changelog entry added for ${pkg.version}: ${msg.trim()}`);
