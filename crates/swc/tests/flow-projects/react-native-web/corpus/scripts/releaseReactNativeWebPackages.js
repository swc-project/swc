#!/usr/bin/env node

'use strict';

const execSync = require('child_process').execSync;
const fs = require('fs');
const glob = require('glob');
const minimist = require('minimist');
const path = require('path');

const args = process.argv.slice(2);
const argv = minimist(args);

const version = argv._[0];
const skipGit = argv['skip-git'];
const oneTimeCode = argv.otp;

console.log(`Publishing react-native-web@${version}`);

// Collect 'react-native-web' workspaces and package manifests
const workspacePaths = require('../package.json').workspaces.reduce(
  (acc, w) => {
    const resolvedPaths = glob.sync(w);
    resolvedPaths.forEach((p) => {
      // Remove duplicates and unrelated packages
      if (p.includes('react-native-web') && acc.indexOf(p) === -1) {
        acc.push(p);
      }
    });
    return acc;
  },
  []
);

const workspaces = workspacePaths.map((dir) => {
  const directory = path.resolve(dir);
  const packageJsonPath = path.join(directory, 'package.json');
  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, { encoding: 'utf-8' })
  );
  return { directory, packageJson, packageJsonPath };
});

// Update each package version and its dependencies
const workspaceNames = workspaces.map(({ packageJson }) => packageJson.name);
workspaces.forEach(({ directory, packageJson, packageJsonPath }) => {
  packageJson.version = version;
  workspaceNames.forEach((name) => {
    if (packageJson.dependencies && packageJson.dependencies[name]) {
      packageJson.dependencies[name] = version;
    }
    if (packageJson.devDependencies && packageJson.devDependencies[name]) {
      packageJson.devDependencies[name] = version;
    }
  });
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n'
  );
});

execSync('npm install');

// Commit changes
if (!skipGit) {
  // add changes
  execSync('git add .');
  // commit
  execSync(`git commit -m "${version}" --no-verify`);
  // tag
  execSync(`git tag -fam ${version} "${version}"`);
}

// Publish public packages
workspaces.forEach(({ directory, packageJson }) => {
  if (!packageJson.private) {
    execSync(`cd ${directory} && npm publish --otp ${oneTimeCode}`);
  }
});

// Push changes
if (!skipGit) {
  execSync('git push --tags origin master');
}
