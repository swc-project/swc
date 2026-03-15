#!/usr/bin/env zx
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { parse } from 'yaml';

const NOOP_CRATE = '__noop__';
const DEFAULT_BASE_BRANCH = 'main';
const INFRA_PATH_PREFIXES = ['.github/', 'scripts/github/', 'scripts/cargo/', '.cargo/'];
const INFRA_PATH_EXACT = new Set(['tests.yml']);

const scriptDir = __dirname;
const repoRootDir = path.resolve(scriptDir, '../../');
const testsYmlPath = path.resolve(repoRootDir, 'tests.yml');
const testsYml = parse(await fs.readFile(testsYmlPath, 'utf8'));

process.stderr.write(`Script dir: ${scriptDir}\n`);
process.stderr.write(`Using tests.yml at ${testsYmlPath}\n`);

const eventName = process.env.GITHUB_EVENT_NAME ?? '';
const gitRef = process.env.GITHUB_REF ?? '';
const baseBranch = process.env.GITHUB_BASE_REF ?? DEFAULT_BASE_BRANCH;
const changedBaseRef = `origin/${baseBranch}`;

process.stderr.write(`Event: ${eventName}, ref: ${gitRef}, base: ${changedBaseRef}\n`);

const allPackages = await getAllWorkspacePackageNames();
const allPackageSet = new Set(allPackages);
const allSettings = toMatrixSettings(allPackages, testsYml);

if (eventName === 'push' && gitRef === 'refs/heads/main') {
    process.stderr.write('Running full matrix for push to main.\n');
    printSettings(allSettings);
    process.exit(0);
}

try {
    const changedResult = await getChangedPackages(changedBaseRef);
    const changedSet = new Set(
        changedResult.packages.filter((name) => allPackageSet.has(name)),
    );
    const selectedPackages = allPackages.filter((name) => changedSet.has(name));

    process.stderr.write(
        `Changed packages resolved: ${selectedPackages.length}, changed files: ${changedResult.files.length}\n`,
    );

    if (selectedPackages.length > 0) {
        printSettings(toMatrixSettings(selectedPackages, testsYml));
        process.exit(0);
    }

    if (hasInfrastructureChanges(changedResult.files)) {
        process.stderr.write(
            'No crate changes but infrastructure paths changed; falling back to full matrix.\n',
        );
        printSettings(allSettings);
        process.exit(0);
    }

    process.stderr.write('No affected crates; returning noop matrix entry.\n');
    printSettings([{ crate: NOOP_CRATE, os: 'ubuntu-latest' }]);
} catch (error) {
    process.stderr.write(
        `Failed to resolve changed crates, falling back to full matrix: ${error}\n`,
    );
    printSettings(allSettings);
}

async function getAllWorkspacePackageNames() {
    const rawMetadata = await $`cargo metadata --format-version=1 --all-features --no-deps`;
    const metadata = JSON.parse(rawMetadata.stdout);
    return metadata.packages
        .map((pkg) => pkg.name)
        .filter((name) => name !== 'xtask')
        .sort();
}

function toMatrixSettings(packages, config) {
    const windowsPackages = new Set(config.os?.windows ?? []);
    const macosPackages = new Set(config.os?.macos ?? []);
    const settings = [];

    for (const pkg of packages) {
        settings.push({ crate: pkg, os: 'ubuntu-latest' });

        if (windowsPackages.has(pkg)) {
            settings.push({ crate: pkg, os: 'windows-latest' });
        }

        if (macosPackages.has(pkg)) {
            settings.push({ crate: pkg, os: 'macos-latest' });
        }
    }

    return settings;
}

async function getChangedPackages(baseRef) {
    const changedOutput = await $`cargo mono --output json changed --base ${baseRef}`;
    const changedResult = JSON.parse(changedOutput.stdout);
    return {
        files: changedResult.files ?? [],
        packages: changedResult.packages ?? [],
    };
}

function hasInfrastructureChanges(files) {
    return files.some((rawPath) => {
        const normalizedPath = normalizePath(rawPath);
        if (INFRA_PATH_EXACT.has(normalizedPath)) {
            return true;
        }

        return INFRA_PATH_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix));
    });
}

function normalizePath(filePath) {
    return filePath.replaceAll('\\', '/').replace(/^\.\//, '');
}

function printSettings(settings) {
    console.log(JSON.stringify(settings));
}
