import assert from "node:assert/strict";
import {
    cpSync,
    copyFileSync,
    linkSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    readdirSync,
    rmSync,
} from "node:fs";
import { join, resolve } from "node:path";
import {
    artifactInfo,
    identity,
    readJson,
    repository,
    run,
    sha512,
    writeJson,
} from "./common.mjs";
import { validateReport } from "./contracts.mjs";

const [product, target, output, mode = "runtime"] = process.argv.slice(2);
if (!output || !["runtime", "minimum"].includes(mode))
    throw new Error(
        "Usage: runtime.mjs <product> <target> <output.json> [minimum]"
    );
const info = artifactInfo(product, target);
const report = readJson(
    join(repository, "target/native-reports", product + "-" + target + ".json")
);
validateReport(report, identity(product, target, info));
const original = join(info.directory, info.filename);
assert.equal(sha512(readFileSync(original)), report.carrierSha512);
const node = process.env.SWC_RUNTIME_NODE || process.execPath;
const nodeVersion = run(node, ["--version"]);
mkdirSync(join(repository, "target/native-runtime"), { recursive: true });
const stage = mkdtempSync(
    join(repository, "target/native-runtime", product + "-")
);

function smoke(entry, addon, cache) {
    const value = run(
        node,
        [
            join(repository, "scripts/native/smoke.cjs"),
            product,
            entry,
            addon,
            target,
        ],
        { env: { ...process.env, SWC_NATIVE_BINDING_CACHE: cache } }
    );
    return JSON.parse(value.split("\n").at(-1));
}

function variant(name, addon, holdCarrier = false) {
    const directory = join(stage, name);
    cpSync(info.directory, directory, {
        recursive: true,
        filter: (source) => {
            const relative = source
                .slice(info.directory.length)
                .replaceAll("\\", "/");
            return (
                !/(^|\/)(node_modules|artifacts|artifacts_cli|scripts|target)(\/|$)/.test(
                    relative
                ) &&
                !relative.endsWith(".node") &&
                !relative.startsWith("/.native-carrier-")
            );
        },
    });
    const destination = join(directory, info.filename);
    copyFileSync(addon, destination);
    // The runtime deliberately skips self-replacement for hardlinked files.
    // Use links only between disposable copies, never to a release candidate.
    if (holdCarrier) linkSync(destination, join(directory, ".carrier-inode"));
    return { entry: join(directory, "index.js"), addon: destination };
}

function median(values) {
    return [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
}

try {
    const carrier = variant("carrier", original, true);
    const direct = smoke(carrier.entry, carrier.addon, "0");
    // Extract only tarballs already hash-checked by the assembly job, and verify
    // their bytes again here before asking a native process to load them.
    const assemblyDirectory = join(repository, "target/npm", product);
    const assembly = readJson(join(assemblyDirectory, "assembly.json"));
    const installed = join(stage, "installed/node_modules/@swc");
    mkdirSync(installed, { recursive: true });
    for (const name of [info.manifest.name, info.platform.name]) {
        const record = assembly.tarballs.find((item) => item.name === name);
        assert(record, "missing npm tarball " + name);
        const tarball = join(assemblyDirectory, record.filename);
        assert.equal(sha512(readFileSync(tarball)), record.sha512);
        const names = run("tar", ["-tzf", tarball]).split("\n").filter(Boolean);
        assert(
            names.every(
                (name) =>
                    name.startsWith("package/") &&
                    !name.split("/").includes("..") &&
                    !name.includes("\\")
            )
        );
        const directory = join(installed, name.slice("@swc/".length));
        mkdirSync(directory);
        run("tar", ["-xf", tarball, "--strip-components=1", "-C", directory]);
    }
    const installedAddon = join(
        installed,
        product + "-" + info.abi,
        info.filename
    );
    assert.equal(sha512(readFileSync(installedAddon)), report.carrierSha512);
    const packed = smoke(
        join(installed, product, "index.js"),
        installedAddon,
        "0"
    );
    assert.deepEqual(packed.exports, direct.exports);
    const result = {
        ...identity(product, target, info),
        kind: mode,
        node: nodeVersion,
        carrierSha512: report.carrierSha512,
        npmTarballSha512: assembly.records.find(
            (item) => item.target === target
        ).npmTarballSha512,
        direct: true,
        installed: true,
    };
    if (mode === "runtime") {
        const rawPath = join(
            repository,
            "target/native-raw",
            product + "-" + target + ".node"
        );
        assert.equal(sha512(readFileSync(rawPath)), report.rawSha512);
        const raw = variant("raw", rawPath);
        const baseline = smoke(raw.entry, raw.addon, "0");
        assert.deepEqual(
            direct.exports,
            baseline.exports,
            "carrier changed N-API exports"
        );
        const rawMs = [],
            coldMs = [],
            warmMs = [];
        const warmCache = join(stage, "warm-cache");
        smoke(carrier.entry, carrier.addon, warmCache);
        for (let sample = 0; sample < 15; sample++) {
            rawMs.push(smoke(raw.entry, raw.addon, "0").loadMs);
            coldMs.push(
                smoke(
                    carrier.entry,
                    carrier.addon,
                    join(stage, "cold-" + sample)
                ).loadMs
            );
            warmMs.push(smoke(carrier.entry, carrier.addon, warmCache).loadMs);
        }
        Object.assign(result, {
            samples: 15,
            rawMs: median(rawMs),
            coldMs: median(coldMs),
            warmMs: median(warmMs),
        });
        const materialized = [];
        function inspectCache(directory) {
            for (const entry of readdirSync(directory, {
                withFileTypes: true,
            })) {
                const file = join(directory, entry.name);
                if (entry.isDirectory()) inspectCache(file);
                else if (entry.name.endsWith(".node")) materialized.push(file);
            }
        }
        inspectCache(warmCache);
        assert.equal(
            materialized.length,
            1,
            "warm load did not materialize the expected raw image"
        );
        assert.equal(sha512(readFileSync(materialized[0])), report.rawSha512);
        result.materializedSha512 = report.rawSha512;
        result.coldOverheadMs = result.coldMs - result.rawMs;
        result.warmOverheadMs = result.warmMs - result.rawMs;
        // Keep measured evidence in failed job logs; no success report is written on failure.
        console.log(JSON.stringify(result));
        if (target.startsWith("x86_64-")) {
            assert(
                result.coldOverheadMs <= 100,
                "median cold-load overhead exceeds 100 ms"
            );
            assert(
                result.warmOverheadMs <= 25,
                "median warm-cache overhead exceeds 25 ms"
            );
        }
        assert.equal(sha512(readFileSync(carrier.addon)), report.carrierSha512);
    }
    assert.equal(sha512(readFileSync(original)), report.carrierSha512);
    writeJson(resolve(output), result);
    console.log(JSON.stringify(result));
} finally {
    rmSync(stage, { recursive: true, force: true });
}
