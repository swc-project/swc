import assert from "node:assert/strict";
import { mkdtempSync, realpathSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

// Product-approved startup overhead, measured against the matching raw load.
// Runtime checks and the final release gate share these limits and still fail
// when either 15-sample median exceeds its budget.
export const x64LoadBudgets = Object.freeze({
    coldOverheadMs: 500,
    warmOverheadMs: 100,
});

// Checkout ancestors can belong to the host runner while Docker runs as root.
// A canonical home path also avoids symlink ancestors such as macOS /var.
export function createMeasurementCache() {
    return realpathSync.native(
        mkdtempSync(
            join(realpathSync.native(homedir()), ".swc-native-runtime-")
        )
    );
}

function median(values) {
    return [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
}

export function measureLoads({ raw, carrier, copyRaw, smoke, cacheRoot }) {
    const rawMs = [],
        rawColdMs = [],
        coldMs = [],
        warmMs = [];
    const warmCache = join(cacheRoot, "warm");
    smoke(carrier.entry, carrier.addon, warmCache);
    for (let sample = 0; sample < 15; sample++) {
        rawMs.push(smoke(raw.entry, raw.addon, "0").loadMs);
        // Copying is outside smoke's require timer. Both new images belong on
        // the cache volume: Windows runners put checkout and home on different
        // drives with different first-load costs. Each raw sample uses a fresh
        // file, including for Rosetta/code-signing work on the first load.
        const coldRaw = copyRaw(sample, cacheRoot);
        rawColdMs.push(smoke(coldRaw.entry, coldRaw.addon, "0").loadMs);
        coldMs.push(
            smoke(
                carrier.entry,
                carrier.addon,
                join(cacheRoot, "cold-" + sample)
            ).loadMs
        );
        warmMs.push(smoke(carrier.entry, carrier.addon, warmCache).loadMs);
    }
    const result = {
        samples: 15,
        rawMs: median(rawMs),
        rawColdMs: median(rawColdMs),
        coldMs: median(coldMs),
        warmMs: median(warmMs),
    };
    result.coldOverheadMs = result.coldMs - result.rawColdMs;
    result.warmOverheadMs = result.warmMs - result.rawMs;
    return result;
}

// Share validation with the final release gate: old or internally inconsistent
// evidence cannot silently compare cold carriers with an already loaded raw.
export function validateMeasurements(result) {
    assert.equal(result.samples, 15);
    for (const field of [
        "rawMs",
        "rawColdMs",
        "coldMs",
        "warmMs",
        "coldOverheadMs",
        "warmOverheadMs",
    ])
        assert(Number.isFinite(result[field]), "missing or invalid " + field);
    for (const field of ["rawMs", "rawColdMs", "coldMs", "warmMs"])
        assert(result[field] >= 0, "negative " + field);
    assert.equal(result.coldOverheadMs, result.coldMs - result.rawColdMs);
    assert.equal(result.warmOverheadMs, result.warmMs - result.rawMs);
    if (result.target.startsWith("x86_64-")) {
        assert(
            result.coldOverheadMs <= x64LoadBudgets.coldOverheadMs,
            `median cold-load overhead ${result.coldOverheadMs} ms exceeds ${x64LoadBudgets.coldOverheadMs} ms`
        );
        assert(
            result.warmOverheadMs <= x64LoadBudgets.warmOverheadMs,
            `median warm-cache overhead ${result.warmOverheadMs} ms exceeds ${x64LoadBudgets.warmOverheadMs} ms`
        );
    }
}
