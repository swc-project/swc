import test from "node:test";
import assert from "node:assert/strict";
import { realpathSync, rmSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import {
    createMeasurementCache,
    measureLoads,
    validateMeasurements,
} from "./measurements.mjs";

test("measurement cache belongs to the current home outside the checkout", () => {
    const cache = createMeasurementCache();
    try {
        assert.equal(dirname(cache), realpathSync.native(homedir()));
        assert.equal(cache, realpathSync.native(cache));
        if (process.getuid) assert.equal(statSync(cache).uid, process.getuid());
    } finally {
        rmSync(cache, { recursive: true, force: true });
    }
});

test("cold samples copy raw before loading while warm samples reuse files", () => {
    const copied = new Set();
    const copiedCarriers = new Set();
    const caches = new Map();
    const loads = new Map();
    const result = measureLoads({
        raw: { entry: "raw", addon: "raw.node" },
        carrier: { entry: "carrier", addon: "carrier.node" },
        cacheRoot: "cache",
        copyRaw(sample) {
            const file = "raw-cold-" + sample;
            assert(!copied.has(file));
            copied.add(file);
            return { entry: file, addon: file + ".node" };
        },
        copyCarrier(sample) {
            const file = "carrier-cold-" + sample;
            assert(!copiedCarriers.has(file));
            copiedCarriers.add(file);
            return { entry: file, addon: file + ".node" };
        },
        smoke(entry, addon, cache) {
            assert.equal(addon, entry + ".node");
            loads.set(entry, (loads.get(entry) || 0) + 1);
            if (entry.startsWith("raw-cold-")) {
                assert(copied.has(entry), "copy must precede loading");
                return { loadMs: 1000 + Number(entry.slice(9)) };
            }
            if (entry === "raw") return { loadMs: 10 };
            if (cache !== join("cache", "warm"))
                assert(
                    copiedCarriers.has(entry),
                    "carrier copy must precede loading"
                );
            caches.set(cache, (caches.get(cache) || 0) + 1);
            return { loadMs: cache === join("cache", "warm") ? 35 : 1107 };
        },
    });
    assert.equal(copied.size, 15);
    for (const file of copied) assert.equal(loads.get(file), 1);
    assert.equal(copiedCarriers.size, 15);
    for (const file of copiedCarriers) assert.equal(loads.get(file), 1);
    assert.equal(loads.get("carrier"), 16);
    assert.equal(loads.get("raw"), 15);
    assert.equal(caches.get(join("cache", "warm")), 16);
    for (let i = 0; i < 15; i++)
        assert.equal(caches.get(join("cache", "cold-" + i)), 1);
    assert.deepEqual(result, {
        samples: 15,
        rawMs: 10,
        rawColdMs: 1007,
        coldMs: 1107,
        warmMs: 35,
        coldOverheadMs: 100,
        warmOverheadMs: 25,
    });
    validateMeasurements({ ...result, target: "x86_64-apple-darwin" });
});

test("gate rejects missing cold baseline, incorrect arithmetic and exceeded budgets", () => {
    const valid = {
        target: "x86_64-apple-darwin",
        samples: 15,
        rawMs: 10,
        rawColdMs: 1000,
        coldMs: 1500,
        warmMs: 135,
        coldOverheadMs: 500,
        warmOverheadMs: 125,
    };
    validateMeasurements(valid);
    for (const field of [
        "rawMs",
        "rawColdMs",
        "coldMs",
        "warmMs",
        "coldOverheadMs",
        "warmOverheadMs",
    ]) {
        for (const invalid of [undefined, NaN, Infinity])
            assert.throws(() =>
                validateMeasurements({ ...valid, [field]: invalid })
            );
    }
    for (const change of [
        { coldOverheadMs: 0 },
        { warmOverheadMs: 0 },
        { samples: 14 },
        { coldMs: 1501, coldOverheadMs: 501 },
        { warmMs: 136, warmOverheadMs: 126 },
    ])
        assert.throws(() => validateMeasurements({ ...valid, ...change }));
});

test("all x64 targets share the approved startup budgets", () => {
    for (const target of [
        "x86_64-apple-darwin",
        "x86_64-pc-windows-msvc",
        "x86_64-unknown-linux-gnu",
        "x86_64-unknown-linux-musl",
    ]) {
        const result = {
            target,
            samples: 15,
            rawMs: 10,
            rawColdMs: 1000,
            coldMs: 1500,
            warmMs: 135,
            coldOverheadMs: 500,
            warmOverheadMs: 125,
        };
        validateMeasurements(result);
        assert.throws(
            () =>
                validateMeasurements({
                    ...result,
                    coldMs: 1501,
                    coldOverheadMs: 501,
                }),
            /cold-load overhead 501 ms exceeds 500 ms/
        );
        assert.throws(
            () =>
                validateMeasurements({
                    ...result,
                    warmMs: 136,
                    warmOverheadMs: 126,
                }),
            /warm-cache overhead 126 ms exceeds 125 ms/
        );
    }
});

test("cold raw copies use the cache volume instead of the checkout volume", () => {
    const cacheRoot = join("user-home", "measurement");
    const copies = [];
    measureLoads({
        raw: {
            entry: "checkout/raw/index.js",
            addon: "checkout/raw/binding.node",
        },
        carrier: {
            entry: "checkout/carrier/index.js",
            addon: "checkout/carrier/binding.node",
        },
        cacheRoot,
        copyRaw(sample, root) {
            assert.equal(root, cacheRoot);
            const directory = join(root, "raw-cold-" + sample);
            copies.push(directory);
            return {
                entry: join(directory, "index.js"),
                addon: join(directory, "binding.node"),
            };
        },
        copyCarrier(sample, root) {
            assert.equal(root, cacheRoot);
            return {
                entry: "carrier-cold-" + sample,
                addon: "carrier-cold-" + sample + ".node",
            };
        },
        smoke(entry) {
            if (entry.startsWith(cacheRoot))
                assert(copies.includes(dirname(entry)));
            return { loadMs: 1 };
        },
    });
    assert.equal(new Set(copies).size, 15);
});
