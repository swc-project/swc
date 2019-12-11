namespace ts.projectSystem {
    describe("unittests:: tsserver:: with skipLibCheck", () => {
        it("should be turned on for js-only inferred projects", () => {
            const file1 = {
                path: "/a/b/file1.js",
                content: `
                /// <reference path="file2.d.ts" />
                var x = 1;`
            };
            const file2 = {
                path: "/a/b/file2.d.ts",
                content: `
                interface T {
                    name: string;
                };
                interface T {
                    name: number;
                };`
            };
            const host = createServerHost([file1, file2]);
            const session = createSession(host);
            openFilesForSession([file1, file2], session);

            const file2GetErrRequest = makeSessionRequest<protocol.SemanticDiagnosticsSyncRequestArgs>(
                CommandNames.SemanticDiagnosticsSync,
                { file: file2.path }
            );
            let errorResult = <protocol.Diagnostic[]>session.executeCommand(file2GetErrRequest).response;
            assert.isTrue(errorResult.length === 0);

            const closeFileRequest = makeSessionRequest<protocol.FileRequestArgs>(CommandNames.Close, { file: file1.path });
            session.executeCommand(closeFileRequest);
            errorResult = <protocol.Diagnostic[]>session.executeCommand(file2GetErrRequest).response;
            assert.isTrue(errorResult.length !== 0);

            openFilesForSession([file1], session);
            errorResult = <protocol.Diagnostic[]>session.executeCommand(file2GetErrRequest).response;
            assert.isTrue(errorResult.length === 0);
        });

        it("should be turned on for js-only external projects", () => {
            const jsFile = {
                path: "/a/b/file1.js",
                content: "let x =1;"
            };
            const dTsFile = {
                path: "/a/b/file2.d.ts",
                content: `
                interface T {
                    name: string;
                };
                interface T {
                    name: number;
                };`
            };
            const host = createServerHost([jsFile, dTsFile]);
            const session = createSession(host);

            const openExternalProjectRequest = makeSessionRequest<protocol.OpenExternalProjectArgs>(
                CommandNames.OpenExternalProject,
                {
                    projectFileName: "project1",
                    rootFiles: toExternalFiles([jsFile.path, dTsFile.path]),
                    options: {}
                }
            );
            session.executeCommand(openExternalProjectRequest);

            const dTsFileGetErrRequest = makeSessionRequest<protocol.SemanticDiagnosticsSyncRequestArgs>(
                CommandNames.SemanticDiagnosticsSync,
                { file: dTsFile.path }
            );
            const errorResult = <protocol.Diagnostic[]>session.executeCommand(dTsFileGetErrRequest).response;
            assert.isTrue(errorResult.length === 0);
        });

        it("should be turned on for js-only external projects with skipLibCheck=false", () => {
            const jsFile = {
                path: "/a/b/file1.js",
                content: "let x =1;"
            };
            const dTsFile = {
                path: "/a/b/file2.d.ts",
                content: `
                interface T {
                    name: string;
                };
                interface T {
                    name: number;
                };`
            };
            const host = createServerHost([jsFile, dTsFile]);
            const session = createSession(host);

            const openExternalProjectRequest = makeSessionRequest<protocol.OpenExternalProjectArgs>(
                CommandNames.OpenExternalProject,
                {
                    projectFileName: "project1",
                    rootFiles: toExternalFiles([jsFile.path, dTsFile.path]),
                    options: { skipLibCheck: false }
                }
            );
            session.executeCommand(openExternalProjectRequest);

            const dTsFileGetErrRequest = makeSessionRequest<protocol.SemanticDiagnosticsSyncRequestArgs>(
                CommandNames.SemanticDiagnosticsSync,
                { file: dTsFile.path }
            );
            const errorResult = <protocol.Diagnostic[]>session.executeCommand(dTsFileGetErrRequest).response;
            assert.isTrue(errorResult.length === 0);
        });

        it("should not report bind errors for declaration files with skipLibCheck=true", () => {
            const jsconfigFile = {
                path: "/a/jsconfig.json",
                content: "{}"
            };
            const jsFile = {
                path: "/a/jsFile.js",
                content: "let x = 1;"
            };
            const dTsFile1 = {
                path: "/a/dTsFile1.d.ts",
                content: `
                declare var x: number;`
            };
            const dTsFile2 = {
                path: "/a/dTsFile2.d.ts",
                content: `
                declare var x: string;`
            };
            const host = createServerHost([jsconfigFile, jsFile, dTsFile1, dTsFile2]);
            const session = createSession(host);
            openFilesForSession([jsFile], session);

            const dTsFile1GetErrRequest = makeSessionRequest<protocol.SemanticDiagnosticsSyncRequestArgs>(
                CommandNames.SemanticDiagnosticsSync,
                { file: dTsFile1.path }
            );
            const error1Result = <protocol.Diagnostic[]>session.executeCommand(dTsFile1GetErrRequest).response;
            assert.isTrue(error1Result.length === 0);

            const dTsFile2GetErrRequest = makeSessionRequest<protocol.SemanticDiagnosticsSyncRequestArgs>(
                CommandNames.SemanticDiagnosticsSync,
                { file: dTsFile2.path }
            );
            const error2Result = <protocol.Diagnostic[]>session.executeCommand(dTsFile2GetErrRequest).response;
            assert.isTrue(error2Result.length === 0);
        });

        it("should report semantic errors for loose JS files with '// @ts-check' and skipLibCheck=true", () => {
            const jsFile = {
                path: "/a/jsFile.js",
                content: `
                // @ts-check
                let x = 1;
                x === "string";`
            };

            const host = createServerHost([jsFile]);
            const session = createSession(host);
            openFilesForSession([jsFile], session);

            const getErrRequest = makeSessionRequest<protocol.SemanticDiagnosticsSyncRequestArgs>(
                CommandNames.SemanticDiagnosticsSync,
                { file: jsFile.path }
            );
            const errorResult = <protocol.Diagnostic[]>session.executeCommand(getErrRequest).response;
            assert.isTrue(errorResult.length === 1);
            assert.equal(errorResult[0].code, Diagnostics.This_condition_will_always_return_0_since_the_types_1_and_2_have_no_overlap.code);
        });

        it("should report semantic errors for configured js project with '// @ts-check' and skipLibCheck=true", () => {
            const jsconfigFile = {
                path: "/a/jsconfig.json",
                content: "{}"
            };

            const jsFile = {
                path: "/a/jsFile.js",
                content: `
                // @ts-check
                let x = 1;
                x === "string";`
            };

            const host = createServerHost([jsconfigFile, jsFile]);
            const session = createSession(host);
            openFilesForSession([jsFile], session);

            const getErrRequest = makeSessionRequest<protocol.SemanticDiagnosticsSyncRequestArgs>(
                CommandNames.SemanticDiagnosticsSync,
                { file: jsFile.path }
            );
            const errorResult = <protocol.Diagnostic[]>session.executeCommand(getErrRequest).response;
            assert.isTrue(errorResult.length === 1);
            assert.equal(errorResult[0].code, Diagnostics.This_condition_will_always_return_0_since_the_types_1_and_2_have_no_overlap.code);
        });

        it("should report semantic errors for configured js project with checkJs=true and skipLibCheck=true", () => {
            const jsconfigFile = {
                path: "/a/jsconfig.json",
                content: JSON.stringify({
                    compilerOptions: {
                        checkJs: true,
                        skipLibCheck: true
                    },
                })
            };
            const jsFile = {
                path: "/a/jsFile.js",
                content: `let x = 1;
                x === "string";`
            };

            const host = createServerHost([jsconfigFile, jsFile]);
            const session = createSession(host);
            openFilesForSession([jsFile], session);

            const getErrRequest = makeSessionRequest<protocol.SemanticDiagnosticsSyncRequestArgs>(
                CommandNames.SemanticDiagnosticsSync,
                { file: jsFile.path }
            );
            const errorResult = <protocol.Diagnostic[]>session.executeCommand(getErrRequest).response;
            assert.isTrue(errorResult.length === 1);
            assert.equal(errorResult[0].code, Diagnostics.This_condition_will_always_return_0_since_the_types_1_and_2_have_no_overlap.code);
        });
    });
}
