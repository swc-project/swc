// Compare signed macOS core carriers built around the exact same raw addon.
// Build packages/core's JS first; copy/sign/build work is outside require timers.
import assert from "node:assert/strict";
import {
    copyFileSync,
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    rmSync,
    statSync,
    symlinkSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { repository, run, sha512, writeJson } from "./common.mjs";
import { createMeasurementCache } from "./measurements.mjs";
import { copyMeasurementCarrier } from "./measurement-files.mjs";

const [raw, before, after, output] = process.argv
    .slice(2)
    .map((path) => resolve(path));
assert(
    output,
    "Usage: compare-startup.mjs <raw.node> <before.node> <after.node> <output.json>"
);
assert.equal(
    process.platform,
    "darwin",
    "this comparison exercises macOS loading"
);
const target =
    process.arch === "arm64" ? "aarch64-apple-darwin" : "x86_64-apple-darwin";
const filename = "swc.darwin-" + process.arch + ".node";
const rawHash = sha512(readFileSync(raw));
const sources = { raw, before, after };
const hashes = Object.fromEntries(
    Object.entries(sources).map(([name, path]) => [
        name,
        sha512(readFileSync(path)),
    ])
);
const stage = createMeasurementCache();
const median = (values) =>
    [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

function variant(name, source, warm = false) {
    const directory = join(stage, name);
    mkdirSync(directory);
    const core = join(repository, "packages/core");
    for (const file of readdirSync(core)) {
        if (file.endsWith(".js") || file === "package.json")
            copyFileSync(join(core, file), join(directory, file));
    }
    symlinkSync(join(core, "node_modules"), join(directory, "node_modules"));
    const addon = join(directory, filename);
    if (warm) copyMeasurementCarrier(source, addon);
    else copyFileSync(source, addon);
    assert.equal(statSync(addon).nlink, warm ? 2 : 1);
    return { directory, addon, cache: join(directory, "cache") };
}

function smoke(sample) {
    // A fresh child and an isolated default cache match a normal installation.
    const env = { ...process.env, XDG_CACHE_HOME: sample.cache };
    delete env.SWC_NATIVE_BINDING_CACHE;
    return JSON.parse(
        run(
            process.execPath,
            [
                join(repository, "scripts/native/smoke.cjs"),
                "core",
                join(sample.directory, "index.js"),
                sample.addon,
                target,
            ],
            { env }
        )
            .split("\n")
            .at(-1)
    ).loadMs;
}

function cacheImages(root) {
    if (!existsSync(root)) return [];
    return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
        const path = join(root, entry.name);
        return entry.isDirectory()
            ? cacheImages(path)
            : entry.name.endsWith(".node")
            ? [path]
            : [];
    });
}

const result = {
    target,
    node: process.version,
    samples: 15,
    rounds: [],
    hashes,
};
try {
    for (let round = 0; round < 3; round++) {
        const values = Object.fromEntries(
            Object.keys(sources).map((name) => [
                name,
                { cold: [], second: [], allocated: [] },
            ])
        );
        const warm = {};
        const warmMs = { before: [], after: [] };
        for (const name of ["before", "after"]) {
            warm[name] = variant(`${round}-${name}-warm`, sources[name], true);
            smoke(warm[name]);
        }
        for (let sample = 0; sample < 15; sample++) {
            // Alternate the order to avoid consistently favoring one carrier.
            for (const name of sample % 2
                ? ["after", "before", "raw"]
                : ["raw", "before", "after"]) {
                const installed = variant(
                    `${round}-${sample}-${name}`,
                    sources[name]
                );
                assert(
                    !existsSync(installed.cache),
                    "cold cache must be absent"
                );
                values[name].cold.push(smoke(installed));
                values[name].second.push(smoke(installed));
                const images = cacheImages(installed.cache);
                if (name === "before") {
                    assert.equal(
                        sha512(readFileSync(installed.addon)),
                        rawHash,
                        "baseline must exercise APFS replacement"
                    );
                    assert.equal(images.length, 0);
                } else if (name === "after") {
                    assert.equal(
                        sha512(readFileSync(installed.addon)),
                        hashes.after
                    );
                    assert.equal(images.length, 1);
                    assert.equal(sha512(readFileSync(images[0])), rawHash);
                }
                values[name].allocated.push(
                    [installed.addon, ...images].reduce(
                        (bytes, file) => bytes + statSync(file).blocks * 512,
                        0
                    )
                );
                rmSync(installed.directory, { recursive: true, force: true });
            }
            for (const name of ["before", "after"])
                warmMs[name].push(smoke(warm[name]));
        }
        const summary = Object.fromEntries(
            Object.entries(values).map(([name, value]) => [
                name,
                {
                    coldMs: median(value.cold),
                    secondMs: median(value.second),
                    allocatedBytes: median(value.allocated),
                    ...(warmMs[name]
                        ? { warmCacheMs: median(warmMs[name]) }
                        : {}),
                },
            ])
        );
        const improvement = 1 - summary.after.coldMs / summary.before.coldMs;
        result.rounds.push({ summary, improvement, values, warmMs });
        console.log(JSON.stringify({ round: round + 1, summary, improvement }));
        for (const item of Object.values(warm))
            rmSync(item.directory, { recursive: true, force: true });
    }
    writeJson(output, result);
    assert(
        result.rounds.every((round) => round.improvement >= 0.05),
        "first-load improvement must reach 5% in all three rounds"
    );
    for (const [name, path] of Object.entries(sources))
        assert.equal(
            sha512(readFileSync(path)),
            hashes[name],
            "source artifact changed"
        );
} finally {
    rmSync(stage, { recursive: true, force: true });
}
