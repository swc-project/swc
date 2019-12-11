namespace ts.textStorage {
    describe("unittests:: tsserver:: Text storage", () => {
        const f = {
            path: "/a/app.ts",
            content: `
                let x = 1;
                let y = 2;
                function bar(a: number) {
                    return a + 1;
                }`
        };

        function getDummyScriptInfo() {
            return { closeSourceMapFileWatcher: noop } as server.ScriptInfo;
        }

        it("text based storage should be have exactly the same as script version cache", () => {

            const host = projectSystem.createServerHost([f]);
            // Since script info is not used in these tests, just cheat by passing undefined
            const ts1 = new server.TextStorage(host, server.asNormalizedPath(f.path), /*initialVersion*/ undefined, getDummyScriptInfo());
            const ts2 = new server.TextStorage(host, server.asNormalizedPath(f.path), /*initialVersion*/ undefined, getDummyScriptInfo());

            ts1.useScriptVersionCache_TestOnly();
            ts2.useText();

            const lineMap = computeLineStarts(f.content);

            for (let line = 0; line < lineMap.length; line++) {
                const start = lineMap[line];
                const end = line === lineMap.length - 1 ? f.path.length : lineMap[line + 1];

                for (let offset = 0; offset < end - start; offset++) {
                    const pos1 = ts1.lineOffsetToPosition(line + 1, offset + 1);
                    const pos2 = ts2.lineOffsetToPosition(line + 1, offset + 1);
                    assert.strictEqual(pos1, pos2, `lineOffsetToPosition ${line + 1}-${offset + 1}: expected ${pos1} to equal ${pos2}`);
                }

                const {start: start1, length: length1 } = ts1.lineToTextSpan(line);
                const {start: start2, length: length2 } = ts2.lineToTextSpan(line);
                assert.strictEqual(start1, start2, `lineToTextSpan ${line}::start:: expected ${start1} to equal ${start2}`);
                assert.strictEqual(length1, length2, `lineToTextSpan ${line}::length:: expected ${length1} to equal ${length2}`);
            }

            for (let pos = 0; pos < f.content.length; pos++) {
                const { line: line1, offset: offset1 } = ts1.positionToLineOffset(pos);
                const { line: line2, offset: offset2 } = ts2.positionToLineOffset(pos);
                assert.strictEqual(line1, line2, `positionToLineOffset ${pos}::line:: expected ${line1} to equal ${line2}`);
                assert.strictEqual(offset1, offset2, `positionToLineOffset ${pos}::offset:: expected ${offset1} to equal ${offset2}`);
            }
        });

        it("should switch to script version cache if necessary", () => {
            const host = projectSystem.createServerHost([f]);
            // Since script info is not used in these tests, just cheat by passing undefined
            const ts1 = new server.TextStorage(host, server.asNormalizedPath(f.path), /*initialVersion*/ undefined, getDummyScriptInfo());

            ts1.getSnapshot();
            assert.isFalse(ts1.hasScriptVersionCache_TestOnly(), "should not have script version cache - 1");

            ts1.edit(0, 5, "   ");
            assert.isTrue(ts1.hasScriptVersionCache_TestOnly(), "have script version cache - 1");

            ts1.useText();
            assert.isFalse(ts1.hasScriptVersionCache_TestOnly(), "should not have script version cache - 2");

            ts1.getAbsolutePositionAndLineText(0);
            assert.isTrue(ts1.hasScriptVersionCache_TestOnly(), "have script version cache - 2");
        });

        it("should be able to return the file size immediately after construction", () => {
            const host = projectSystem.createServerHost([f]);
            // Since script info is not used in these tests, just cheat by passing undefined
            const ts1 = new server.TextStorage(host, server.asNormalizedPath(f.path), /*initialVersion*/ undefined, getDummyScriptInfo());

            assert.strictEqual(f.content.length, ts1.getTelemetryFileSize());
        });

        it("should be able to return the file size when backed by text", () => {
            const host = projectSystem.createServerHost([f]);
            // Since script info is not used in these tests, just cheat by passing undefined
            const ts1 = new server.TextStorage(host, server.asNormalizedPath(f.path), /*initialVersion*/ undefined, getDummyScriptInfo());

            ts1.useText(f.content);
            assert.isFalse(ts1.hasScriptVersionCache_TestOnly());

            assert.strictEqual(f.content.length, ts1.getTelemetryFileSize());
        });

        it("should be able to return the file size when backed by a script version cache", () => {
            const host = projectSystem.createServerHost([f]);
            // Since script info is not used in these tests, just cheat by passing undefined
            const ts1 = new server.TextStorage(host, server.asNormalizedPath(f.path), /*initialVersion*/ undefined, getDummyScriptInfo());

            ts1.useScriptVersionCache_TestOnly();
            assert.isTrue(ts1.hasScriptVersionCache_TestOnly());

            assert.strictEqual(f.content.length, ts1.getTelemetryFileSize());
        });

        it("should be able to return the file size when a JS file is too large to load into text", () => {
            const largeFile = {
                path: "/a/large.js",
                content: " ".repeat(server.maxFileSize + 1)
            };

            const host = projectSystem.createServerHost([largeFile]);

            // The large-file handling requires a ScriptInfo with a containing project
            const projectService = projectSystem.createProjectService(host);
            projectService.openClientFile(largeFile.path);
            const scriptInfo = projectService.getScriptInfo(largeFile.path);

            const ts1 = new server.TextStorage(host, server.asNormalizedPath(largeFile.path), /*initialVersion*/ undefined, scriptInfo!);

            assert.isTrue(ts1.reloadFromDisk());
            assert.isFalse(ts1.hasScriptVersionCache_TestOnly());

            assert.strictEqual(largeFile.content.length, ts1.getTelemetryFileSize());
        });

        it("should return the file size without reloading the file", () => {
            const oldText = "hello";
            const newText = "goodbye";

            const changingFile = {
                path: "/a/changing.ts",
                content: oldText
            };

            const host = projectSystem.createServerHost([changingFile]);
            // Since script info is not used in these tests, just cheat by passing undefined
            const ts1 = new server.TextStorage(host, server.asNormalizedPath(changingFile.path), /*initialVersion*/ undefined, getDummyScriptInfo());

            assert.isTrue(ts1.reloadFromDisk());

            // Refresh the file and notify TextStorage
            host.writeFile(changingFile.path, newText);
            ts1.delayReloadFromFileIntoText();

            assert.strictEqual(oldText.length, ts1.getTelemetryFileSize());

            assert.isTrue(ts1.reloadWithFileText());

            assert.strictEqual(newText.length, ts1.getTelemetryFileSize());
        });
    });
}
