import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const version = process.argv[2];
if (!version) {
    throw new Error("usage: node scripts/resolve-npm-tag.mjs <version>");
}

if (version.includes("nightly")) {
    process.stdout.write("nightly\n");
    process.exit(0);
}

const major = /^(\d+)\./.exec(version)?.[1];
if (!major) {
    throw new Error(`invalid npm version: ${version}`);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const releaseLines = JSON.parse(
    await readFile(path.join(root, ".github/npm-release-lines.json"), "utf8")
);
const tag = releaseLines[major];

if (!tag) {
    throw new Error(`npm major ${major} has no configured dist-tag`);
}

process.stdout.write(`${tag}\n`);
