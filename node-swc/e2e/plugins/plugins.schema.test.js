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
        "-p",
        "binding_core_node",
        `--cargo-flags=--no-default-features --features swc_v1 --features plugin --features ${feature}`,
        "--config",
        `./node-swc/e2e/fixtures/napi.host.${feature}.config.js`,
    ];

    const proc = spawn("napi", args, { cwd: getPkgRoot(), stdio: "inherit" });
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

    const proc = spawn("cargo", args, { cwd: getPkgRoot(), stdio: "inherit" });
    await waitProcessAsync(proc);
};

describe("Plugins", () => {
    describe("Transform AST schema versions", () => {
        const versionMatrix = [
            {
                host: "plugin_transform_schema_vtest",
                plugin: [
                    "plugin_transform_schema_v1",
                    "plugin_transform_schema_vtest",
                ],
            },
            /* TODO
            ["v1", "vtest"],
            ["vtest", "v1"],
            ["vtest", "vtest"],
            */
        ];

        describe.each(versionMatrix)(
            "Host schema version '$host'",
            ({ host, plugin: pluginVersions }) => {
                // Arbitrary large number to ensure test doesn't timeout due to native binaries build time.
                beforeAll(async () => {
                    await buildHost(host);
                    await Promise.all(
                        pluginVersions.map((p) => buildPlugin(p))
                    );
                }, 10000000);

                const transform = (code, feature) => {
                    const { transformSync } = require(path.resolve(
                        getPkgRoot(),
                        `swc_host_${host}.node`
                    ));

                    const options = {
                        jsc: {
                            experimental: {
                                plugins: [[getPluginAbsolutePath(feature), {}]],
                            },
                        },
                    };

                    return transformSync(
                        code,
                        false,
                        Buffer.from(JSON.stringify(options))
                    );
                };

                it.each(pluginVersions)(
                    `Should work with plugin schema version %s`,
                    (pluginVersion) => {
                        const result = transform(
                            `console.log('boo')`,
                            pluginVersion
                        );
                    }
                );
            }
        );
    });
});
