#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

/**
 * Propagate fixture options downward before pruning empty fixture branches.
 */
function search(dirPath) {
  console.log(`Searching ${dirPath}`);

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const entryNames = entries.map((entry) => entry.name);
  const isFixtureDir = dirPath.includes('fixtures');

  if (isFixtureDir && entryNames.length === 1) {
    fs.rmSync(dirPath, { force: true, recursive: true });
    return true;
  }

  if (
    isFixtureDir &&
    entryNames.length === 2 &&
    entryNames.includes('options.json') &&
    entryNames.includes('input.js')
  ) {
    fs.rmSync(dirPath, { force: true, recursive: true });
    return true;
  }

  const localOptionsPath = path.join(dirPath, 'options.json');
  const hasLocalOptions = fs.existsSync(localOptionsPath);
  let shouldDelete = true;

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const childDir = path.join(dirPath, entry.name);
    const childContainsOptions = !search(childDir);
    if (childContainsOptions) {
      shouldDelete = false;
    }

    const childOptionsPath = path.join(childDir, 'options.json');
    if (hasLocalOptions && fs.existsSync(childDir) && !fs.existsSync(childOptionsPath)) {
      fs.copyFileSync(localOptionsPath, childOptionsPath);
    }
  }

  if (hasLocalOptions) {
    shouldDelete = false;
  }

  if (shouldDelete && isFixtureDir) {
    fs.rmSync(dirPath, { force: true, recursive: true });
  }

  return !hasLocalOptions;
}

search('.');
