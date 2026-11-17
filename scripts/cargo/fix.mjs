#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { cargoFixitPaths, getEnvVar } from "./paths/cargo-fixit.mjs";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));

/** Apply local Rust fixes before the native build; CI never edits sources. */
export function fixRust({
    root = ROOT,
    env = process.env,
    platform = process.platform,
    run = spawnSync,
    exists = existsSync,
} = {}) {
    if (env.CI && env.CI !== "false" && env.CI !== "0") return;

    const { version, installRoot, binPath } = cargoFixitPaths(root);
    const binaryName = `cargo-fixit${platform === "win32" ? ".exe" : ""}`;
    const binary = path.join(binPath, binaryName);
    const execute = (args, commandEnv = env) => {
        const result = run("cargo", args, {
            cwd: root,
            env: commandEnv,
            stdio: "inherit",
        });
        if (result.error) throw result.error;
        if (result.status !== 0) {
            throw new Error(
                `cargo ${args[0]} failed (${result.signal || result.status})`,
            );
        }
    };

    if (!exists(binary)) {
        execute([
            "install",
            "cargo-fixit",
            "--version",
            version,
            "--locked",
            "--root",
            installRoot,
        ]);
    }
    const { key: pathKey, value: currentPath } = getEnvVar(env, "PATH");
    const commandEnv = { ...env };
    commandEnv[pathKey] = `${binPath}${path.delimiter}${currentPath}`;

    execute(
        ["fixit", "--clippy", "--workspace", "--all-targets", "--allow-dirty"],
        commandEnv,
    );
}

if (
    process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    try {
        fixRust();
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
