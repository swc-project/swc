#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const FIXTURE_DIR = path.join('.', 'fixtures');
const FILE_TYPE_ALIASES = Object.freeze({
  'exec.mjs': 'exec.js',
  'exec.mjsz': 'exec.js',
  'input.mjs': 'input.js',
  'input.mjsz': 'input.js',
  'output.mjs': 'output.js',
  'output.mjsz': 'output.js',
});

/**
 * Keep fixture emission deterministic so regenerated snippets are stable.
 *
 * The original helper tolerated Finder artifacts, so we keep ignoring them.
 */
const fixtureFiles = fs
  .readdirSync(FIXTURE_DIR, { withFileTypes: true })
  .filter((entry) => entry.isFile() && !entry.name.includes('.DS_Store'))
  .map((entry) => entry.name)
  .sort();

const fixturesByName = new Map();

for (const fileName of fixtureFiles) {
  const separatorIndex = fileName.lastIndexOf('_');
  if (separatorIndex === -1) {
    throw new Error(`invalid fixture file name: ${fileName}`);
  }

  const testName = fileName.slice(0, separatorIndex);
  const rawFileType = fileName.slice(separatorIndex + 1);
  const fileType = FILE_TYPE_ALIASES[rawFileType] ?? rawFileType;
  const filePath = path.join(FIXTURE_DIR, fileName);
  const contents = fs.readFileSync(filePath, 'utf8');

  if (!fixturesByName.has(testName)) {
    fixturesByName.set(testName, new Map());
  }

  fixturesByName.get(testName).set(fileType, contents);
}

for (const [rawName, files] of [...fixturesByName.entries()].sort(([left], [right]) =>
  left.localeCompare(right),
)) {
  const testName = rawName.replace(/-/g, '_');

  console.log();
  console.log(`// ${testName}`);

  if (files.has('exec.js')) {
    const execCode = files.get('exec.js');
    const options = files.get('options.json');

    if (options !== undefined) {
      console.log(
        `test_exec!(syntax(), |_| tr(r#"${options}"#), ${testName}_exec, r#"\\n${execCode}\\n"#);`,
      );
    } else {
      console.log(
        `test_exec!(syntax(), |_| tr(Default::default()), ${testName}_exec, r#"\\n${execCode}\\n"#);`,
      );
    }
  } else if (files.has('input.js') && files.has('output.js')) {
    const inputCode = files.get('input.js');
    const outputCode = files.get('output.js');
    const options = files.get('options.json');

    if (options !== undefined) {
      console.log(
        `test!(syntax(),|_| tr(r#"${options}"#), ${testName}, r#"\\n${inputCode}\\n"#, r#"\\n${outputCode}\\n"#);`,
      );
    } else {
      console.log(
        `test!(syntax(),|_| tr(Default::default()), ${testName}, r#"\\n${inputCode}\\n"#, r#"\\n${outputCode}\\n"#);`,
      );
    }
  } else if (files.has('stdout.txt')) {
    continue;
  } else {
    console.log([...files.keys()]);
    throw new Error(`unsupported fixture group: ${rawName}`);
  }
}
