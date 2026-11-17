import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";

const require = createRequire(import.meta.url);

/**
 * Resolve cargo-fixit's version, installRoot, and binPath for a workspace root.
 * Cargo.toml must define a non-empty [workspace.metadata.cargo-fixit].version.
 * Throws if Cargo.toml is missing, malformed, or lacks that version.
 */
export function cargoFixitPaths(root) {
    const { parse } = require("smol-toml");
    const cargoToml = path.join(root, "Cargo.toml");
    const manifest = parse(readFileSync(cargoToml, "utf8"));
    const version = manifest.workspace?.metadata?.["cargo-fixit"]?.version;
    if (typeof version !== "string" || version.trim() === "") {
        throw new Error(
            `${cargoToml} must define [workspace.metadata.cargo-fixit] with a version string`,
        );
    }
    const installRoot = path.join(root, ".swc", "cargo-fixit", version);

    return {
        version,
        installRoot,
        binPath: path.join(installRoot, "bin"),
    };
}

/**
 * Look up an environment variable using the host platform's key semantics.
 * Returns the matching key and value; on Windows the key match is
 * case-insensitive. If absent, returns the requested name and `undefined`.
 */
export function getEnvVar(env, name) {
    // process.env uses case-insensitive lookup on Windows.
    // https://github.com/nodejs/node/blob/main/src/node_env_var.cc
    // https://github.com/libuv/libuv/blob/v1.x/src/win/util.c
    const key =
        process.platform === "win32"
            ? Object.keys(env).find(
                  (key) => key.toLowerCase() === name.toLowerCase(),
              ) || name
            : name;

    return { key, value: env[key] };
}
