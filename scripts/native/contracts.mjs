import assert from "node:assert/strict";
import { products, targets, targetInfo } from "./targets.mjs";

const digest = /^[a-f0-9]{128}$/;

/** Reject incomplete or internally inconsistent evidence before reading files. */
export function validateReport(report, expected) {
    for (const [key, value] of Object.entries(expected))
        assert.deepEqual(report[key], value, key);
    assert.equal(report.schemaVersion, 1);
    const selected = targetInfo(report.product, report.target).carrier;
    assert.equal(report.kind, selected ? "carrier" : "raw");
    assert(digest.test(report.rawSha512), "invalid raw SHA-512");
    assert(
        Number.isSafeInteger(report.rawSize) &&
            report.rawSize > 0 &&
            report.rawSize <= 2 ** 31
    );
    assert(
        report.cli &&
            typeof report.cli === "object" &&
            !Array.isArray(report.cli)
    );
    for (const [name, hash] of Object.entries(report.cli)) {
        assert(
            ["swc", "swc.exe"].includes(name) && digest.test(hash),
            "invalid CLI record"
        );
    }
    if (selected) {
        assert(digest.test(report.carrierSha512), "invalid carrier SHA-512");
        assert(
            Number.isSafeInteger(report.carrierSize) && report.carrierSize > 0
        );
        assert(report.carrierSize < report.rawSize, "carrier is not smaller");
        assert(
            Number.isSafeInteger(report.compressedSize) &&
                report.compressedSize > 0
        );
        assert.equal(report.payloadSize, report.compressedSize + 96);
        assert(report.payloadSize < report.carrierSize);
        assert.equal(report.reduction, 1 - report.carrierSize / report.rawSize);
    } else {
        assert.equal(report.carrierSha512, null);
        for (const key of [
            "carrierSize",
            "compressedSize",
            "payloadSize",
            "reduction",
        ])
            assert.equal(report[key], 0);
    }
}

/** A release is indivisible: all four products and twelve targets are required. */
export function validateInventory(reports, expected) {
    assert.equal(
        reports.length,
        products.length * Object.keys(targets).length,
        "expected all 48 artifacts"
    );
    const seen = new Set();
    let rawSize = 0;
    let carrierSize = 0;
    let selected = 0;
    for (const report of reports) {
        validateReport(report, expected);
        const key = report.product + "/" + report.target;
        assert(!seen.has(key), "duplicate artifact " + key);
        seen.add(key);
        if (report.kind === "carrier") {
            selected++;
            rawSize += report.rawSize;
            carrierSize += report.carrierSize;
        }
    }
    assert.equal(selected, 32);
    assert(
        carrierSize * 2 <= rawSize,
        "aggregate selected addon reduction is below 50%"
    );
    return {
        selected,
        raw: reports.length - selected,
        rawSize,
        carrierSize,
        reduction: 1 - carrierSize / rawSize,
    };
}

/** Report labels never make a raw image a carrier, or vice versa. */
export function containsPayload(bytes) {
    let offset = -1;
    while ((offset = bytes.indexOf("SWCNZSTD", offset + 1)) !== -1) {
        if (bytes.length - offset < 96) continue;
        if (
            bytes.readUInt16LE(offset + 8) !== 1 ||
            bytes.readUInt16LE(offset + 10) !== 96
        )
            continue;
        if (bytes[offset + 12] < 1 || bytes[offset + 12] > 8) continue;
        const size = bytes.readBigUInt64LE(offset + 16);
        if (
            size > 0n &&
            size <= 2147483648n &&
            BigInt(offset) + 96n + size <= BigInt(bytes.length)
        )
            return true;
    }
    return false;
}
