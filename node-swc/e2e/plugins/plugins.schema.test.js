const { getPkgRoot } = require("../utils");
const { spawn } = require("child_process");

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
    await new Promise((resolve, reject) => {
        proc.on("exit", (code) => {
            if (code === 0) {
                resolve(code);
            } else {
                reject(code);
            }
        });
    });
};

describe("Plugins", () => {
    describe("Transform AST schema versions", () => {
        const versionMatrix = [
            ["plugin_transform_schema_v1", "plugin_transform_schema_v1"],
            /* TODO
            ["v1", "vtest"],
            ["vtest", "v1"],
            ["vtest", "vtest"],
            */
        ];

        // Arbitrary large number to ensure test doesn't timeout due to native binaries build time.
        jest.setTimeout(10000000);

        describe.each(versionMatrix)(
            "Host schema version '%s'",
            (hostVersion, pluginVersion) => {
                beforeAll(() => buildHost(hostVersion));

                test.todo(
                    `Should work with plugin schema version '${pluginVersion}'`
                );
            }
        );
    });
});
