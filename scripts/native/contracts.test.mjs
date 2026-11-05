import test from "node:test";
import assert from "node:assert/strict";
import {
    mkdtempSync,
    mkdirSync,
    writeFileSync,
    rmSync,
    readFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { products, targets, targetInfo } from "./targets.mjs";
import { validateInventory, validateReport } from "./contracts.mjs";
import { artifactInfo, run, sha512 } from "./common.mjs";
import { inspectTarball } from "./tarballs.mjs";

const expected = {
    schemaVersion: 1,
    version: "1.17.0",
    buildType: "stable",
    sourceCommit: "a".repeat(40),
};
function inventory() {
    return products.flatMap((product) =>
        Object.entries(targets).map(([target, info]) => ({
            ...expected,
            product,
            target,
            filename: artifactInfo(product, target).filename,
            cli: {},
            kind: info.carrier ? "carrier" : "raw",
            rawSize: 1000,
            rawSha512: "a".repeat(128),
            carrierSize: info.carrier ? 500 : 0,
            carrierSha512: info.carrier ? "b".repeat(128) : null,
            compressedSize: info.carrier ? 100 : 0,
            payloadSize: info.carrier ? 196 : 0,
            reduction: info.carrier ? 0.5 : 0,
        }))
    );
}
test("all 48 existing platform manifests agree with the exact carrier boundary", () => {
    for (const product of products)
        for (const target of Object.keys(targets))
            artifactInfo(product, target);
    assert.equal(
        Object.values(targets).filter((target) => target.carrier).length,
        8
    );
    assert.throws(() => targetInfo("core", "future-target"));
    assert.throws(() => targetInfo("unknown", "x86_64-apple-darwin"));
});
test("the complete shared gate accepts the exact 50 percent boundary", () => {
    assert.deepEqual(validateInventory(inventory(), expected), {
        selected: 32,
        raw: 16,
        rawSize: 32000,
        carrierSize: 16000,
        reduction: 0.5,
    });
});
test("missing, duplicate, stale and raw-substituted reports cannot pass", () => {
    const cases = [
        (rows) => rows.pop(),
        (rows) => {
            rows[1] = rows[0];
        },
        (rows) => {
            rows[0].sourceCommit = "b".repeat(40);
        },
        (rows) => {
            rows[0].kind = "raw";
        },
        (rows) => {
            rows[0].target = "unknown";
        },
        (rows) => {
            rows[0].rawSha512 = "";
        },
        (rows) => {
            rows[0].carrierSize = rows[0].rawSize;
        },
        (rows) => {
            rows[0].carrierSize++;
            rows[0].reduction = 1 - rows[0].carrierSize / rows[0].rawSize;
        },
    ];
    for (const change of cases) {
        const rows = inventory();
        change(rows);
        assert.throws(() => validateInventory(rows, expected));
    }
});
test("excluded targets cannot acquire carrier metadata", () => {
    const raw = inventory().find((report) => report.kind === "raw");
    validateReport(raw, expected);
    assert.throws(() => validateReport({ ...raw, payloadSize: 1 }, expected));
    assert.throws(() => validateReport({ ...raw, kind: "carrier" }, expected));
});
test("npm pack preserves filenames and rejects byte substitution and sidecars", () => {
    const directory = mkdtempSync(join(tmpdir(), "swc-npm-layout-"));
    try {
        const packageDirectory = join(directory, "fixture");
        mkdirSync(packageDirectory);
        const filename = "swc.linux-x64-gnu.node";
        const manifest = {
            name: "@swc/core-linux-x64-gnu",
            version: "1.17.0",
            main: filename,
            files: [filename],
            os: ["linux"],
            cpu: ["x64"],
            libc: ["glibc"],
            engines: { node: ">=10" },
        };
        writeFileSync(
            join(packageDirectory, "package.json"),
            JSON.stringify(manifest)
        );
        const bytes = Buffer.from(
            "fixture bytes; native structure is tested by the Rust fixture"
        );
        writeFileSync(join(packageDirectory, filename), bytes);
        const packed = JSON.parse(
            run(
                "npm",
                [
                    "pack",
                    "--json",
                    "--ignore-scripts",
                    "--pack-destination",
                    directory,
                ],
                { cwd: packageDirectory }
            )
        )[0];
        const tarball = join(directory, packed.filename);
        const report = {
            filename,
            kind: "raw",
            rawSize: bytes.length,
            rawSha512: sha512(bytes),
            cli: {},
        };
        assert.equal(
            inspectTarball(tarball, manifest, report).size,
            readFileSync(tarball).length
        );
        assert.throws(() =>
            inspectTarball(tarball, manifest, {
                ...report,
                rawSha512: "f".repeat(128),
            })
        );
        assert.throws(() =>
            inspectTarball(
                tarball,
                { ...manifest, engines: { node: ">=20" } },
                report
            )
        );
        manifest.files.push("payload.swcn");
        writeFileSync(
            join(packageDirectory, "package.json"),
            JSON.stringify(manifest)
        );
        writeFileSync(join(packageDirectory, "payload.swcn"), "sidecar");
        run(
            "npm",
            ["pack", "--ignore-scripts", "--pack-destination", directory],
            { cwd: packageDirectory }
        );
        assert.throws(() => inspectTarball(tarball, manifest, report));
    } finally {
        rmSync(directory, { force: true, recursive: true });
    }
});
