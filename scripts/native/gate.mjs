import assert from "node:assert/strict";
import {
    appendFileSync,
    readdirSync,
    readFileSync,
    mkdtempSync,
    writeFileSync,
    rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
    artifactInfo,
    identity,
    readJson,
    sha512,
    verifyCarrier,
    writeJson,
} from "./common.mjs";
import { containsPayload, validateInventory } from "./contracts.mjs";
import { minimumNodes, products, targets } from "./targets.mjs";
import { inspectTarball, tarMember } from "./tarballs.mjs";

const [preparedDirectory, runtimeDirectory, output] = process.argv.slice(2);
if (!output)
    throw new Error(
        "Usage: gate.mjs <prepared-directory> <runtime-reports-directory> <gate.json>"
    );
const prepared = resolve(preparedDirectory);
const first = identity(
    "core",
    Object.keys(targets)[0],
    artifactInfo("core", Object.keys(targets)[0])
);
const expected = {
    schemaVersion: 1,
    version: first.version,
    buildType: first.buildType,
    sourceCommit: first.sourceCommit,
};
const reports = [];
const tarballs = [];
const stage = mkdtempSync(join(tmpdir(), "swc-native-gate-"));
try {
    for (const product of products) {
        const directory = join(
            prepared,
            "native-npm-" +
                first.buildType +
                "-" +
                product +
                "-" +
                first.version
        );
        const assembly = readJson(join(directory, "assembly.json"));
        assert.equal(assembly.product, product);
        for (const [key, value] of Object.entries(expected))
            assert.deepEqual(assembly[key], value, key);
        assert.equal(assembly.records.length, 12);
        assert.equal(assembly.tarballs.length, 13);
        reports.push(...assembly.records);
        const seen = new Set();
        for (const target of Object.keys(targets)) {
            const info = artifactInfo(product, target);
            const report = assembly.records.find(
                (item) => item.target === target
            );
            assert(report, "missing target " + target);
            assert.equal(report.product, product);
            assert.equal(report.filename, info.filename);
            const entry = assembly.tarballs.find(
                (item) => item.name === info.platform.name
            );
            assert(
                entry && !seen.has(entry.filename),
                "missing or duplicate platform tarball"
            );
            assert.equal(
                entry.filename,
                info.platform.name.slice(1).replace("/", "-") +
                    "-" +
                    first.version +
                    ".tgz"
            );
            seen.add(entry.filename);
            const tarball = join(directory, entry.filename);
            const actual = inspectTarball(tarball, info.platform, report);
            assert.equal(actual.sha512, entry.sha512);
            assert.equal(actual.size, entry.size);
            assert.equal(actual.sha512, report.npmTarballSha512);
            assert.equal(actual.size, report.npmTarballSize);
            const bytes = tarMember(tarball, info.filename);
            if (info.carrier) {
                const candidate = join(stage, "carrier.node");
                writeFileSync(candidate, bytes);
                const verified = verifyCarrier(candidate, target);
                for (const [key, value] of Object.entries(verified))
                    assert.deepEqual(report[key], value, key);
            } else {
                assert(
                    !containsPayload(bytes),
                    "excluded npm addon is a carrier"
                );
            }
            if (product === "core") {
                for (const [name, hash] of Object.entries(report.cli)) {
                    assert.equal(
                        sha512(
                            readFileSync(
                                join(
                                    directory,
                                    "cli",
                                    "swc-" +
                                        info.abi +
                                        (name.endsWith(".exe") ? ".exe" : "")
                                )
                            )
                        ),
                        hash
                    );
                }
            }
        }
        const info = artifactInfo(product, Object.keys(targets)[0]);
        const main = assembly.tarballs.find(
            (item) => item.name === info.manifest.name
        );
        assert(main && !seen.has(main.filename), "missing main tarball");
        assert.equal(
            main.filename,
            "swc-" + product + "-" + first.version + ".tgz"
        );
        const optionalDependencies = Object.fromEntries(
            Object.values(targets).map(({ abi }) => [
                "@swc/" + product + "-" + abi,
                first.version,
            ])
        );
        const actual = inspectTarball(join(directory, main.filename), {
            ...info.manifest,
            optionalDependencies,
        });
        assert.equal(actual.sha512, main.sha512);
        assert.equal(actual.size, main.size);
        tarballs.push(
            ...assembly.tarballs.map((entry) => ({ ...entry, product }))
        );
    }
    const totals = validateInventory(reports, expected);
    const runtime = readdirSync(resolve(runtimeDirectory))
        .filter((file) => file.endsWith(".json"))
        .map((file) => readJson(join(resolve(runtimeDirectory), file)));
    const seen = new Set();
    for (const result of runtime) {
        for (const [key, value] of Object.entries(expected))
            assert.deepEqual(result[key], value, key);
        assert.equal(result.direct, true);
        assert.equal(result.installed, true);
        const artifact = reports.find(
            (item) =>
                item.product === result.product && item.target === result.target
        );
        assert(artifact?.kind === "carrier");
        assert.equal(result.carrierSha512, artifact.carrierSha512);
        assert.equal(result.npmTarballSha512, artifact.npmTarballSha512);
        const version =
            result.kind === "runtime"
                ? result.node.match(/^v(20|22)\./)?.[1]
                : result.node.slice(1);
        assert(version, "unexpected runtime version");
        const key = [result.kind, result.product, result.target, version].join(
            "/"
        );
        assert(!seen.has(key), "duplicate runtime evidence");
        seen.add(key);
        if (result.kind === "runtime") {
            assert.equal(result.materializedSha512, artifact.rawSha512);
            assert.equal(result.samples, 15);
            for (const field of [
                "rawMs",
                "coldMs",
                "warmMs",
                "coldOverheadMs",
                "warmOverheadMs",
            ])
                assert(Number.isFinite(result[field]));
            if (result.target.startsWith("x86_64-")) {
                assert(
                    result.coldOverheadMs <= 100 && result.warmOverheadMs <= 25,
                    "load overhead exceeds release budget"
                );
            }
        } else assert.equal(result.kind, "minimum");
    }
    for (const product of products) {
        for (const [target, info] of Object.entries(targets)) {
            if (info.carrier)
                for (const node of ["20", "22"]) {
                    assert(
                        seen.delete(
                            ["runtime", product, target, node].join("/")
                        ),
                        "missing native runtime check " +
                            product +
                            "/" +
                            target +
                            "/" +
                            node
                    );
                }
        }
        for (const node of minimumNodes[product]) {
            assert(
                seen.delete(
                    ["minimum", product, "x86_64-unknown-linux-gnu", node].join(
                        "/"
                    )
                ),
                "missing minimum Node smoke"
            );
        }
    }
    assert.equal(seen.size, 0, "unexpected runtime evidence");
    const gate = { ...expected, totals, reports, runtime, tarballs };
    writeJson(resolve(output), gate);
    if (process.env.GITHUB_STEP_SUMMARY) {
        const rows = reports.map((r) =>
            [
                r.product,
                r.target,
                r.kind,
                r.rawSize,
                r.payloadSize,
                r.carrierSize || "—",
                (r.reduction * 100).toFixed(2) + "%",
                r.npmTarballSize,
            ].join(" | ")
        );
        const times = runtime
            .filter((r) => r.kind === "runtime")
            .map((r) =>
                [
                    r.product,
                    r.target,
                    r.node,
                    r.rawMs.toFixed(2),
                    r.coldMs.toFixed(2),
                    r.warmMs.toFixed(2),
                ].join(" | ")
            );
        appendFileSync(
            process.env.GITHUB_STEP_SUMMARY,
            "## Native release verification\n\n" +
                totals.selected +
                " carriers; " +
                totals.raw +
                " raw addons; " +
                (totals.reduction * 100).toFixed(2) +
                "% aggregate selected reduction.\n\n" +
                "Product | Target | Kind | Raw bytes | Payload bytes | Carrier bytes | Reduction | npm bytes\n" +
                "--- | --- | --- | ---: | ---: | ---: | ---: | ---:\n" +
                rows.join("\n") +
                "\n\nProduct | Target | Node | Raw ms | Cold ms | Warm ms\n--- | --- | --- | ---: | ---: | ---:\n" +
                times.join("\n") +
                "\n"
        );
    }
    console.log(JSON.stringify(totals));
} finally {
    rmSync(stage, { recursive: true, force: true });
}
