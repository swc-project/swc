/// <reference types="jest" />
const { getPkgRoot } = require("../utils");
const path = require("path");
const { readFileSync } = require("fs");

const { platform, arch } = process;

const isMusl = () =>
    (() => {
        function isMusl() {
            if (
                !process.report ||
                typeof process.report.getReport !== "function"
            ) {
                try {
                    return readFileSync("/usr/bin/ldd", "utf8").includes(
                        "musl"
                    );
                } catch (e) {
                    return true;
                }
            } else {
                const { glibcVersionRuntime } =
                    process.report.getReport().header;
                return !glibcVersionRuntime;
            }
        }

        return isMusl();
    })();

const platformPackagesMap = {
    win32: {
        x64: "swc.win32-x64-msvc.node",
        ia32: "swc.win32-ia32-msvc.node",
        arm64: "swc.win32-arm64-msvc.node",
    },
    darwin: {
        x64: "swc.darwin-x64.node",
        arm64: "swc.darwin-arm64.node",
    },
    linux: {
        x64: `swc.linux-x64-${isMusl() ? "musl" : "gnu"}.node`,
        arm64: `swc.linux-arm64-${isMusl() ? "musl" : "gnu"}.node`,
        arm: "swc.linux-arm64-gnu.node",
    },
};

const inferBinaryName = () => {
    const packageName = platformPackagesMap[platform][arch];

    if (!packageName) {
        throw new Error(
            `Unsupported platform: binary for '${platform} ${arch}' is not available`
        );
    }

    return path.join(
        path.dirname(require.resolve(packageName)),
        platform === "win32" ? "swc.exe" : "swc"
    );
};

describe.skip("Published plugins", () => {
    const packageName = platformPackagesMap[platform][arch];

    if (!!packageName) {
        it("should compile without seg fault", () => {
            const { transformSync } = require(path.resolve(
                getPkgRoot(),
                packageName
            ));
            console.log(`Package name: ${packageName}`);

            const options = {
                jsc: {
                    target: "es5",
                    parser: {
                        syntax: "typescript",
                    },
                    experimental: {
                        plugins: [
                            ["@swc/plugin-jest", {}],
                            // Disabled because this plugin is broken
                            // ["swc-plugin-coverage-instrument", {}],
                        ],
                    },
                },
            };

            console.log("Before transformSync");

            const { code } = transformSync(
                'console.log("hello world")',
                false,
                Buffer.from(JSON.stringify(options))
            );

            console.log("After transformSync");

            expect(code).toMatchInlineSnapshot(`
                "console.log("hello world");
                "
            `);
        });

        it("should compile without seg fault (async)", async () => {
            const { transform } = require(path.resolve(
                getPkgRoot(),
                packageName
            ));
            console.log(`Package name: ${packageName}`);

            const options = {
                jsc: {
                    target: "es5",
                    parser: {
                        syntax: "typescript",
                    },
                    experimental: {
                        plugins: [
                            ["@swc/plugin-jest", {}],
                            // Disabled because this plugin is broken
                            // ["swc-plugin-coverage-instrument", {}],
                        ],
                    },
                },
            };

            console.log("Before transform");

            const { code } = await transform(
                'console.log("hello world")',
                false,
                Buffer.from(JSON.stringify(options))
            );

            console.log("After transform");

            expect(code).toMatchInlineSnapshot(`
                "console.log("hello world");
                "
            `);
        });
    }
});
