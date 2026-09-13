import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
    artifactInfo,
    identity,
    readJson,
    repository,
    sha512,
    verifyCarrier,
} from "./common.mjs";
import { validateReport } from "./contracts.mjs";

const [product, target] = process.argv.slice(2);
const info = artifactInfo(product, target);
const report = readJson(
    join(repository, "target/native-reports", product + "-" + target + ".json")
);
validateReport(report, identity(product, target, info));
assert(info.carrier);
const addon = join(info.directory, info.filename);
assert.equal(sha512(readFileSync(addon)), report.carrierSha512);
mkdirSync(join(repository, "target/native-raw"), { recursive: true });
const raw = join(
    repository,
    "target/native-raw",
    product + "-" + target + ".node"
);
const verified = verifyCarrier(addon, target, ["--extract", raw]);
for (const [key, value] of Object.entries(verified))
    assert.deepEqual(report[key], value);
assert.equal(sha512(readFileSync(raw)), report.rawSha512);
