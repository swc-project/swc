#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

function utcTimestamp() {
  return new Date().toISOString().replace('Z', '+00:00');
}

function sortedJson(value) {
  if (Array.isArray(value)) {
    return value.map((item) => sortedJson(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortedJson(value[key])]),
    );
  }

  return value;
}

function walkFiles(rootDir, predicate, entries = []) {
  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    const absolutePath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(absolutePath, predicate, entries);
      continue;
    }

    if (predicate(absolutePath)) {
      entries.push(absolutePath);
    }
  }

  return entries;
}

function toPosixRelative(rootDir, absolutePath) {
  return path.relative(rootDir, absolutePath).split(path.sep).join('/');
}

function hasTreeErrors(tree) {
  if (Array.isArray(tree.errors)) {
    return tree.errors.length > 0;
  }

  return Boolean(tree.errors);
}

function main() {
  const [targetDir, repo, branch, commit] = process.argv.slice(2);
  if (!targetDir || !repo || !branch || !commit) {
    console.error('usage: sync_flow_hermes_metadata.js <target_dir> <repo> <branch> <commit>');
    process.exit(1);
  }

  const corpusDir = path.join(targetDir, 'corpus');
  const jsFiles = walkFiles(corpusDir, (filePath) => filePath.endsWith('.js')).sort();
  const treeJsonFiles = walkFiles(corpusDir, (filePath) => filePath.endsWith('.tree.json'));
  const optionsJsonFiles = walkFiles(corpusDir, (filePath) => filePath.endsWith('.options.json'));

  const expectedLines = [];
  for (const jsPath of jsFiles) {
    const relativePath = toPosixRelative(corpusDir, jsPath);
    const treePath = `${jsPath.slice(0, -3)}.tree.json`;
    if (!fs.existsSync(treePath)) {
      throw new Error(`missing .tree.json for ${relativePath}`);
    }

    const tree = JSON.parse(fs.readFileSync(treePath, 'utf8'));
    expectedLines.push(`${relativePath}\t${hasTreeErrors(tree) ? 'true' : 'false'}`);
  }

  fs.writeFileSync(
    path.join(targetDir, 'expected-errors.txt'),
    `${expectedLines.join('\n')}\n`,
    'utf8',
  );
  fs.writeFileSync(path.join(targetDir, 'known-fail.txt'), '\n', 'utf8');

  const upstreamReadme = fs.readFileSync(
    path.join(targetDir, 'upstream-flowtest-README.md'),
    'utf8',
  );
  const flowCommitLine = upstreamReadme
    .split(/\r?\n/u)
    .find((line) => line.startsWith('Flow git commit:'));
  const flowCommit = flowCommitLine ? flowCommitLine.split(':', 2)[1].trim() : null;

  const metadata = {
    source: {
      repo,
      branch,
      commit,
      flow_commit: flowCommit,
    },
    generated_at_utc: utcTimestamp(),
    counts: {
      js: jsFiles.length,
      tree_json: treeJsonFiles.length,
      options_json: optionsJsonFiles.length,
      known_fail: 0,
    },
  };

  fs.writeFileSync(
    path.join(targetDir, 'metadata.json'),
    `${JSON.stringify(sortedJson(metadata), null, 2)}\n`,
    'utf8',
  );
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
