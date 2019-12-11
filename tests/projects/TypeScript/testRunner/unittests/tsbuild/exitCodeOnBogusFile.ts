namespace ts {
    // https://github.com/microsoft/TypeScript/issues/33849
    describe("unittests:: tsbuild:: exitCodeOnBogusFile:: test exit code", () => {
        verifyTsc({
            scenario: "exitCodeOnBogusFile",
            subScenario: `test exit code`,
            fs: () => loadProjectFromFiles({}, symbolLibContent),
            commandLineArgs: ["-b", "bogus.json"]
        });
    });
}
