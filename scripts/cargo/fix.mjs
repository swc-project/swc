#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const VERSION = "0.1.17";

/** Apply local Rust fixes before the native build; CI never edits sources. */
export function fixRust({
    root = ROOT,
    env = process.env,
    run = spawnSync,
    exists = existsSync,
} = {}) {
    if (env.CI && env.CI !== "false" && env.CI !== "0") return;

    const installRoot = join(root, ".swc", "cargo-fixit", VERSION);
    const binary = join(
        installRoot,
        "bin",
        process.platform === "win32" ? "cargo-fixit.exe" : "cargo-fixit",
    );
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
            VERSION,
            "--locked",
            "--root",
            installRoot,
        ]);
    }
    const pathKey =
        Object.keys(env).find((key) => key.toLowerCase() === "path") || "PATH";
    execute(
        ["fixit", "--clippy", "--workspace", "--all-targets", "--allow-dirty"],
        {
            ...env,
            [pathKey]: `${dirname(binary)}${process.platform === "win32" ? ";" : ":"}${env[pathKey] || ""}`,
        },
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
