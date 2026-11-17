import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { fixRust } from "./fix.mjs";
import { cargoFixitPaths } from "./paths/cargo-fixit.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const paths = cargoFixitPaths(root);

test("CI never installs tools or edits source", () => {
    fixRust({
        env: { CI: "1" },
        run: () => assert.fail("CI must not run cargo-fixit"),
        exists: () => assert.fail("CI must not inspect the local tool cache"),
    });
});

test("local builds install the pinned tool before applying workspace fixes", () => {
    const calls = [];
    fixRust({
        root,
        env: { CI: "false", PATH: "original" },
        platform: "win32",
        exists: () => false,
        run: (...args) => {
            calls.push(args);
            return { status: 0 };
        },
    });
    assert.deepEqual(
        calls.map((call) => call[1][0]),
        ["install", "fixit"],
    );
    assert.deepEqual(calls[0][1], [
        "install",
        "cargo-fixit",
        "--version",
        paths.version,
        "--locked",
        "--root",
        paths.installRoot,
    ]);
    assert.deepEqual(calls[1][1], [
        "fixit",
        "--clippy",
        "--workspace",
        "--all-targets",
        "--allow-dirty",
    ]);
    assert.equal(calls[1][2].cwd, root);
    assert.ok(calls[1][2].env.PATH.endsWith("original"));
    assert.equal(calls[1][2].env.Path, undefined);
});

test("cached tools are reused", () => {
    const commands = [];
    fixRust({
        env: {},
        exists: () => true,
        run: (_, args) => {
            commands.push(args[0]);
            return { status: 0 };
        },
    });
    assert.deepEqual(commands, ["fixit"]);
});

test("installation and fix failures stop the build", () => {
    for (const cached of [false, true]) {
        let calls = 0;
        assert.throws(
            () =>
                fixRust({
                    env: {},
                    exists: () => cached,
                    run: () => {
                        calls += 1;
                        return { status: 2 };
                    },
                }),
            /failed \(2\)/,
        );
        assert.equal(calls, 1);
    }
    const error = new Error("cargo unavailable");
    assert.throws(
        () =>
            fixRust({
                env: {},
                exists: () => true,
                run: () => ({ error }),
            }),
        error,
    );
});

test("both native build commands run fixes before compilation", () => {
    const pkg = JSON.parse(
        readFileSync(path.join(root, "packages/core/package.json")),
    );
    for (const name of ["build", "build:dev"]) {
        assert.ok(
            pkg.scripts[name].startsWith(
                "node ../../scripts/cargo/fix.mjs && ",
            ),
        );
    }
});

const binPath = paths.binPath;
test(`${process.platform} uses the correct path variable`, () => {
    const env =
        process.platform === "win32"
            ? { Path: "original" }
            : { Path: "mixed", path: "lower", PATH: "original" };
    const original = { ...env };
    const pathKey = process.platform === "win32" ? "Path" : "PATH";
    let commandEnv;
    fixRust({
        root,
        env,
        exists: () => true,
        run: (_, args, options) => {
            commandEnv = options.env;
            return { status: 0 };
        },
    });
    assert.equal(commandEnv[pathKey], `${binPath}${path.delimiter}original`);
    assert.deepEqual(env, original);
});
