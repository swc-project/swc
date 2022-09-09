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

describe("Publihsed plugins", () => {
    const packageName = platformPackagesMap[platform][arch];

    if (!!packageName) {
        it("should compile without seg fault", () => {
            const { transformSync } = require(path.resolve(
                getPkgRoot(),
                packageName
            ));

            const options = {
                jsc: {
                    target: "es5",
                    parser: {
                        syntax: "typescript",
                    },
                    experimental: {
                        plugins: [
                            ["@swc/plugin-jest", {}],
                            ["swc-plugin-coverage-instrument", {}],
                        ],
                    },
                },
            };

            const { code } = transformSync(
                'console.log("hello world")',
                false,
                Buffer.from(JSON.stringify(options))
            );

            expect(code).toMatchInlineSnapshot(`
                "function cov_8828012090449151314() {
                    var path = \\"unknown.js\\";
                    var hash = \\"7618951444430927811\\";
                    var global = new ((function(){}).constructor)(\\"return this\\")();
                    var gcv = \\"__coverage__\\";
                    var coverageData = {
                        all: false,
                        path: \\"unknown.js\\",
                        statementMap: {
                            \\"0\\": {
                                start: {
                                    line: 1,
                                    column: 0
                                },
                                end: {
                                    line: 1,
                                    column: 26
                                }
                            }
                        },
                        fnMap: {},
                        branchMap: {},
                        s: {
                            \\"0\\": 0
                        },
                        f: {},
                        b: {},
                        _coverageSchema: \\"11020577277169172593\\",
                        hash: \\"7618951444430927811\\"
                    };
                    var coverage = global[gcv] || (global[gcv] = {});
                    if (!coverage[path] || coverage[path].hash !== hash) {
                        coverage[path] = coverageData;
                    }
                    var actualCoverage = coverage[path];
                    {
                        cov_8828012090449151314 = function cov_8828012090449151314() {
                            return actualCoverage;
                        };
                    }
                    return actualCoverage;
                }
                cov_8828012090449151314();
                cov_8828012090449151314().s[0]++;
                console.log(\\"hello world\\");
                "
            `);
        });
    }
});
