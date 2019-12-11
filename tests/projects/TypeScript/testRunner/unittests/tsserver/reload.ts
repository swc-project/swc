namespace ts.projectSystem {
    describe("unittests:: tsserver:: reload", () => {
        it("should work with temp file", () => {
            const f1 = {
                path: "/a/b/app.ts",
                content: "let x = 1"
            };
            const tmp = {
                path: "/a/b/app.tmp",
                content: "const y = 42"
            };
            const host = createServerHost([f1, tmp]);
            const session = createSession(host);

            // send open request
            session.executeCommand(<server.protocol.OpenRequest>{
                type: "request",
                command: "open",
                seq: 1,
                arguments: { file: f1.path }
            });

            // reload from tmp file
            session.executeCommand(<server.protocol.ReloadRequest>{
                type: "request",
                command: "reload",
                seq: 2,
                arguments: { file: f1.path, tmpfile: tmp.path }
            });

            // verify content
            const projectServiice = session.getProjectService();
            const snap1 = projectServiice.getScriptInfo(f1.path)!.getSnapshot();
            assert.equal(getSnapshotText(snap1), tmp.content, "content should be equal to the content of temp file");

            // reload from original file file
            session.executeCommand(<server.protocol.ReloadRequest>{
                type: "request",
                command: "reload",
                seq: 2,
                arguments: { file: f1.path }
            });

            // verify content
            const snap2 = projectServiice.getScriptInfo(f1.path)!.getSnapshot();
            assert.equal(getSnapshotText(snap2), f1.content, "content should be equal to the content of original file");

        });

        it("should work when script info doesnt have any project open", () => {
            const f1 = {
                path: "/a/b/app.ts",
                content: "let x = 1"
            };
            const tmp = {
                path: "/a/b/app.tmp",
                content: "const y = 42"
            };
            const host = createServerHost([f1, tmp, libFile]);
            const session = createSession(host);
            const openContent = "let z = 1";
            // send open request
            session.executeCommandSeq(<server.protocol.OpenRequest>{
                command: server.protocol.CommandTypes.Open,
                arguments: { file: f1.path, fileContent: openContent }
            });

            const projectService = session.getProjectService();
            checkNumberOfProjects(projectService, { inferredProjects: 1 });
            const info = projectService.getScriptInfo(f1.path)!;
            assert.isDefined(info);
            checkScriptInfoContents(openContent, "contents set during open request");

            // send close request
            session.executeCommandSeq(<server.protocol.CloseRequest>{
                command: server.protocol.CommandTypes.Close,
                arguments: { file: f1.path }
            });
            checkScriptInfoAndProjects(f1.content, "contents of closed file");
            checkInferredProjectIsOrphan();

            // Can reload contents of the file when its not open and has no project
            // reload from temp file
            session.executeCommandSeq(<server.protocol.ReloadRequest>{
                command: server.protocol.CommandTypes.Reload,
                arguments: { file: f1.path, tmpfile: tmp.path }
            });
            checkScriptInfoAndProjects(tmp.content, "contents of temp file");
            checkInferredProjectIsOrphan();

            // reload from own file
            session.executeCommandSeq(<server.protocol.ReloadRequest>{
                command: server.protocol.CommandTypes.Reload,
                arguments: { file: f1.path }
            });
            checkScriptInfoAndProjects(f1.content, "contents of closed file");
            checkInferredProjectIsOrphan();

            // Open file again without setting its content
            session.executeCommandSeq(<server.protocol.OpenRequest>{
                command: server.protocol.CommandTypes.Open,
                arguments: { file: f1.path }
            });
            checkScriptInfoAndProjects(f1.content, "contents of file when opened without specifying contents");
            const snap = info.getSnapshot();

            // send close request
            session.executeCommandSeq(<server.protocol.CloseRequest>{
                command: server.protocol.CommandTypes.Close,
                arguments: { file: f1.path }
            });
            checkScriptInfoAndProjects(f1.content, "contents of closed file");
            assert.strictEqual(info.getSnapshot(), snap);
            checkInferredProjectIsOrphan();

            // reload from temp file
            session.executeCommandSeq(<server.protocol.ReloadRequest>{
                command: server.protocol.CommandTypes.Reload,
                arguments: { file: f1.path, tmpfile: tmp.path }
            });
            checkScriptInfoAndProjects(tmp.content, "contents of temp file");
            assert.notStrictEqual(info.getSnapshot(), snap);
            checkInferredProjectIsOrphan();

            // reload from own file
            session.executeCommandSeq(<server.protocol.ReloadRequest>{
                command: server.protocol.CommandTypes.Reload,
                arguments: { file: f1.path }
            });
            checkScriptInfoAndProjects(f1.content, "contents of closed file");
            assert.notStrictEqual(info.getSnapshot(), snap);
            checkInferredProjectIsOrphan();

            function checkInferredProjectIsOrphan() {
                assert.isTrue(projectService.inferredProjects[0].isOrphan());
                assert.equal(info.containingProjects.length, 0);
            }

            function checkScriptInfoAndProjects(contentsOfInfo: string, captionForContents: string) {
                checkNumberOfProjects(projectService, { inferredProjects: 1 });
                assert.strictEqual(projectService.getScriptInfo(f1.path), info);
                checkScriptInfoContents(contentsOfInfo, captionForContents);
            }

            function checkScriptInfoContents(contentsOfInfo: string, captionForContents: string) {
                const snap = info.getSnapshot();
                assert.equal(getSnapshotText(snap), contentsOfInfo, "content should be equal to " + captionForContents);
            }
        });
    });
}
