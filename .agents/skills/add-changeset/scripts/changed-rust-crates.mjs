#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { relative, sep } from "node:path";
import { cwd, exit } from "node:process";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
    printHelp();
    exit(0);
}

const repoRoot = run("git", ["rev-parse", "--show-toplevel"]).stdout.trim();
const head = args.head ?? "HEAD";
const base = args.base ?? detectBase(head);
const metadata = JSON.parse(
    run("cargo", ["metadata", "--format-version", "1", "--no-deps"], {
        cwd: repoRoot,
    }).stdout,
);

const packages = workspacePackages(metadata, repoRoot);
const changedPaths = collectChangedPaths(base, head);
const report = buildReport(packages, changedPaths);

if (args.json) {
    process.stdout.write(
        `${JSON.stringify(
            {
                base,
                head,
                publishableCrates: report.publishableCrates,
                privateCrates: report.privateCrates,
                workspaceFiles: report.workspaceFiles,
                unmappedFiles: report.unmappedFiles,
            },
            null,
            2,
        )}\n`,
    );
} else {
    printReport(base, head, report);
}

function parseArgs(rawArgs) {
    const parsed = {
        base: null,
        head: null,
        help: false,
        includePrivate: false,
        json: false,
    };

    for (let i = 0; i < rawArgs.length; i += 1) {
        const arg = rawArgs[i];

        if (arg === "--help" || arg === "-h") {
            parsed.help = true;
        } else if (arg === "--json") {
            parsed.json = true;
        } else if (arg === "--include-private") {
            parsed.includePrivate = true;
        } else if (arg === "--base") {
            parsed.base = requireValue(rawArgs, ++i, arg);
        } else if (arg.startsWith("--base=")) {
            parsed.base = arg.slice("--base=".length);
        } else if (arg === "--head") {
            parsed.head = requireValue(rawArgs, ++i, arg);
        } else if (arg.startsWith("--head=")) {
            parsed.head = arg.slice("--head=".length);
        } else {
            fail(`Unknown argument: ${arg}`);
        }
    }

    return parsed;
}

function requireValue(rawArgs, index, flag) {
    const value = rawArgs[index];

    if (!value || value.startsWith("--")) {
        fail(`Missing value for ${flag}`);
    }

    return value;
}

function printHelp() {
    process.stdout.write(`Usage: changed-rust-crates.mjs [options]

Lists Rust workspace crates touched by the current PR diff.

Options:
  --base <rev>          Base revision or branch. Defaults to a merge base with origin/main, upstream/main, main, origin/master, or master.
  --head <rev>          Head revision. Defaults to HEAD.
  --include-private     Show publish=false workspace crates in the text report.
  --json                Print machine-readable JSON.
  -h, --help            Show this help.
`);
}

function detectBase(head) {
    const candidates = [
        "origin/main",
        "upstream/main",
        "main",
        "origin/master",
        "master",
    ];

    for (const candidate of candidates) {
        const exists = run("git", ["rev-parse", "--verify", candidate], {
            allowFailure: true,
        });

        if (!exists.ok) {
            continue;
        }

        const mergeBase = run("git", ["merge-base", head, candidate], {
            allowFailure: true,
        });

        if (mergeBase.ok && mergeBase.stdout.trim()) {
            return mergeBase.stdout.trim();
        }
    }

    fail("Could not detect a PR base. Pass --base <rev> explicitly.");
}

function workspacePackages(metadata, repoRoot) {
    const workspaceMembers = new Set(metadata.workspace_members ?? []);

    return metadata.packages
        .filter((pkg) => workspaceMembers.has(pkg.id))
        .map((pkg) => {
            const manifestPath = normalizePath(relative(repoRoot, pkg.manifest_path));
            const root = normalizePath(manifestPath.replace(/(^|\/)Cargo\.toml$/, ""));

            return {
                name: pkg.name,
                publishable: !Array.isArray(pkg.publish) || pkg.publish.length !== 0,
                root: root === "" ? "." : root,
            };
        })
        .sort((a, b) => b.root.length - a.root.length);
}

function collectChangedPaths(base, head) {
    const paths = new Set();
    const diffArgs = ["diff", "--name-only", "--diff-filter=ACMRD"];

    addLines(paths, run("git", [...diffArgs, `${base}...${head}`]).stdout);

    if (head === "HEAD") {
        addLines(paths, run("git", [...diffArgs, "--cached"]).stdout);
        addLines(paths, run("git", diffArgs).stdout);
        addLines(
            paths,
            run("git", ["ls-files", "--others", "--exclude-standard"]).stdout,
        );
    }

    return [...paths].map(normalizePath).sort();
}

function buildReport(packages, changedPaths) {
    const publishableByName = new Map();
    const privateByName = new Map();
    const workspaceFiles = [];
    const unmappedFiles = [];

    for (const path of changedPaths) {
        const pkg = packages.find((candidate) => pathBelongsToPackage(path, candidate));

        if (!pkg) {
            if (isWorkspaceLevelPath(path)) {
                workspaceFiles.push(path);
            } else {
                unmappedFiles.push(path);
            }

            continue;
        }

        const relativePath = pkg.root === "." ? path : path.slice(pkg.root.length + 1);
        const collection = pkg.publishable ? publishableByName : privateByName;
        const crate = collection.get(pkg.name) ?? {
            name: pkg.name,
            root: pkg.root,
            paths: [],
        };

        crate.paths.push(relativePath || "Cargo.toml");
        collection.set(pkg.name, crate);
    }

    return {
        publishableCrates: sortCrates([...publishableByName.values()]),
        privateCrates: sortCrates([...privateByName.values()]),
        workspaceFiles,
        unmappedFiles,
    };
}

function pathBelongsToPackage(path, pkg) {
    if (pkg.root === ".") {
        return true;
    }

    return path === pkg.root || path.startsWith(`${pkg.root}/`);
}

function isWorkspaceLevelPath(path) {
    return (
        path === "Cargo.toml" ||
        path === "Cargo.lock" ||
        path === "rust-toolchain" ||
        path.startsWith(".cargo/") ||
        path.startsWith(".changeset/") ||
        path.startsWith("tools/swc-releaser/")
    );
}

function sortCrates(crates) {
    return crates
        .map((crate) => ({
            ...crate,
            paths: [...new Set(crate.paths)].sort(),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
}

function printReport(base, head, report) {
    process.stdout.write(`Base: ${base}\nHead: ${head}\n\n`);

    printCrateSection("Publishable Rust crates touched", report.publishableCrates);

    if (args.includePrivate) {
        printCrateSection("Private Rust crates touched", report.privateCrates);
    } else if (report.privateCrates.length > 0) {
        process.stdout.write(
            `Private Rust crates touched: ${report.privateCrates.length} (use --include-private to show)\n\n`,
        );
    }

    printPathSection(
        "Workspace-level files requiring manual review",
        report.workspaceFiles,
    );
    printPathSection("Unmapped changed files", report.unmappedFiles);

    if (report.publishableCrates.length > 0) {
        process.stdout.write("Changeset front matter skeleton:\n---\n");

        for (const crate of report.publishableCrates) {
            process.stdout.write(`${crate.name}: patch\n`);
        }

        process.stdout.write("---\n");
    }
}

function printCrateSection(title, crates) {
    process.stdout.write(`${title}:\n`);

    if (crates.length === 0) {
        process.stdout.write("- none\n\n");
        return;
    }

    for (const crate of crates) {
        const samplePaths = crate.paths.slice(0, 5).join(", ");
        const suffix = crate.paths.length > 5 ? ", ..." : "";
        process.stdout.write(`- ${crate.name} (${crate.root}): ${samplePaths}${suffix}\n`);
    }

    process.stdout.write("\n");
}

function printPathSection(title, paths) {
    if (paths.length === 0) {
        return;
    }

    process.stdout.write(`${title}:\n`);

    for (const path of paths) {
        process.stdout.write(`- ${path}\n`);
    }

    process.stdout.write("\n");
}

function addLines(target, text) {
    for (const line of text.split("\n")) {
        const path = line.trim();

        if (path) {
            target.add(path);
        }
    }
}

function normalizePath(path) {
    return path.split(sep).join("/");
}

function run(command, commandArgs, options = {}) {
    const result = spawnSync(command, commandArgs, {
        cwd: options.cwd ?? cwd(),
        encoding: "utf8",
    });

    const ok = result.status === 0;

    if (!ok && !options.allowFailure) {
        fail(
            `Command failed: ${command} ${commandArgs.join(" ")}\n${result.stderr.trim()}`,
        );
    }

    return {
        ok,
        stdout: result.stdout ?? "",
        stderr: result.stderr ?? "",
    };
}

function fail(message) {
    process.stderr.write(`${message}\n`);
    exit(1);
}
