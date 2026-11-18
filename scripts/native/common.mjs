import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { targetInfo } from "./targets.mjs";

export const repository = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../.."
);
export const sha512 = (bytes) =>
    createHash("sha512").update(bytes).digest("hex");
export const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
export function writeJson(path, value) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
}

/** Execute argument arrays; never interpolate artifact paths into a shell. */
export function run(command, args, options = {}) {
    const result = spawnSync(command, args, {
        cwd: repository,
        encoding: "utf8",
        maxBuffer: 16 * 1024 * 1024,
        ...options,
    });
    if (result.error || result.status !== 0) {
        throw new Error(
            command +
                " " +
                args.join(" ") +
                " failed: " +
                (result.error?.message ||
                    result.stderr ||
                    "exit " + result.status)
        );
    }
    return typeof result.stdout === "string"
        ? result.stdout.trim()
        : result.stdout;
}

/** Resolve the established filename from checked-in npm manifests. */
export function artifactInfo(product, target, root = repository) {
    const info = targetInfo(product, target);
    const directory = join(root, "packages", product);
    const manifest = readJson(join(directory, "package.json"));
    const platformDirectory = join(directory, "scripts/npm", info.abi);
    const platform = readJson(join(platformDirectory, "package.json"));
    assert.equal(manifest.name, "@swc/" + product);
    assert.equal(platform.name, manifest.name + "-" + info.abi);
    assert.equal(
        platform.main,
        manifest.napi.binaryName + "." + info.abi + ".node"
    );
    assert(manifest.napi.targets.includes(target));
    return {
        ...info,
        directory,
        platformDirectory,
        manifest,
        platform,
        filename: platform.main,
    };
}

export function identity(product, target, info) {
    const version = process.env.RELEASE_VERSION || info.manifest.version;
    assert.equal(info.manifest.version, version);
    assert.equal(info.platform.version, version);
    return {
        schemaVersion: 1,
        product,
        target,
        filename: info.filename,
        version,
        buildType: process.env.BUILD_TYPE || "local",
        sourceCommit:
            process.env.SOURCE_COMMIT || run("git", ["rev-parse", "HEAD"]),
    };
}

export function tool(name, directory = process.env.SWC_NATIVE_TOOLS) {
    if (!directory)
        throw new Error(
            "SWC_NATIVE_TOOLS must name the host verifier directory"
        );
    return join(
        resolve(directory),
        name + (process.platform === "win32" ? ".exe" : "")
    );
}

export function verifyCarrier(path, target, args = []) {
    return JSON.parse(
        run(tool("swc-native-addon-verify"), [
            "--input",
            path,
            "--target",
            target,
            ...args,
        ])
    );
}
