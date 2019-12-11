/* @internal */
namespace ts.JsTyping {

    export interface TypingResolutionHost {
        directoryExists(path: string): boolean;
        fileExists(fileName: string): boolean;
        readFile(path: string, encoding?: string): string | undefined;
        readDirectory(rootDir: string, extensions: readonly string[], excludes: readonly string[] | undefined, includes: readonly string[] | undefined, depth?: number): string[];
    }

    interface PackageJson {
        _requiredBy?: string[];
        dependencies?: MapLike<string>;
        devDependencies?: MapLike<string>;
        name?: string;
        optionalDependencies?: MapLike<string>;
        peerDependencies?: MapLike<string>;
        types?: string;
        typings?: string;
    }

    export interface CachedTyping {
        typingLocation: string;
        version: Version;
    }

    export function isTypingUpToDate(cachedTyping: CachedTyping, availableTypingVersions: MapLike<string>) {
        const availableVersion = new Version(getProperty(availableTypingVersions, `ts${versionMajorMinor}`) || getProperty(availableTypingVersions, "latest")!);
        return availableVersion.compareTo(cachedTyping.version) <= 0;
    }

    export const nodeCoreModuleList: readonly string[] = [
        "assert",
        "async_hooks",
        "buffer",
        "child_process",
        "cluster",
        "console",
        "constants",
        "crypto",
        "dgram",
        "dns",
        "domain",
        "events",
        "fs",
        "http",
        "https",
        "http2",
        "inspector",
        "net",
        "os",
        "path",
        "perf_hooks",
        "process",
        "punycode",
        "querystring",
        "readline",
        "repl",
        "stream",
        "string_decoder",
        "timers",
        "tls",
        "tty",
        "url",
        "util",
        "v8",
        "vm",
        "zlib"
    ];

    export const nodeCoreModules = arrayToSet(nodeCoreModuleList);

    export function nonRelativeModuleNameForTypingCache(moduleName: string) {
        return nodeCoreModules.has(moduleName) ? "node" : moduleName;
    }

    /**
     * A map of loose file names to library names that we are confident require typings
     */
    export type SafeList = ReadonlyMap<string>;

    export function loadSafeList(host: TypingResolutionHost, safeListPath: Path): SafeList {
        const result = readConfigFile(safeListPath, path => host.readFile(path));
        return createMapFromTemplate<string>(result.config);
    }

    export function loadTypesMap(host: TypingResolutionHost, typesMapPath: Path): SafeList | undefined {
        const result = readConfigFile(typesMapPath, path => host.readFile(path));
        if (result.config) {
            return createMapFromTemplate<string>(result.config.simpleMap);
        }
        return undefined;
    }

    /**
     * @param host is the object providing I/O related operations.
     * @param fileNames are the file names that belong to the same project
     * @param projectRootPath is the path to the project root directory
     * @param safeListPath is the path used to retrieve the safe list
     * @param packageNameToTypingLocation is the map of package names to their cached typing locations and installed versions
     * @param typeAcquisition is used to customize the typing acquisition process
     * @param compilerOptions are used as a source for typing inference
     */
    export function discoverTypings(
        host: TypingResolutionHost,
        log: ((message: string) => void) | undefined,
        fileNames: string[],
        projectRootPath: Path,
        safeList: SafeList,
        packageNameToTypingLocation: ReadonlyMap<CachedTyping>,
        typeAcquisition: TypeAcquisition,
        unresolvedImports: readonly string[],
        typesRegistry: ReadonlyMap<MapLike<string>>):
        { cachedTypingPaths: string[], newTypingNames: string[], filesToWatch: string[] } {

        if (!typeAcquisition || !typeAcquisition.enable) {
            return { cachedTypingPaths: [], newTypingNames: [], filesToWatch: [] };
        }

        // A typing name to typing file path mapping
        const inferredTypings = createMap<string>();

        // Only infer typings for .js and .jsx files
        fileNames = mapDefined(fileNames, fileName => {
            const path = normalizePath(fileName);
            if (hasJSFileExtension(path)) {
                return path;
            }
        });

        const filesToWatch: string[] = [];

        if (typeAcquisition.include) addInferredTypings(typeAcquisition.include, "Explicitly included types");
        const exclude = typeAcquisition.exclude || [];

        // Directories to search for package.json, bower.json and other typing information
        const possibleSearchDirs = arrayToSet(fileNames, getDirectoryPath);
        possibleSearchDirs.set(projectRootPath, true);
        possibleSearchDirs.forEach((_true, searchDir) => {
            const packageJsonPath = combinePaths(searchDir, "package.json");
            getTypingNamesFromJson(packageJsonPath, filesToWatch);

            const bowerJsonPath = combinePaths(searchDir, "bower.json");
            getTypingNamesFromJson(bowerJsonPath, filesToWatch);

            const bowerComponentsPath = combinePaths(searchDir, "bower_components");
            getTypingNamesFromPackagesFolder(bowerComponentsPath, filesToWatch);

            const nodeModulesPath = combinePaths(searchDir, "node_modules");
            getTypingNamesFromPackagesFolder(nodeModulesPath, filesToWatch);
        });
        getTypingNamesFromSourceFileNames(fileNames);

        // add typings for unresolved imports
        if (unresolvedImports) {
            const module = deduplicate<string>(
                unresolvedImports.map(nonRelativeModuleNameForTypingCache),
                equateStringsCaseSensitive,
                compareStringsCaseSensitive);
            addInferredTypings(module, "Inferred typings from unresolved imports");
        }
        // Add the cached typing locations for inferred typings that are already installed
        packageNameToTypingLocation.forEach((typing, name) => {
            const registryEntry = typesRegistry.get(name);
            if (inferredTypings.has(name) && inferredTypings.get(name) === undefined && registryEntry !== undefined && isTypingUpToDate(typing, registryEntry)) {
                inferredTypings.set(name, typing.typingLocation);
            }
        });

        // Remove typings that the user has added to the exclude list
        for (const excludeTypingName of exclude) {
            const didDelete = inferredTypings.delete(excludeTypingName);
            if (didDelete && log) log(`Typing for ${excludeTypingName} is in exclude list, will be ignored.`);
        }

        const newTypingNames: string[] = [];
        const cachedTypingPaths: string[] = [];
        inferredTypings.forEach((inferred, typing) => {
            if (inferred !== undefined) {
                cachedTypingPaths.push(inferred);
            }
            else {
                newTypingNames.push(typing);
            }
        });
        const result = { cachedTypingPaths, newTypingNames, filesToWatch };
        if (log) log(`Result: ${JSON.stringify(result)}`);
        return result;

        function addInferredTyping(typingName: string) {
            if (!inferredTypings.has(typingName)) {
                inferredTypings.set(typingName, undefined!); // TODO: GH#18217
            }
        }
        function addInferredTypings(typingNames: readonly string[], message: string) {
            if (log) log(`${message}: ${JSON.stringify(typingNames)}`);
            forEach(typingNames, addInferredTyping);
        }

        /**
         * Get the typing info from common package manager json files like package.json or bower.json
         */
        function getTypingNamesFromJson(jsonPath: string, filesToWatch: Push<string>) {
            if (!host.fileExists(jsonPath)) {
                return;
            }

            filesToWatch.push(jsonPath);
            const jsonConfig: PackageJson = readConfigFile(jsonPath, path => host.readFile(path)).config;
            const jsonTypingNames = flatMap([jsonConfig.dependencies, jsonConfig.devDependencies, jsonConfig.optionalDependencies, jsonConfig.peerDependencies], getOwnKeys);
            addInferredTypings(jsonTypingNames, `Typing names in '${jsonPath}' dependencies`);
        }

        /**
         * Infer typing names from given file names. For example, the file name "jquery-min.2.3.4.js"
         * should be inferred to the 'jquery' typing name; and "angular-route.1.2.3.js" should be inferred
         * to the 'angular-route' typing name.
         * @param fileNames are the names for source files in the project
         */
        function getTypingNamesFromSourceFileNames(fileNames: string[]) {
            const fromFileNames = mapDefined(fileNames, j => {
                if (!hasJSFileExtension(j)) return undefined;

                const inferredTypingName = removeFileExtension(getBaseFileName(j.toLowerCase()));
                const cleanedTypingName = removeMinAndVersionNumbers(inferredTypingName);
                return safeList.get(cleanedTypingName);
            });
            if (fromFileNames.length) {
                addInferredTypings(fromFileNames, "Inferred typings from file names");
            }

            const hasJsxFile = some(fileNames, f => fileExtensionIs(f, Extension.Jsx));
            if (hasJsxFile) {
                if (log) log(`Inferred 'react' typings due to presence of '.jsx' extension`);
                addInferredTyping("react");
            }
        }

        /**
         * Infer typing names from packages folder (ex: node_module, bower_components)
         * @param packagesFolderPath is the path to the packages folder
         */
        function getTypingNamesFromPackagesFolder(packagesFolderPath: string, filesToWatch: Push<string>) {
            filesToWatch.push(packagesFolderPath);

            // Todo: add support for ModuleResolutionHost too
            if (!host.directoryExists(packagesFolderPath)) {
                return;
            }

            // depth of 2, so we access `node_modules/foo` but not `node_modules/foo/bar`
            const fileNames = host.readDirectory(packagesFolderPath, [Extension.Json], /*excludes*/ undefined, /*includes*/ undefined, /*depth*/ 2);
            if (log) log(`Searching for typing names in ${packagesFolderPath}; all files: ${JSON.stringify(fileNames)}`);
            const packageNames: string[] = [];
            for (const fileName of fileNames) {
                const normalizedFileName = normalizePath(fileName);
                const baseFileName = getBaseFileName(normalizedFileName);
                if (baseFileName !== "package.json" && baseFileName !== "bower.json") {
                    continue;
                }
                const result = readConfigFile(normalizedFileName, (path: string) => host.readFile(path));
                const packageJson: PackageJson = result.config;

                // npm 3's package.json contains a "_requiredBy" field
                // we should include all the top level module names for npm 2, and only module names whose
                // "_requiredBy" field starts with "#" or equals "/" for npm 3.
                if (baseFileName === "package.json" && packageJson._requiredBy &&
                    filter(packageJson._requiredBy, (r: string) => r[0] === "#" || r === "/").length === 0) {
                    continue;
                }

                // If the package has its own d.ts typings, those will take precedence. Otherwise the package name will be used
                // to download d.ts files from DefinitelyTyped
                if (!packageJson.name) {
                    continue;
                }
                const ownTypes = packageJson.types || packageJson.typings;
                if (ownTypes) {
                    const absolutePath = getNormalizedAbsolutePath(ownTypes, getDirectoryPath(normalizedFileName));
                    if (log) log(`    Package '${packageJson.name}' provides its own types.`);
                    inferredTypings.set(packageJson.name, absolutePath);
                }
                else {
                    packageNames.push(packageJson.name);
                }
            }
            addInferredTypings(packageNames, "    Found package names");
        }

    }

    export const enum NameValidationResult {
        Ok,
        EmptyName,
        NameTooLong,
        NameStartsWithDot,
        NameStartsWithUnderscore,
        NameContainsNonURISafeCharacters
    }

    const maxPackageNameLength = 214;

    export interface ScopedPackageNameValidationResult {
        name: string;
        isScopeName: boolean;
        result: NameValidationResult;
    }
    export type PackageNameValidationResult = NameValidationResult | ScopedPackageNameValidationResult;

    /**
     * Validates package name using rules defined at https://docs.npmjs.com/files/package.json
     */
    export function validatePackageName(packageName: string): PackageNameValidationResult {
        return validatePackageNameWorker(packageName, /*supportScopedPackage*/ true);
    }

    function validatePackageNameWorker(packageName: string, supportScopedPackage: false): NameValidationResult;
    function validatePackageNameWorker(packageName: string, supportScopedPackage: true): PackageNameValidationResult;
    function validatePackageNameWorker(packageName: string, supportScopedPackage: boolean): PackageNameValidationResult {
        if (!packageName) {
            return NameValidationResult.EmptyName;
        }
        if (packageName.length > maxPackageNameLength) {
            return NameValidationResult.NameTooLong;
        }
        if (packageName.charCodeAt(0) === CharacterCodes.dot) {
            return NameValidationResult.NameStartsWithDot;
        }
        if (packageName.charCodeAt(0) === CharacterCodes._) {
            return NameValidationResult.NameStartsWithUnderscore;
        }
        // check if name is scope package like: starts with @ and has one '/' in the middle
        // scoped packages are not currently supported
        if (supportScopedPackage) {
            const matches = /^@([^/]+)\/([^/]+)$/.exec(packageName);
            if (matches) {
                const scopeResult = validatePackageNameWorker(matches[1], /*supportScopedPackage*/ false);
                if (scopeResult !== NameValidationResult.Ok) {
                    return { name: matches[1], isScopeName: true, result: scopeResult };
                }
                const packageResult = validatePackageNameWorker(matches[2], /*supportScopedPackage*/ false);
                if (packageResult !== NameValidationResult.Ok) {
                    return { name: matches[2], isScopeName: false, result: packageResult };
                }
                return NameValidationResult.Ok;
            }
        }
        if (encodeURIComponent(packageName) !== packageName) {
            return NameValidationResult.NameContainsNonURISafeCharacters;
        }
        return NameValidationResult.Ok;
    }

    export function renderPackageNameValidationFailure(result: PackageNameValidationResult, typing: string): string {
        return typeof result === "object" ?
            renderPackageNameValidationFailureWorker(typing, result.result, result.name, result.isScopeName) :
            renderPackageNameValidationFailureWorker(typing, result, typing, /*isScopeName*/ false);
    }

    function renderPackageNameValidationFailureWorker(typing: string, result: NameValidationResult, name: string, isScopeName: boolean): string {
        const kind = isScopeName ? "Scope" : "Package";
        switch (result) {
            case NameValidationResult.EmptyName:
                return `'${typing}':: ${kind} name '${name}' cannot be empty`;
            case NameValidationResult.NameTooLong:
                return `'${typing}':: ${kind} name '${name}' should be less than ${maxPackageNameLength} characters`;
            case NameValidationResult.NameStartsWithDot:
                return `'${typing}':: ${kind} name '${name}' cannot start with '.'`;
            case NameValidationResult.NameStartsWithUnderscore:
                return `'${typing}':: ${kind} name '${name}' cannot start with '_'`;
            case NameValidationResult.NameContainsNonURISafeCharacters:
                return `'${typing}':: ${kind} name '${name}' contains non URI safe characters`;
            case NameValidationResult.Ok:
                return Debug.fail(); // Shouldn't have called this.
            default:
                throw Debug.assertNever(result);
        }
    }
}
