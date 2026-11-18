#!/usr/bin/env node
'use strict';

const childProcess = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SCRIPT_DIR = __dirname;
const CRATE_DIR = path.resolve(SCRIPT_DIR, '..');
const TARGET_DIR = path.join(CRATE_DIR, 'tests', 'flow-projects');
const SELECTED = process.argv.slice(2);

const PROJECTS = Object.freeze({
  'react-native': {
    repo: 'facebook/react-native',
    branch: 'main',
    flowconfig: '.flowconfig',
    parser: {
      jsx: true,
      require_directive: false,
      enums: true,
      decorators: false,
      components: true,
      pattern_matching: true,
    },
  },
  'react-native-web': {
    repo: 'necolas/react-native-web',
    branch: 'master',
    flowconfig: 'configs/.flowconfig',
    parser: {
      jsx: true,
      require_directive: false,
      enums: false,
      decorators: false,
      components: false,
      pattern_matching: false,
    },
  },
});

function utcTimestamp() {
  return new Date().toISOString().replace('Z', '+00:00');
}

function run(command, args, options = {}) {
  return childProcess.execFileSync(command, args, {
    cwd: options.cwd,
    encoding: 'utf8',
    input: options.input,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
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

function gitShow(repoDir, filePath) {
  return run('git', ['show', `HEAD:${filePath}`], { cwd: repoDir });
}

function gitLsTree(repoDir) {
  return run('git', ['ls-tree', '-r', '--name-only', 'HEAD'], { cwd: repoDir })
    .split('\n')
    .filter(Boolean);
}

function materializePaths(repoDir, pathsToMaterialize) {
  if (pathsToMaterialize.length === 0) {
    return;
  }

  run(
    'git',
    ['sparse-checkout', 'set', '--no-cone', '--stdin'],
    {
      cwd: repoDir,
      input: pathsToMaterialize.map((entry) => `${entry}\n`).join(''),
    },
  );
}

function flowconfigSectionLines(flowconfig, wantedSection) {
  let section = null;
  const lines = [];

  for (const rawLine of flowconfig.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith(';')) {
      continue;
    }

    if (line.startsWith('[') && line.endsWith(']')) {
      section = line.slice(1, -1);
      continue;
    }

    if (section === wantedSection) {
      lines.push(line);
    }
  }

  return lines;
}

function parseFlowconfigRegexSection(flowconfig, wantedSection) {
  return flowconfigSectionLines(flowconfig, wantedSection).map((line) => {
    let normalized = line;
    if (normalized.startsWith('<PROJECT_ROOT>/')) {
      normalized = `^${normalized.slice('<PROJECT_ROOT>/'.length)}`;
    }

    return new RegExp(normalized);
  });
}

function parseFlowconfigLibPaths(flowconfig) {
  return flowconfigSectionLines(flowconfig, 'libs').map((line) =>
    line.startsWith('<PROJECT_ROOT>/') ? line.slice('<PROJECT_ROOT>/'.length) : line,
  );
}

function isLibPath(filePath, libPaths) {
  return libPaths.some((libPath) => {
    if (libPath.endsWith('/')) {
      return filePath.startsWith(libPath);
    }

    return filePath === libPath;
  });
}

function shouldCopy(filePath, ignorePatterns, declarationPatterns, libPaths) {
  if (!(filePath.endsWith('.js') || filePath.endsWith('.jsx'))) {
    return false;
  }

  if (isLibPath(filePath, libPaths)) {
    return false;
  }

  if (ignorePatterns.some((pattern) => pattern.test(filePath))) {
    return false;
  }

  if (declarationPatterns.some((pattern) => pattern.test(filePath))) {
    return false;
  }

  return true;
}

function syncProject(name, config, workspaceDir) {
  const repoDir = path.join(workspaceDir, name);

  console.log(`[flow-projects] cloning ${config.repo}#${config.branch}`);
  childProcess.execFileSync(
    'gh',
    [
      'repo',
      'clone',
      config.repo,
      repoDir,
      '--',
      '--depth',
      '1',
      '--branch',
      config.branch,
      '--filter=blob:none',
      '--sparse',
    ],
    { stdio: 'inherit' },
  );

  const flowconfig = gitShow(repoDir, config.flowconfig);
  const ignorePatterns = parseFlowconfigRegexSection(flowconfig, 'ignore');
  const declarationPatterns = parseFlowconfigRegexSection(flowconfig, 'declarations');
  const libPaths = parseFlowconfigLibPaths(flowconfig);
  const files = gitLsTree(repoDir)
    .filter((filePath) => shouldCopy(filePath, ignorePatterns, declarationPatterns, libPaths))
    .sort();
  const commit = run('git', ['rev-parse', 'HEAD'], { cwd: repoDir }).trim();

  const targetRoot = path.join(TARGET_DIR, name);
  const corpusRoot = path.join(targetRoot, 'corpus');

  fs.rmSync(targetRoot, { force: true, recursive: true });
  fs.mkdirSync(corpusRoot, { recursive: true });
  fs.writeFileSync(path.join(targetRoot, 'source.flowconfig'), flowconfig, 'utf8');

  materializePaths(repoDir, files);

  let totalBytes = 0;
  for (const relativePath of files) {
    const sourcePath = path.join(repoDir, relativePath);
    const contents = fs.readFileSync(sourcePath);
    totalBytes += contents.length;

    const destinationPath = path.join(corpusRoot, relativePath);
    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    fs.writeFileSync(destinationPath, contents);
  }

  fs.writeFileSync(path.join(targetRoot, 'manifest.txt'), `${files.join('\n')}\n`, 'utf8');

  const metadata = {
    name,
    corpus: 'corpus',
    manifest: 'manifest.txt',
    flowconfig: 'source.flowconfig',
    source: {
      repo: config.repo,
      branch: config.branch,
      commit,
      flowconfig_path: config.flowconfig,
    },
    parser: config.parser,
    generated_at_utc: utcTimestamp(),
    counts: {
      files: files.length,
      bytes: totalBytes,
    },
  };

  fs.writeFileSync(
    path.join(targetRoot, 'metadata.json'),
    `${JSON.stringify(sortedJson(metadata), null, 2)}\n`,
    'utf8',
  );

  console.log(
    `[flow-projects] synced ${name}: ${files.length} files, ${totalBytes} bytes from ${commit}`,
  );
}

function main() {
  const selectedProjects = SELECTED.length === 0 ? ['react-native', 'react-native-web'] : SELECTED;
  const unknownProjects = selectedProjects
    .filter((name) => !Object.prototype.hasOwnProperty.call(PROJECTS, name))
    .sort();

  if (unknownProjects.length > 0) {
    console.error(`unknown flow project(s): ${unknownProjects.join(', ')}`);
    process.exit(1);
  }

  fs.mkdirSync(TARGET_DIR, { recursive: true });

  const workspaceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'swc-flow-projects-'));
  try {
    for (const projectName of selectedProjects) {
      syncProject(projectName, PROJECTS[projectName], workspaceDir);
    }
  } finally {
    fs.rmSync(workspaceDir, { force: true, recursive: true });
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
