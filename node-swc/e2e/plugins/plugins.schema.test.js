/// <reference types="jest" />
const { getPkgRoot } = require("../utils");
const { spawn } = require("child_process");
const path = require("path");

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

const getPluginAbsolutePath = (feature) =>
    path.join(
        getPkgRoot(),
        `node-swc/e2e/fixtures/${feature}/target/wasm32-wasi/debug/${feature}.wasm`
    );

/**
 * Build host bindings with specific schema version flag.
 */
const buildHost = async (feature) => {
    const args = [
        "build",
        "--cargo-name",
        "binding_core_node",
        "--cargo-cwd",
        "./bindings/binding_core_node",
        `--cargo-flags=--no-default-features --features swc_v1 --features ${feature}`,
        "--config",
        `./node-swc/e2e/fixtures/napi.host.${feature}.config.js`,
    ];

    const options = { cwd: getPkgRoot(), stdio: "inherit" };

    const proc =
        process.platform == "win32"
            ? spawn("cmd", ["/s", "/c", "napi", ...args], options)
            : spawn("napi", args, options);
    await waitProcessAsync(proc);
};

const buildPlugin = async (feature) => {
    const args = [
        "build",
        "--manifest-path",
        `./node-swc/e2e/fixtures/${feature}/Cargo.toml`,
        "--target",
        "wasm32-wasi",
    ];

    const options = { cwd: getPkgRoot(), stdio: "inherit" };

    console.log(`Building plugins: ${feature}`);
    const proc =
        process.platform == "win32"
            ? spawn("cmd", ["/s", "/c", "cargo", ...args], options)
            : spawn("cargo", args, options);
    await waitProcessAsync(proc);
};

describe("Plugins", () => {
    describe.skip("Transform AST schema versions", () => {
        const versionMatrix = [
            // {
            //     host: "plugin_transform_schema_v1",
            //     plugin: ["plugin_transform_schema_v1"],
            // },
            {
                host: "__plugin_transform_vtest",
                plugin: [
                    // TODO: reenable once new packages are published
                    // Note: this test runs against latest-published version of the plugin,
                    // an actual e2e test verifies a breaking change.
                    // We don't have a automatic way to resolve this when we attempt an
                    // actual breaking change - manually workaround for now.
                    // "plugin_transform_schema_v1",
                    "plugin_transform_schema_vtest",
                ],
            },
        ];

        describe.each(versionMatrix)(
            "Host schema version '$host'",
            ({ host, plugin: pluginVersions }) => {
                // For v1 struct, we use published, prebuilt bindings as-is.
                // Note this relies on devDependencies in package.json to pick up last known version -
                // Do not update its version unless explicitly required.
                const shouldUsePrebuiltHost = host.includes(
                    "plugin_transform_schema_v1"
                );

                // Put arbitrary large number for timeout to ensure test doesn't timeout due to native binaries build time.
                beforeAll(async () => {
                    if (!shouldUsePrebuiltHost) {
                        await buildHost(host);
                    }
                    await Promise.all(
                        pluginVersions.map((p) => buildPlugin(p))
                    );
                }, 10000000);

                const transform = (code, feature) => {
                    const options = {
                        jsc: {
                            experimental: {
                                plugins: [[getPluginAbsolutePath(feature), {}]],
                            },
                        },
                    };

                    if (shouldUsePrebuiltHost) {
                        const { transformSync } = require("@swc/core");

                        return transformSync(code, options);
                    } else {
                        const { transformSync } = require(path.resolve(
                            getPkgRoot(),
                            `swc_host_${host}.node`
                        ));

                        return transformSync(
                            code,
                            false,
                            Buffer.from(JSON.stringify(options))
                        );
                    }
                };

                it.each(pluginVersions)(
                    `Should work with plugin schema version %s`,
                    (pluginVersion) => {
                        const result = transform(
                            `console.log('boo')`,
                            pluginVersion
                        );

                        // Consider test passes if plugin transform is successful.
                        expect(result.code.includes(pluginVersion)).toBe(true);
                    }
                );
            }
        );
    });
});
