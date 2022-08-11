/// <reference types="jest" />
const { getPkgRoot } = require("../utils");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs/promises");
const { glob } = require("glob");

const waitProcessAsync = async (proc) =>
    new Promise((resolve, reject) => {
        proc.on("exit", (code) => {
            if (code === 0) {
                resolve(code);
            } else {
                reject(code);
            }
        });
    });

const preparePackage = async () => {
    const args = ["package", "--allow-dirty", "-p", "swc_core"];

    const options = { cwd: getPkgRoot(), stdio: "inherit" };

    const proc =
        process.platform == "win32"
            ? spawn("cmd", ["/s", "/c", "cargo", ...args], options)
            : spawn("cargo", args, options);
    await waitProcessAsync(proc);

    // delete .crate pkg
    await fs.rm(
        glob.sync(`${getPkgRoot()}/target/package/swc_core-*.crate`)[0],
        { force: true }
    );
    // delete previous fixture artifacts
    await fs.rm(`${getPkgRoot()}/target/package/swc_core_test_fixture`, {
        recursive: true,
        force: true,
    });

    // rename generated pkg to known fixture to let cargo dep works without manually picking up versioned path
    await fs.rename(
        glob.sync(`${getPkgRoot()}/target/package/swc_core-*`)[0],
        `${getPkgRoot()}/target/package/swc_core_test_fixture`
    );
};

const buildNativeFixture = async () => {
    const args = [
        "build",
        "--manifest-path",
        `./node-swc/e2e/fixtures/swc_core_native_build/Cargo.toml`,
    ];

    const options = { cwd: getPkgRoot(), stdio: "inherit" };

    const proc =
        process.platform == "win32"
            ? spawn("cmd", ["/s", "/c", "cargo", ...args], options)
            : spawn("cargo", args, options);
    await waitProcessAsync(proc);
};

/**
 * These are end-to-end test to verify if published package may build / runs correctly. While this isn't 100% gauraantee,
 * it closely attempt to verify via locally packed package instead of running against resolved path in the source repo.
 *
 * The main issue we'd like to verify is
 *
 * - package A have some change, package B depends on package A
 * - somehow package A missed to publish new version, package B depends on A-1 version in published
 * - this will not be caught in CI, since cargo's workspace uses path-based resolution first to pick up latest code correctly
 */
describe("Core", () => {
    jest.setTimeout(10000000);

    beforeAll(async () => {
        await preparePackage();
    });

    describe("native", () => {
        it("Should be able to build", async () => {
            await buildNativeFixture();
        });
    });

    describe("plugin", () => {
        it.todo("Should be able to build");

        // Same as other unit tests for node-swc, this assumes bindings have been built via `npm run build:*` already.
        it.todo("Should be able to execute against latest bindings");
    });
});
