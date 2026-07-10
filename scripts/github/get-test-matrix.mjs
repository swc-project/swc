#!/usr/bin/env zx
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { parse } from 'yaml';

const NOOP_CRATE = '__noop__';
const TEST262_CRATE = 'swc_test262';
const TEST262_SEMANTIC_ROOTS = [
    'swc_common',
    'swc_ecma_ast',
    'swc_ecma_codegen',
    'swc_ecma_minifier',
    'swc_ecma_parser',
    'swc_ecma_transforms',
    'swc_sourcemap',
];
const TEST262_HIGH_LEVEL_PACKAGES = new Set([
    TEST262_CRATE,
    'swc',
    'swc_compiler_base',
    'swc_error_reporters',
    'swc_transform_common',
]);
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
const isMainPush = eventName === 'push' && gitRef === 'refs/heads/main';
const eventBefore = process.env.GITHUB_EVENT_BEFORE;
const headCommitMessage = process.env.HEAD_COMMIT_MESSAGE ?? '';
const changedBaseRef = isMainPush
    ? eventBefore || 'HEAD^'
    : `origin/${baseBranch}`;

process.stderr.write(`Event: ${eventName}, ref: ${gitRef}, base: ${changedBaseRef}\n`);

const workspacePackages = await getWorkspacePackages();
const allPackages = workspacePackages.map((pkg) => pkg.name);
const allPackageSet = new Set(allPackages);
const allSettings = toMatrixSettings(allPackages, testsYml);
const test262SemanticDependencies = getTransitiveWorkspaceDependencies(
    workspacePackages,
    TEST262_SEMANTIC_ROOTS,
);

try {
    const changedResult = await getChangedPackages(changedBaseRef);
    const changedSet = new Set(
        changedResult.packages.filter((name) => allPackageSet.has(name)),
    );
    const directlyChangedSet = getDirectlyChangedWorkspacePackages(
        changedResult.files,
        workspacePackages,
    );
    const test262Affected =
        [...directlyChangedSet].some(
            (name) =>
                TEST262_HIGH_LEVEL_PACKAGES.has(name) ||
                test262SemanticDependencies.has(name),
        ) ||
        hasTest262InfrastructureChanges(changedResult.files);

    if (test262Affected) {
        changedSet.add(TEST262_CRATE);
        process.stderr.write(
            'Test262 runner or one of its workspace dependencies changed; selecting swc_test262.\n',
        );
    }

    if (isMainPush) {
        if (headCommitMessage.includes('chore: ')) {
            process.stderr.write(
                test262Affected
                    ? 'Running Test262 for a relevant chore push to main.\n'
                    : 'Skipping crate tests for an unrelated chore push to main.\n',
            );
            printSettings(
                test262Affected
                    ? toMatrixSettings([TEST262_CRATE], testsYml)
                    : [{ crate: NOOP_CRATE, os: 'ubuntu-latest' }],
            );
            process.exit(0);
        }

        const mainPackages = test262Affected
            ? allPackages
            : allPackages.filter((name) => name !== TEST262_CRATE);
        process.stderr.write(
            test262Affected
                ? 'Running full matrix, including Test262, for a relevant push to main.\n'
                : 'Running full matrix without Test262 for an unrelated push to main.\n',
        );
        printSettings(toMatrixSettings(mainPackages, testsYml));
        process.exit(0);
    }

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
        const infrastructurePackages = test262Affected
            ? allPackages
            : allPackages.filter((name) => name !== TEST262_CRATE);
        printSettings(toMatrixSettings(infrastructurePackages, testsYml));
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

async function getWorkspacePackages() {
    const rawMetadata = await $`cargo metadata --format-version=1 --all-features --no-deps`;
    const metadata = JSON.parse(rawMetadata.stdout);
    return metadata.packages
        .filter((pkg) => pkg.name !== 'xtask')
        .sort((a, b) => a.name.localeCompare(b.name));
}

function getTransitiveWorkspaceDependencies(packages, rootPackageNames) {
    const packageByName = new Map(packages.map((pkg) => [pkg.name, pkg]));
    const dependencies = new Set(rootPackageNames);
    const pending = [...rootPackageNames];

    while (pending.length > 0) {
        const packageName = pending.pop();
        const pkg = packageByName.get(packageName);
        if (pkg === undefined) {
            continue;
        }

        for (const dependency of pkg.dependencies) {
            const dependencyName = dependency.name;
            if (
                dependency.kind === 'dev' ||
                !packageByName.has(dependencyName) ||
                dependencies.has(dependencyName)
            ) {
                continue;
            }

            dependencies.add(dependencyName);
            pending.push(dependencyName);
        }
    }

    return dependencies;
}

function getDirectlyChangedWorkspacePackages(files, packages) {
    const normalizedFiles = files.map(normalizePath);
    const changed = new Set();

    for (const pkg of packages) {
        const packageDirectory = normalizePath(
            path.relative(repoRootDir, path.dirname(pkg.manifest_path)),
        );
        if (
            normalizedFiles.some(
                (file) =>
                    file === packageDirectory ||
                    file.startsWith(`${packageDirectory}/`),
            )
        ) {
            changed.add(pkg.name);
        }
    }

    return changed;
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

function hasTest262InfrastructureChanges(files) {
    return files.some((rawPath) => {
        const normalizedPath = normalizePath(rawPath);
        return (
            normalizedPath === 'Cargo.lock' ||
            normalizedPath === 'Cargo.toml' ||
            normalizedPath === 'rust-toolchain' ||
            normalizedPath === 'rust-toolchain.toml' ||
            normalizedPath === 'tests.yml' ||
            normalizedPath === '.github/workflows/CI.yml' ||
            normalizedPath === '.github/workflows/test262-runtime.yml' ||
            normalizedPath === '.github/workflows/update-test262.yml' ||
            normalizedPath.startsWith('.github/actions/setup-node/') ||
            normalizedPath === 'scripts/github/get-test-matrix.mjs' ||
            normalizedPath.startsWith('.cargo/')
        );
    });
}

function normalizePath(filePath) {
    return filePath.replaceAll('\\', '/').replace(/^\.\//, '');
}

function printSettings(settings) {
    console.log(JSON.stringify(settings));
}
