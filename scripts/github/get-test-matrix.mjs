#!/usr/bin/env zx
import * as path from 'node:path';
import * as fs from 'node:fs/promises';

const scriptDir = __dirname;
const repoRootDir = path.resolve(scriptDir, '../../');
const testsYmlPath = path.resolve(repoRootDir, 'tests.yml');

console.log("Script dir:", scriptDir);
console.log(`Using tests.yml at ${testsYmlPath}`);

const rawMetadata = await $`cargo metadata --format-version=1 --all-features --no-deps`;
const metadata = JSON.parse(rawMetadata.stdout);
const packages = metadata.packages.map(p => p.name).filter(name => name !== 'xtask');

console.log('Crates: ', packages)