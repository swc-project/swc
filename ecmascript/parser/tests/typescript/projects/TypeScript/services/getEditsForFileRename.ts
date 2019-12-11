/* @internal */
namespace ts {
    export function getEditsForFileRename(
        program: Program,
        oldFileOrDirPath: string,
        newFileOrDirPath: string,
        host: LanguageServiceHost,
        formatContext: formatting.FormatContext,
        preferences: UserPreferences,
        sourceMapper: SourceMapper,
    ): readonly FileTextChanges[] {
        const useCaseSensitiveFileNames = hostUsesCaseSensitiveFileNames(host);
        const getCanonicalFileName = createGetCanonicalFileName(useCaseSensitiveFileNames);
        const oldToNew = getPathUpdater(oldFileOrDirPath, newFileOrDirPath, getCanonicalFileName, sourceMapper);
        const newToOld = getPathUpdater(newFileOrDirPath, oldFileOrDirPath, getCanonicalFileName, sourceMapper);
        return textChanges.ChangeTracker.with({ host, formatContext, preferences }, changeTracker => {
            updateTsconfigFiles(program, changeTracker, oldToNew, oldFileOrDirPath, newFileOrDirPath, host.getCurrentDirectory(), useCaseSensitiveFileNames);
            updateImports(program, changeTracker, oldToNew, newToOld, host, getCanonicalFileName);
        });
    }

    /** If 'path' refers to an old directory, returns path in the new directory. */
    type PathUpdater = (path: string) => string | undefined;
    // exported for tests
    export function getPathUpdater(oldFileOrDirPath: string, newFileOrDirPath: string, getCanonicalFileName: GetCanonicalFileName, sourceMapper: SourceMapper | undefined): PathUpdater {
        const canonicalOldPath = getCanonicalFileName(oldFileOrDirPath);
        return path => {
            const originalPath = sourceMapper && sourceMapper.tryGetSourcePosition({ fileName: path, pos: 0 });
            const updatedPath = getUpdatedPath(originalPath ? originalPath.fileName : path);
            return originalPath
                ? updatedPath === undefined ? undefined : makeCorrespondingRelativeChange(originalPath.fileName, updatedPath, path, getCanonicalFileName)
                : updatedPath;
        };

        function getUpdatedPath(pathToUpdate: string): string | undefined {
            if (getCanonicalFileName(pathToUpdate) === canonicalOldPath) return newFileOrDirPath;
            const suffix = tryRemoveDirectoryPrefix(pathToUpdate, canonicalOldPath, getCanonicalFileName);
            return suffix === undefined ? undefined : newFileOrDirPath + "/" + suffix;
        }
    }

    // Relative path from a0 to b0 should be same as relative path from a1 to b1. Returns b1.
    function makeCorrespondingRelativeChange(a0: string, b0: string, a1: string, getCanonicalFileName: GetCanonicalFileName): string {
        const rel = getRelativePathFromFile(a0, b0, getCanonicalFileName);
        return combinePathsSafe(getDirectoryPath(a1), rel);
    }

    function updateTsconfigFiles(program: Program, changeTracker: textChanges.ChangeTracker, oldToNew: PathUpdater, oldFileOrDirPath: string, newFileOrDirPath: string, currentDirectory: string, useCaseSensitiveFileNames: boolean): void {
        const { configFile } = program.getCompilerOptions();
        if (!configFile) return;
        const configDir = getDirectoryPath(configFile.fileName);

        const jsonObjectLiteral = getTsConfigObjectLiteralExpression(configFile);
        if (!jsonObjectLiteral) return;

        forEachProperty(jsonObjectLiteral, (property, propertyName) => {
            switch (propertyName) {
                case "files":
                case "include":
                case "exclude": {
                    const foundExactMatch = updatePaths(property);
                    if (!foundExactMatch && propertyName === "include" && isArrayLiteralExpression(property.initializer)) {
                        const includes = mapDefined(property.initializer.elements, e => isStringLiteral(e) ? e.text : undefined);
                        const matchers = getFileMatcherPatterns(configDir, /*excludes*/ [], includes, useCaseSensitiveFileNames, currentDirectory);
                        // If there isn't some include for this, add a new one.
                        if (getRegexFromPattern(Debug.assertDefined(matchers.includeFilePattern), useCaseSensitiveFileNames).test(oldFileOrDirPath) &&
                            !getRegexFromPattern(Debug.assertDefined(matchers.includeFilePattern), useCaseSensitiveFileNames).test(newFileOrDirPath)) {
                            changeTracker.insertNodeAfter(configFile, last(property.initializer.elements), createStringLiteral(relativePath(newFileOrDirPath)));
                        }
                    }
                    break;
                }
                case "compilerOptions":
                    forEachProperty(property.initializer, (property, propertyName) => {
                        const option = getOptionFromName(propertyName);
                        if (option && (option.isFilePath || option.type === "list" && option.element.isFilePath)) {
                            updatePaths(property);
                        }
                        else if (propertyName === "paths") {
                            forEachProperty(property.initializer, (pathsProperty) => {
                                if (!isArrayLiteralExpression(pathsProperty.initializer)) return;
                                for (const e of pathsProperty.initializer.elements) {
                                    tryUpdateString(e);
                                }
                            });
                        }
                    });
                    break;
            }
        });

        function updatePaths(property: PropertyAssignment): boolean {
            // Type annotation needed due to #7294
            const elements: readonly Expression[] = isArrayLiteralExpression(property.initializer) ? property.initializer.elements : [property.initializer];
            let foundExactMatch = false;
            for (const element of elements) {
                foundExactMatch = tryUpdateString(element) || foundExactMatch;
            }
            return foundExactMatch;
        }

        function tryUpdateString(element: Expression): boolean {
            if (!isStringLiteral(element)) return false;
            const elementFileName = combinePathsSafe(configDir, element.text);

            const updated = oldToNew(elementFileName);
            if (updated !== undefined) {
                changeTracker.replaceRangeWithText(configFile!, createStringRange(element, configFile!), relativePath(updated));
                return true;
            }
            return false;
        }

        function relativePath(path: string): string {
            return getRelativePathFromDirectory(configDir, path, /*ignoreCase*/ !useCaseSensitiveFileNames);
        }
    }

    function updateImports(
        program: Program,
        changeTracker: textChanges.ChangeTracker,
        oldToNew: PathUpdater,
        newToOld: PathUpdater,
        host: LanguageServiceHost,
        getCanonicalFileName: GetCanonicalFileName,
    ): void {
        const allFiles = program.getSourceFiles();
        for (const sourceFile of allFiles) {
            const newFromOld = oldToNew(sourceFile.path) as Path;
            const newImportFromPath = newFromOld !== undefined ? newFromOld : sourceFile.path;
            const newImportFromDirectory = getDirectoryPath(newImportFromPath);

            const oldFromNew: string | undefined = newToOld(sourceFile.fileName);
            const oldImportFromPath: string = oldFromNew || sourceFile.fileName;
            const oldImportFromDirectory = getDirectoryPath(oldImportFromPath);

            const importingSourceFileMoved = newFromOld !== undefined || oldFromNew !== undefined;

            updateImportsWorker(sourceFile, changeTracker,
                referenceText => {
                    if (!pathIsRelative(referenceText)) return undefined;
                    const oldAbsolute = combinePathsSafe(oldImportFromDirectory, referenceText);
                    const newAbsolute = oldToNew(oldAbsolute);
                    return newAbsolute === undefined ? undefined : ensurePathIsNonModuleName(getRelativePathFromDirectory(newImportFromDirectory, newAbsolute, getCanonicalFileName));
                },
                importLiteral => {
                    const importedModuleSymbol = program.getTypeChecker().getSymbolAtLocation(importLiteral);
                    // No need to update if it's an ambient module^M
                    if (importedModuleSymbol && importedModuleSymbol.declarations.some(d => isAmbientModule(d))) return undefined;

                    const toImport = oldFromNew !== undefined
                        // If we're at the new location (file was already renamed), need to redo module resolution starting from the old location.
                        // TODO:GH#18217
                        ? getSourceFileToImportFromResolved(resolveModuleName(importLiteral.text, oldImportFromPath, program.getCompilerOptions(), host as ModuleResolutionHost), oldToNew)
                        : getSourceFileToImport(importedModuleSymbol, importLiteral, sourceFile, program, host, oldToNew);

                    // Need an update if the imported file moved, or the importing file moved and was using a relative path.
                    return toImport !== undefined && (toImport.updated || (importingSourceFileMoved && pathIsRelative(importLiteral.text)))
                        ? moduleSpecifiers.updateModuleSpecifier(program.getCompilerOptions(), newImportFromPath, toImport.newFileName, host, allFiles, program.redirectTargetsMap, importLiteral.text)
                        : undefined;
                });
        }
    }

    function combineNormal(pathA: string, pathB: string): string {
        return normalizePath(combinePaths(pathA, pathB));
    }
    function combinePathsSafe(pathA: string, pathB: string): string {
        return ensurePathIsNonModuleName(combineNormal(pathA, pathB));
    }

    interface ToImport {
        readonly newFileName: string;
        /** True if the imported file was renamed. */
        readonly updated: boolean;
    }
    function getSourceFileToImport(
        importedModuleSymbol: Symbol | undefined,
        importLiteral: StringLiteralLike,
        importingSourceFile: SourceFile,
        program: Program,
        host: LanguageServiceHost,
        oldToNew: PathUpdater,
    ): ToImport | undefined {
        if (importedModuleSymbol) {
            // `find` should succeed because we checked for ambient modules before calling this function.
            const oldFileName = find(importedModuleSymbol.declarations, isSourceFile)!.fileName;
            const newFileName = oldToNew(oldFileName);
            return newFileName === undefined ? { newFileName: oldFileName, updated: false } : { newFileName, updated: true };
        }
        else {
            const resolved = host.resolveModuleNames
                ? host.getResolvedModuleWithFailedLookupLocationsFromCache && host.getResolvedModuleWithFailedLookupLocationsFromCache(importLiteral.text, importingSourceFile.fileName)
                : program.getResolvedModuleWithFailedLookupLocationsFromCache(importLiteral.text, importingSourceFile.fileName);
            return getSourceFileToImportFromResolved(resolved, oldToNew);
        }
    }

    function getSourceFileToImportFromResolved(resolved: ResolvedModuleWithFailedLookupLocations | undefined, oldToNew: PathUpdater): ToImport | undefined {
        // Search through all locations looking for a moved file, and only then test already existing files.
        // This is because if `a.ts` is compiled to `a.js` and `a.ts` is moved, we don't want to resolve anything to `a.js`, but to `a.ts`'s new location.
        if (!resolved) return undefined;

        // First try resolved module
        if (resolved.resolvedModule) {
            const result = tryChange(resolved.resolvedModule.resolvedFileName);
            if (result) return result;
        }

        // Then failed lookups except package.json since we dont want to touch them (only included ts/js files)
        const result = forEach(resolved.failedLookupLocations, tryChangeWithIgnoringPackageJson);
        if (result) return result;

        // If nothing changed, then result is resolved module file thats not updated
        return resolved.resolvedModule && { newFileName: resolved.resolvedModule.resolvedFileName, updated: false };

        function tryChangeWithIgnoringPackageJson(oldFileName: string) {
            return !endsWith(oldFileName, "/package.json") ? tryChange(oldFileName) : undefined;
        }

        function tryChange(oldFileName: string) {
            const newFileName = oldToNew(oldFileName);
            return newFileName && { newFileName, updated: true };
        }
    }

    function updateImportsWorker(sourceFile: SourceFile, changeTracker: textChanges.ChangeTracker, updateRef: (refText: string) => string | undefined, updateImport: (importLiteral: StringLiteralLike) => string | undefined) {
        for (const ref of sourceFile.referencedFiles || emptyArray) { // TODO: GH#26162
            const updated = updateRef(ref.fileName);
            if (updated !== undefined && updated !== sourceFile.text.slice(ref.pos, ref.end)) changeTracker.replaceRangeWithText(sourceFile, ref, updated);
        }

        for (const importStringLiteral of sourceFile.imports) {
            const updated = updateImport(importStringLiteral);
            if (updated !== undefined && updated !== importStringLiteral.text) changeTracker.replaceRangeWithText(sourceFile, createStringRange(importStringLiteral, sourceFile), updated);
        }
    }

    function createStringRange(node: StringLiteralLike, sourceFile: SourceFileLike): TextRange {
        return createRange(node.getStart(sourceFile) + 1, node.end - 1);
    }

    function forEachProperty(objectLiteral: Expression, cb: (property: PropertyAssignment, propertyName: string) => void) {
        if (!isObjectLiteralExpression(objectLiteral)) return;
        for (const property of objectLiteral.properties) {
            if (isPropertyAssignment(property) && isStringLiteral(property.name)) {
                cb(property, property.name.text);
            }
        }
    }
}
