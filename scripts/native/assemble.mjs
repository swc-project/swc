import assert from "node:assert/strict";
import {
    existsSync,
    readFileSync,
    writeFileSync,
    mkdirSync,
    copyFileSync,
} from "node:fs";
import { join, resolve, basename } from "node:path";
import {
    artifactInfo,
    identity,
    readJson,
    repository,
    run,
    sha512,
    verifyCarrier,
    writeJson,
} from "./common.mjs";
import { containsPayload, validateReport } from "./contracts.mjs";
import { targets } from "./targets.mjs";
import { inspectTarball } from "./tarballs.mjs";

// Run after the existing napi artifacts and prepack commands. The pack command
// converts workspace dependency ranges exactly as pnpm publish previously did.
const [product, reportsDirectory, outputDirectory] = process.argv.slice(2);
if (!outputDirectory)
    throw new Error(
        "Usage: assemble.mjs <product> <reports-directory> <output-directory>"
    );
const output = resolve(outputDirectory);
mkdirSync(output, { recursive: true });
const records = [];
const tarballs = [];
const notice = readFileSync(
    join(repository, "bindings/binding_native_addon/NOTICE"),
    "utf8"
);

function pack(directory, manifest, report) {
    const filename =
        manifest.name.replace("@", "").replace("/", "-") +
        "-" +
        manifest.version +
        ".tgz";
    // All lifecycle preparation already finished. Later checks and publishing
    // must operate on these exact bytes, without another prepack mutation.
    run(
        "pnpm",
        [
            "--config.ignore-scripts=true",
            "pack",
            "--out",
            join(output, filename),
        ],
        { cwd: directory, stdio: "inherit" }
    );
    const inspected = inspectTarball(join(output, filename), manifest, report);
    tarballs.push({
        filename,
        name: manifest.name,
        size: inspected.size,
        sha512: inspected.sha512,
    });
    return inspected;
}

for (const target of Object.keys(targets)) {
    const info = artifactInfo(product, target);
    const report = readJson(
        join(resolve(reportsDirectory), product + "-" + target + ".json")
    );
    validateReport(report, identity(product, target, info));
    const file = join(info.platformDirectory, info.filename);
    const bytes = readFileSync(file);
    assert.equal(
        sha512(bytes),
        info.carrier ? report.carrierSha512 : report.rawSha512
    );
    if (info.carrier) {
        const verified = verifyCarrier(file, target);
        for (const [key, value] of Object.entries(verified))
            assert.deepEqual(report[key], value, key);
        // README is automatically included by npm; no loader/compression sidecar
        // or package "files" change is needed to distribute the required notice.
        const readme = join(info.platformDirectory, "README.md");
        const text = readFileSync(readme, "utf8");
        if (!text.includes(notice))
            writeFileSync(
                readme,
                text +
                    "\nThe native addon is a self-loading compressed carrier. First load verifies and " +
                    "materializes the original addon; subsequent loads reuse verified bytes. " +
                    "`SWC_NATIVE_BINDING_CACHE` selects the default user cache (unset/empty), " +
                    "temporary materialization (`0`), or an absolute custom root. See the " +
                    "[carrier guide](https://github.com/swc-project/swc/blob/main/docs/native-addon-carriers.md) " +
                    "for filesystem behavior and the supported-target boundary.\n" +
                    "\n## Native carrier attribution\n\n" +
                    notice
            );
    } else {
        assert(!containsPayload(bytes), "excluded addon is a carrier");
    }
    // CLI assembly is intentionally separate from addon finalization.
    for (const [name, hash] of Object.entries(report.cli)) {
        const artifact =
            "bindings-" +
            report.buildType +
            "-" +
            product +
            "-" +
            report.version +
            "-" +
            target;
        const candidates = [
            join(info.directory, "artifacts", artifact, name),
            join(
                info.directory,
                "artifacts_cli",
                "swc-" + info.abi + (name.endsWith(".exe") ? ".exe" : "")
            ),
        ];
        const cli = candidates.find(existsSync);
        assert(cli, "missing existing CLI artifact for " + target);
        assert.equal(
            sha512(readFileSync(cli)),
            hash,
            "CLI changed during assembly"
        );
        if (product === "core") {
            mkdirSync(join(output, "cli"), { recursive: true });
            copyFileSync(
                cli,
                join(
                    output,
                    "cli",
                    "swc-" + info.abi + (name.endsWith(".exe") ? ".exe" : "")
                )
            );
        }
        const platformCli = join(info.platformDirectory, name);
        if (existsSync(platformCli))
            assert.equal(sha512(readFileSync(platformCli)), hash);
    }
    const tarball = pack(info.platformDirectory, info.platform, report);
    records.push({
        ...report,
        npmTarballSize: tarball.size,
        npmTarballSha512: tarball.sha512,
    });
}
const info = artifactInfo(product, Object.keys(targets)[0]);
const manifest = readJson(join(info.directory, "package.json"));
// napi prepublish is the existing authority for optional dependency versions.
const expectedOptional = Object.fromEntries(
    Object.values(targets).map(({ abi }) => [
        "@swc/" + product + "-" + abi,
        manifest.version,
    ])
);
assert.deepEqual(
    manifest.optionalDependencies,
    expectedOptional,
    "platform optional dependency contract changed"
);
pack(info.directory, manifest);
writeJson(join(output, "assembly.json"), {
    ...identity(product, Object.keys(targets)[0], info),
    records,
    tarballs,
});
console.log(
    "Prepared " +
        product +
        ": " +
        tarballs.length +
        " verified npm tarballs in " +
        basename(output)
);
