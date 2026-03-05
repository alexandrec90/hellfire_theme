#!/usr/bin/env node
// Replaces every versioned extension path in README.md with the current package version.
// Runs automatically as the `postversion` npm lifecycle hook.

const fs = require('fs');
const path = require('path');

const pkg = require('../package.json');
const extId = `${pkg.publisher.toLowerCase()}.${pkg.name}`;
const readmePath = path.join(__dirname, '..', 'README.md');

const before = fs.readFileSync(readmePath, 'utf8');
const after = before.replace(
  new RegExp(`${extId}-[\\d]+\\.[\\d]+\\.[\\d]+`, 'g'),
  `${extId}-${pkg.version}`
);

if (after === before) {
  console.log(`README.md already up to date (${pkg.version})`);
} else {
  fs.writeFileSync(readmePath, after);
  console.log(`README.md updated to ${pkg.version}`);
}
