#!/usr/bin/env zx
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { parse, } from 'yaml'

const scriptDir = __dirname;
const repoRootDir = path.resolve(scriptDir, '../../');
const testsYmlPath = path.resolve(repoRootDir, 'tests.yml');
const testsYml = parse(await fs.readFile(testsYmlPath, 'utf8'));

console.log("Script dir:", scriptDir);
console.log(`Using tests.yml at ${testsYmlPath}`);

const rawMetadata = await $`cargo metadata --format-version=1 --all-features --no-deps`;
const metadata = JSON.parse(rawMetadata.stdout);
const packages = metadata.packages.map(p => p.name).filter(name => name !== 'xtask');

console.log('Crates: ', packages)
console.log('Test config: ', testsYml)

const settings = [];

for (const pkg of packages) {
    settings.push({
        crate: pkg,
        os: 'ubuntu-latest',
    });

    if (testsYml.os?.windows?.includes(pkg)) {
        settings.push({
            crate: pkg,
            os: 'windows-latest',
        });
    }

    if (testsYml.os?.macos?.includes(pkg)) {
        settings.push({
            crate: pkg,
            os: 'macos-latest',
        });
    }
}

const output = JSON.stringify(settings)
console.log(output)
await $`echo settings='${output}' >> $GITHUB_OUTPUT`;