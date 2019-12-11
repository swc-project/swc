namespace ts.projectSystem {
    describe("unittests:: tsserver:: document registry in project service", () => {
        const importModuleContent = `import {a} from "./module1"`;
        const file: File = {
            path: `${projectRoot}/index.ts`,
            content: importModuleContent
        };
        const moduleFile: File = {
            path: `${projectRoot}/module1.d.ts`,
            content: "export const a: number;"
        };
        const configFile: File = {
            path: `${projectRoot}/tsconfig.json`,
            content: JSON.stringify({ files: ["index.ts"] })
        };

        function getProject(service: TestProjectService) {
            return service.configuredProjects.get(configFile.path)!;
        }

        function checkProject(service: TestProjectService, moduleIsOrphan: boolean) {
            // Update the project
            const project = getProject(service);
            project.getLanguageService();
            checkProjectActualFiles(project, [file.path, libFile.path, configFile.path, ...(moduleIsOrphan ? [] : [moduleFile.path])]);
            const moduleInfo = service.getScriptInfo(moduleFile.path)!;
            assert.isDefined(moduleInfo);
            assert.equal(moduleInfo.isOrphan(), moduleIsOrphan);
            const key = service.documentRegistry.getKeyForCompilationSettings(project.getCompilationSettings());
            assert.deepEqual(service.documentRegistry.getLanguageServiceRefCounts(moduleInfo.path), [[key, moduleIsOrphan ? undefined : 1]]);
        }

        function createServiceAndHost() {
            const host = createServerHost([file, moduleFile, libFile, configFile]);
            const service = createProjectService(host);
            service.openClientFile(file.path);
            checkProject(service, /*moduleIsOrphan*/ false);
            return { host, service };
        }

        function changeFileToNotImportModule(service: TestProjectService) {
            const info = service.getScriptInfo(file.path)!;
            service.applyChangesToFile(info, singleIterator({ span: { start: 0, length: importModuleContent.length }, newText: "" }));
            checkProject(service, /*moduleIsOrphan*/ true);
        }

        function changeFileToImportModule(service: TestProjectService) {
            const info = service.getScriptInfo(file.path)!;
            service.applyChangesToFile(info, singleIterator({ span: { start: 0, length: 0 }, newText: importModuleContent }));
            checkProject(service, /*moduleIsOrphan*/ false);
        }

        it("Caches the source file if script info is orphan", () => {
            const { service } = createServiceAndHost();
            const project = getProject(service);

            const moduleInfo = service.getScriptInfo(moduleFile.path)!;
            const sourceFile = moduleInfo.cacheSourceFile!.sourceFile;
            assert.equal(project.getSourceFile(moduleInfo.path), sourceFile);

            // edit file
            changeFileToNotImportModule(service);
            assert.equal(moduleInfo.cacheSourceFile!.sourceFile, sourceFile);

            // write content back
            changeFileToImportModule(service);
            assert.equal(moduleInfo.cacheSourceFile!.sourceFile, sourceFile);
            assert.equal(project.getSourceFile(moduleInfo.path), sourceFile);
        });

        it("Caches the source file if script info is orphan, and orphan script info changes", () => {
            const { host, service } = createServiceAndHost();
            const project = getProject(service);

            const moduleInfo = service.getScriptInfo(moduleFile.path)!;
            const sourceFile = moduleInfo.cacheSourceFile!.sourceFile;
            assert.equal(project.getSourceFile(moduleInfo.path), sourceFile);

            // edit file
            changeFileToNotImportModule(service);
            assert.equal(moduleInfo.cacheSourceFile!.sourceFile, sourceFile);

            const updatedModuleContent = moduleFile.content + "\nexport const b: number;";
            host.writeFile(moduleFile.path, updatedModuleContent);

            // write content back
            changeFileToImportModule(service);
            assert.notEqual(moduleInfo.cacheSourceFile!.sourceFile, sourceFile);
            assert.equal(project.getSourceFile(moduleInfo.path), moduleInfo.cacheSourceFile!.sourceFile);
            assert.equal(moduleInfo.cacheSourceFile!.sourceFile.text, updatedModuleContent);
        });
    });
}
