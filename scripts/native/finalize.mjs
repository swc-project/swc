import assert from "node:assert/strict";
import {
    existsSync,
    readFileSync,
    mkdtempSync,
    copyFileSync,
    rmSync,
    mkdirSync,
} from "node:fs";
import { join, resolve } from "node:path";
import {
    artifactInfo,
    identity,
    repository,
    run,
    sha512,
    tool,
    verifyCarrier,
    writeJson,
} from "./common.mjs";

const [product, target, reportPath] = process.argv.slice(2);
if (!reportPath)
    throw new Error("Usage: finalize.mjs <product> <target> <report.json>");
const info = artifactInfo(product, target);
const addon = join(info.directory, info.filename);
const raw = readFileSync(addon);
const cli = {};
for (const name of ["swc", "swc.exe"]) {
    if (existsSync(join(info.directory, name)))
        cli[name] = sha512(readFileSync(join(info.directory, name)));
}
let result = {
    kind: "raw",
    rawSize: raw.length,
    rawSha512: sha512(raw),
    compressedSize: 0,
    payloadSize: 0,
    carrierSize: 0,
    carrierSha512: null,
    reduction: 0,
};
if (info.carrier) {
    const stage = mkdtempSync(join(info.directory, ".native-carrier-"));
    try {
        // Build host tools independently of the target addon's Rust flags. The
        // carrier itself stays in the raw build's SDK/container/linker environment.
        const host = run("rustc", ["-vV"]).match(/^host: (.+)$/m)?.[1];
        assert(host, "rustc did not report its host triple");
        const hostDirectory = resolve(
            repository,
            "target/native-carrier-tools"
        );
        run(
            "cargo",
            [
                "build",
                "--locked",
                "-p",
                "swc_native_addon_pack",
                "--release",
                "--target",
                host,
                "--target-dir",
                hostDirectory,
            ],
            {
                env: {
                    ...process.env,
                    RUSTFLAGS: "",
                    CARGO_ENCODED_RUSTFLAGS: "",
                },
                stdio: "inherit",
            }
        );
        process.env.SWC_NATIVE_TOOLS = join(hostDirectory, host, "release");
        const payload = join(stage, "payload.swcn");
        run(
            tool("swc-native-addon-pack"),
            ["--input", addon, "--output", payload, "--target", target],
            { stdio: "inherit" }
        );
        const buildDirectory = resolve(repository, "target/native-carrier");
        const environment = {
            ...process.env,
            SWC_NATIVE_BINDING_PAYLOAD: payload,
        };
        if (target.endsWith("-musl")) {
            // A musl cdylib must use the dynamic CRT, matching the existing addon
            // builds. In particular, do not inherit the sibling CLI's static flags.
            environment.RUSTFLAGS = "-C target-feature=-crt-static";
            delete environment.CARGO_ENCODED_RUSTFLAGS;
        }
        run(
            "cargo",
            [
                "build",
                "--locked",
                "-p",
                "binding_native_addon",
                "--release",
                "--features",
                "embedded-payload",
                "--target",
                target,
                "--target-dir",
                buildDirectory,
            ],
            { env: environment, stdio: "inherit" }
        );
        const library = target.includes("windows")
            ? "binding_native_addon.dll"
            : target.includes("darwin")
            ? "libbinding_native_addon.dylib"
            : "libbinding_native_addon.so";
        const candidate = join(stage, "carrier.node");
        copyFileSync(
            join(buildDirectory, target, "release", library),
            candidate
        );
        // Cargo's release profile strips symbols. Match the extra Darwin strip,
        // then refresh and verify the signature of the final completed image.
        if (target.includes("darwin")) {
            run("strip", ["-x", candidate]);
            run("/usr/bin/codesign", ["--force", "--sign", "-", candidate]);
            run("/usr/bin/codesign", ["--verify", "--strict", candidate]);
        }
        result = verifyCarrier(candidate, target, [
            "--raw",
            addon,
            "--replace",
            addon,
        ]);
        assert.equal(result.rawSize, raw.length);
        assert.equal(result.rawSha512, sha512(raw));
        assert.equal(sha512(readFileSync(addon)), result.carrierSha512);
    } finally {
        rmSync(stage, { force: true, recursive: true });
    }
} else {
    assert.deepEqual(readFileSync(addon), raw, "excluded addon was modified");
}
for (const [name, hash] of Object.entries(cli)) {
    assert.equal(
        sha512(readFileSync(join(info.directory, name))),
        hash,
        "sibling CLI was modified"
    );
}
const report = { ...identity(product, target, info), ...result, cli };
mkdirSync(resolve(repository, "target/native-reports"), { recursive: true });
writeJson(resolve(reportPath), report);
console.log(JSON.stringify(report));
