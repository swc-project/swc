import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { artifactInfo, identity, readJson, sha512 } from "./common.mjs";
import { containsPayload, validateReport } from "./contracts.mjs";

// This independent pre-upload check also runs for excluded targets and Docker
// builds. It cannot accept a missing finalization report or a selected raw file.
const [product, target, reportPath] = process.argv.slice(2);
const info = artifactInfo(product, target);
const report = readJson(resolve(reportPath));
validateReport(report, identity(product, target, info));
assert.equal(report.kind, info.carrier ? "carrier" : "raw");
const bytes = readFileSync(join(info.directory, info.filename));
assert.equal(
    sha512(bytes),
    info.carrier ? report.carrierSha512 : report.rawSha512
);
assert.equal(bytes.length, info.carrier ? report.carrierSize : report.rawSize);
if (info.carrier) assert(report.carrierSize < report.rawSize);
else assert(!containsPayload(bytes), "excluded upload is a carrier");
for (const [name, hash] of Object.entries(report.cli)) {
    assert.equal(
        sha512(readFileSync(join(info.directory, name))),
        hash,
        "CLI hash mismatch"
    );
}
