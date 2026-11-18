import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { artifactInfo, identity, readJson, run, sha512 } from "./common.mjs";
import { validateInventory } from "./contracts.mjs";
import { targets } from "./targets.mjs";
import { tarMember } from "./tarballs.mjs";

const [product, preparedDirectory, gateFile] = process.argv.slice(2);
const githubRepository = process.env.GITHUB_REPOSITORY;
assert.equal(githubRepository, "swc-project/swc");
const info = artifactInfo(product, Object.keys(targets)[0]);
const current = identity(product, Object.keys(targets)[0], info);
const expected = {
    schemaVersion: 1,
    version: current.version,
    buildType: current.buildType,
    sourceCommit: current.sourceCommit,
};
const gate = readJson(resolve(gateFile));
for (const [key, value] of Object.entries(expected))
    assert.deepEqual(gate[key], value);
validateInventory(gate.reports, expected);
const packages = gate.tarballs.filter((entry) => entry.product === product);
assert.equal(packages.length, 13);
// Verify the entire product before making the first registry write.
for (const entry of packages) {
    assert.equal(
        entry.filename,
        entry.name.slice(1).replace("/", "-") + "-" + current.version + ".tgz"
    );
    const bytes = readFileSync(
        join(resolve(preparedDirectory), entry.filename)
    );
    assert.equal(bytes.length, entry.size);
    assert.equal(sha512(bytes), entry.sha512);
}
for (const report of gate.reports.filter((r) => r.product === product)) {
    if (product === "core")
        for (const [name, hash] of Object.entries(report.cli)) {
            const cli =
                "swc-" +
                targets[report.target].abi +
                (name.endsWith(".exe") ? ".exe" : "");
            assert.equal(
                sha512(
                    readFileSync(join(resolve(preparedDirectory), "cli", cli))
                ),
                hash
            );
        }
}
for (const entry of packages) {
    run(
        "npm",
        [
            "publish",
            join(resolve(preparedDirectory), entry.filename),
            "--ignore-scripts",
            "--access",
            "public",
            "--provenance",
            "--tag",
            current.version.includes("nightly") ? "nightly" : "latest",
        ],
        { stdio: "inherit" }
    );
}

// Preserve the existing GitHub addon assets, but upload only after the common
// release gate. Concurrent products may observe the same newly created release.
const tag = "v" + current.version;
const releaseArgs = ["--repo", githubRepository];
try {
    run("gh", ["release", "view", tag, ...releaseArgs]);
} catch {
    try {
        run(
            "gh",
            [
                "release",
                "create",
                tag,
                "--verify-tag",
                "--title",
                tag,
                ...(/alpha|beta|rc/.test(current.version)
                    ? ["--prerelease"]
                    : []),
                ...releaseArgs,
            ],
            { stdio: "inherit" }
        );
    } catch {
        // Another product may have created it between our view and create.
        run("gh", ["release", "view", tag, ...releaseArgs]);
    }
}
const stage = mkdtempSync(join(tmpdir(), "swc-release-assets-"));
try {
    const assets = [];
    for (const report of gate.reports.filter((r) => r.product === product)) {
        const entry = packages.find(
            (item) =>
                item.name ===
                "@swc/" + product + "-" + targets[report.target].abi
        );
        const bytes = tarMember(
            join(resolve(preparedDirectory), entry.filename),
            report.filename
        );
        assert.equal(
            sha512(bytes),
            report.kind === "carrier" ? report.carrierSha512 : report.rawSha512
        );
        const file = join(stage, report.filename);
        writeFileSync(file, bytes);
        assets.push(file);
    }
    run("gh", ["release", "upload", tag, ...assets, ...releaseArgs], {
        stdio: "inherit",
    });
} finally {
    rmSync(stage, { recursive: true, force: true });
}
