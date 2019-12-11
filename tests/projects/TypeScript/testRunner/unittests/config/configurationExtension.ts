namespace ts {
    function createFileSystem(ignoreCase: boolean, cwd: string, root: string) {
        return new vfs.FileSystem(ignoreCase, {
            cwd,
            files: {
                [root]: {
                    "dev/node_modules/config-box/package.json": JSON.stringify({
                        name: "config-box",
                        version: "1.0.0",
                        tsconfig: "./strict.json"
                    }),
                    "dev/node_modules/config-box/strict.json": JSON.stringify({
                        compilerOptions: {
                            strict: true,
                        }
                    }),
                    "dev/node_modules/config-box/unstrict.json": JSON.stringify({
                        compilerOptions: {
                            strict: false,
                        }
                    }),
                    "dev/tsconfig.extendsBox.json": JSON.stringify({
                        extends: "config-box",
                        files: [
                            "main.ts",
                        ]
                    }),
                    "dev/tsconfig.extendsStrict.json": JSON.stringify({
                        extends: "config-box/strict",
                        files: [
                            "main.ts",
                        ]
                    }),
                    "dev/tsconfig.extendsUnStrict.json": JSON.stringify({
                        extends: "config-box/unstrict",
                        files: [
                            "main.ts",
                        ]
                    }),
                    "dev/tsconfig.extendsStrictExtension.json": JSON.stringify({
                        extends: "config-box/strict.json",
                        files: [
                            "main.ts",
                        ]
                    }),
                    "dev/node_modules/config-box-implied/package.json": JSON.stringify({
                        name: "config-box-implied",
                        version: "1.0.0",
                    }),
                    "dev/node_modules/config-box-implied/tsconfig.json": JSON.stringify({
                        compilerOptions: {
                            strict: true,
                        }
                    }),
                    "dev/node_modules/config-box-implied/unstrict/tsconfig.json": JSON.stringify({
                        compilerOptions: {
                            strict: false,
                        }
                    }),
                    "dev/tsconfig.extendsBoxImplied.json": JSON.stringify({
                        extends: "config-box-implied",
                        files: [
                            "main.ts",
                        ]
                    }),
                    "dev/tsconfig.extendsBoxImpliedUnstrict.json": JSON.stringify({
                        extends: "config-box-implied/unstrict",
                        files: [
                            "main.ts",
                        ]
                    }),
                    "dev/tsconfig.extendsBoxImpliedUnstrictExtension.json": JSON.stringify({
                        extends: "config-box-implied/unstrict/tsconfig",
                        files: [
                            "main.ts",
                        ]
                    }),
                    "dev/tsconfig.extendsBoxImpliedPath.json": JSON.stringify({
                        extends: "config-box-implied/tsconfig.json",
                        files: [
                            "main.ts",
                        ]
                    }),
                    "dev/tsconfig.json": JSON.stringify({
                        extends: "./configs/base",
                        files: [
                            "main.ts",
                            "supplemental.ts"
                        ]
                    }),
                    "dev/tsconfig.nostrictnull.json": JSON.stringify({
                        extends: "./tsconfig",
                        compilerOptions: {
                            strictNullChecks: false
                        }
                    }),
                    "dev/configs/base.json": JSON.stringify({
                        compilerOptions: {
                            allowJs: true,
                            noImplicitAny: true,
                            strictNullChecks: true
                        }
                    }),
                    "dev/configs/tests.json": JSON.stringify({
                        compilerOptions: {
                            preserveConstEnums: true,
                            removeComments: false,
                            sourceMap: true
                        },
                        exclude: [
                            "../tests/baselines",
                            "../tests/scenarios"
                        ],
                        include: [
                            "../tests/**/*.ts"
                        ]
                    }),
                    "dev/circular.json": JSON.stringify({
                        extends: "./circular2",
                        compilerOptions: {
                            module: "amd"
                        }
                    }),
                    "dev/circular2.json": JSON.stringify({
                        extends: "./circular",
                        compilerOptions: {
                            module: "commonjs"
                        }
                    }),
                    "dev/missing.json": JSON.stringify({
                        extends: "./missing2",
                        compilerOptions: {
                            types: []
                        }
                    }),
                    "dev/failure.json": JSON.stringify({
                        extends: "./failure2.json",
                        compilerOptions: {
                            typeRoots: []
                        }
                    }),
                    "dev/failure2.json": JSON.stringify({
                        excludes: ["*.js"]
                    }),
                    "dev/configs/first.json": JSON.stringify({
                        extends: "./base",
                        compilerOptions: {
                            module: "commonjs"
                        },
                        files: ["../main.ts"]
                    }),
                    "dev/configs/second.json": JSON.stringify({
                        extends: "./base",
                        compilerOptions: {
                            module: "amd"
                        },
                        include: ["../supplemental.*"]
                    }),
                    "dev/configs/third.json": JSON.stringify({
                        extends: "./second",
                        compilerOptions: {
                            module: null // eslint-disable-line no-null/no-null
                        },
                        include: ["../supplemental.*"]
                    }),
                    "dev/configs/fourth.json": JSON.stringify({
                        extends: "./third",
                        compilerOptions: {
                            module: "system"
                        },
                        include: null, // eslint-disable-line no-null/no-null
                        files: ["../main.ts"]
                    }),
                    "dev/configs/fifth.json": JSON.stringify({
                        extends: "./fourth",
                        include: ["../tests/utils.ts"],
                        files: []
                    }),
                    "dev/extends.json": JSON.stringify({ extends: 42 }),
                    "dev/extends2.json": JSON.stringify({ extends: "configs/base" }),
                    "dev/main.ts": "",
                    "dev/supplemental.ts": "",
                    "dev/tests/unit/spec.ts": "",
                    "dev/tests/utils.ts": "",
                    "dev/tests/scenarios/first.json": "",
                    "dev/tests/baselines/first/output.ts": ""
                }
            }
        });
    }

    const caseInsensitiveBasePath = "c:/dev/";
    const caseInsensitiveHost = new fakes.ParseConfigHost(createFileSystem(/*ignoreCase*/ true, caseInsensitiveBasePath, "c:/"));

    const caseSensitiveBasePath = "/dev/";
    const caseSensitiveHost = new fakes.ParseConfigHost(createFileSystem(/*ignoreCase*/ false, caseSensitiveBasePath, "/"));

    function verifyDiagnostics(actual: Diagnostic[], expected: { code: number; messageText: string; }[]) {
        assert.isTrue(expected.length === actual.length, `Expected error: ${JSON.stringify(expected)}. Actual error: ${JSON.stringify(actual)}.`);
        for (let i = 0; i < actual.length; i++) {
            const actualError = actual[i];
            const expectedError = expected[i];
            assert.equal(actualError.code, expectedError.code, "Error code mismatch");
            assert.equal(actualError.category, DiagnosticCategory.Error, "Category mismatch"); // Should always be error
            assert.equal(flattenDiagnosticMessageText(actualError.messageText, "\n"), expectedError.messageText);
        }
    }

    describe("unittests:: config:: configurationExtension", () => {
        forEach<[string, string, fakes.ParseConfigHost], void>([
            ["under a case insensitive host", caseInsensitiveBasePath, caseInsensitiveHost],
            ["under a case sensitive host", caseSensitiveBasePath, caseSensitiveHost]
        ], ([testName, basePath, host]) => {
            function getParseCommandLine(entry: string) {
                const {config, error} = readConfigFile(entry, name => host.readFile(name));
                assert(config && !error, flattenDiagnosticMessageText(error && error.messageText, "\n"));
                return parseJsonConfigFileContent(config, host, basePath, {}, entry);
            }

            function getParseCommandLineJsonSourceFile(entry: string) {
                const jsonSourceFile = readJsonConfigFile(entry, name => host.readFile(name));
                assert(jsonSourceFile.endOfFileToken && !jsonSourceFile.parseDiagnostics.length, flattenDiagnosticMessageText(jsonSourceFile.parseDiagnostics[0] && jsonSourceFile.parseDiagnostics[0].messageText, "\n"));
                return {
                    jsonSourceFile,
                    parsed: parseJsonSourceFileConfigFileContent(jsonSourceFile, host, basePath, {}, entry)
                };
            }

            function testSuccess(name: string, entry: string, expected: CompilerOptions, expectedFiles: string[]) {
                expected.configFilePath = entry;
                it(name, () => {
                    const parsed = getParseCommandLine(entry);
                    assert(!parsed.errors.length, flattenDiagnosticMessageText(parsed.errors[0] && parsed.errors[0].messageText, "\n"));
                    assert.deepEqual(parsed.options, expected);
                    assert.deepEqual(parsed.fileNames, expectedFiles);
                });

                it(name + " with jsonSourceFile", () => {
                    const { parsed, jsonSourceFile } = getParseCommandLineJsonSourceFile(entry);
                    assert(!parsed.errors.length, flattenDiagnosticMessageText(parsed.errors[0] && parsed.errors[0].messageText, "\n"));
                    assert.deepEqual(parsed.options, expected);
                    assert.equal(parsed.options.configFile, jsonSourceFile);
                    assert.deepEqual(parsed.fileNames, expectedFiles);
                });
            }

            function testFailure(name: string, entry: string, expectedDiagnostics: { code: number; messageText: string; }[]) {
                it(name, () => {
                    const parsed = getParseCommandLine(entry);
                    verifyDiagnostics(parsed.errors, expectedDiagnostics);
                });

                it(name + " with jsonSourceFile", () => {
                    const { parsed } = getParseCommandLineJsonSourceFile(entry);
                    verifyDiagnostics(parsed.errors, expectedDiagnostics);
                });
            }

            describe(testName, () => {
                testSuccess("can resolve an extension with a base extension", "tsconfig.json", {
                    allowJs: true,
                    noImplicitAny: true,
                    strictNullChecks: true,
                }, [
                    combinePaths(basePath, "main.ts"),
                    combinePaths(basePath, "supplemental.ts"),
                ]);

                testSuccess("can resolve an extension with a base extension that overrides options", "tsconfig.nostrictnull.json", {
                    allowJs: true,
                    noImplicitAny: true,
                    strictNullChecks: false,
                }, [
                    combinePaths(basePath, "main.ts"),
                    combinePaths(basePath, "supplemental.ts"),
                ]);

                testFailure("can report errors on circular imports", "circular.json", [
                    {
                        code: 18000,
                        messageText: `Circularity detected while resolving configuration: ${[combinePaths(basePath, "circular.json"), combinePaths(basePath, "circular2.json"), combinePaths(basePath, "circular.json")].join(" -> ")}`
                    }
                ]);

                testFailure("can report missing configurations", "missing.json", [{
                    code: 6053,
                    messageText: `File './missing2' not found.`
                }]);

                testFailure("can report errors in extended configs", "failure.json", [{
                    code: 6114,
                    messageText: `Unknown option 'excludes'. Did you mean 'exclude'?`
                }]);

                testFailure("can error when 'extends' is not a string", "extends.json", [{
                    code: 5024,
                    messageText: `Compiler option 'extends' requires a value of type string.`
                }]);

                testSuccess("can overwrite compiler options using extended 'null'", "configs/third.json", {
                    allowJs: true,
                    noImplicitAny: true,
                    strictNullChecks: true,
                    module: undefined // Technically, this is distinct from the key never being set; but within the compiler we don't make the distinction
                }, [
                    combinePaths(basePath, "supplemental.ts")
                ]);

                testSuccess("can overwrite top-level options using extended 'null'", "configs/fourth.json", {
                    allowJs: true,
                    noImplicitAny: true,
                    strictNullChecks: true,
                    module: ModuleKind.System
                }, [
                    combinePaths(basePath, "main.ts")
                ]);

                testSuccess("can overwrite top-level files using extended []", "configs/fifth.json", {
                    allowJs: true,
                    noImplicitAny: true,
                    strictNullChecks: true,
                    module: ModuleKind.System
                }, [
                    combinePaths(basePath, "tests/utils.ts")
                ]);

                describe("finding extended configs from node_modules", () => {
                    testSuccess("can lookup via tsconfig field", "tsconfig.extendsBox.json", { strict: true }, [combinePaths(basePath, "main.ts")]);
                    testSuccess("can lookup via package-relative path", "tsconfig.extendsStrict.json", { strict: true }, [combinePaths(basePath, "main.ts")]);
                    testSuccess("can lookup via non-redirected-to package-relative path", "tsconfig.extendsUnStrict.json", { strict: false }, [combinePaths(basePath, "main.ts")]);
                    testSuccess("can lookup via package-relative path with extension", "tsconfig.extendsStrictExtension.json", { strict: true }, [combinePaths(basePath, "main.ts")]);
                    testSuccess("can lookup via an implicit tsconfig", "tsconfig.extendsBoxImplied.json", { strict: true }, [combinePaths(basePath, "main.ts")]);
                    testSuccess("can lookup via an implicit tsconfig in a package-relative directory", "tsconfig.extendsBoxImpliedUnstrict.json", { strict: false }, [combinePaths(basePath, "main.ts")]);
                    testSuccess("can lookup via an implicit tsconfig in a package-relative directory with name", "tsconfig.extendsBoxImpliedUnstrictExtension.json", { strict: false }, [combinePaths(basePath, "main.ts")]);
                    testSuccess("can lookup via an implicit tsconfig in a package-relative directory with extension", "tsconfig.extendsBoxImpliedPath.json", { strict: true }, [combinePaths(basePath, "main.ts")]);
                });

                it("adds extendedSourceFiles only once", () => {
                    const sourceFile = readJsonConfigFile("configs/fourth.json", (path) => host.readFile(path));
                    const dir = combinePaths(basePath, "configs");
                    const expected = [
                        combinePaths(dir, "third.json"),
                        combinePaths(dir, "second.json"),
                        combinePaths(dir, "base.json"),
                    ];
                    parseJsonSourceFileConfigFileContent(sourceFile, host, dir, {}, "fourth.json");
                    assert.deepEqual(sourceFile.extendedSourceFiles, expected);
                    parseJsonSourceFileConfigFileContent(sourceFile, host, dir, {}, "fourth.json");
                    assert.deepEqual(sourceFile.extendedSourceFiles, expected);
                });
            });
        });
    });
}
