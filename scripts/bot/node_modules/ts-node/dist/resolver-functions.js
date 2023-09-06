"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResolverFunctions = void 0;
const path_1 = require("path");
/**
 * @internal
 * In a factory because these are shared across both CompilerHost and LanguageService codepaths
 */
function createResolverFunctions(kwargs) {
    const { host, ts, config, cwd, getCanonicalFileName, projectLocalResolveHelper, } = kwargs;
    const moduleResolutionCache = ts.createModuleResolutionCache(cwd, getCanonicalFileName, config.options);
    const knownInternalFilenames = new Set();
    /** "Buckets" (module directories) whose contents should be marked "internal" */
    const internalBuckets = new Set();
    // Get bucket for a source filename.  Bucket is the containing `./node_modules/*/` directory
    // For '/project/node_modules/foo/node_modules/bar/lib/index.js' bucket is '/project/node_modules/foo/node_modules/bar/'
    // For '/project/node_modules/foo/node_modules/@scope/bar/lib/index.js' bucket is '/project/node_modules/foo/node_modules/@scope/bar/'
    const moduleBucketRe = /.*\/node_modules\/(?:@[^\/]+\/)?[^\/]+\//;
    function getModuleBucket(filename) {
        const find = moduleBucketRe.exec(filename);
        if (find)
            return find[0];
        return '';
    }
    // Mark that this file and all siblings in its bucket should be "internal"
    function markBucketOfFilenameInternal(filename) {
        internalBuckets.add(getModuleBucket(filename));
    }
    function isFileInInternalBucket(filename) {
        return internalBuckets.has(getModuleBucket(filename));
    }
    function isFileKnownToBeInternal(filename) {
        return knownInternalFilenames.has(filename);
    }
    /**
     * If we need to emit JS for a file, force TS to consider it non-external
     */
    const fixupResolvedModule = (resolvedModule) => {
        const { resolvedFileName } = resolvedModule;
        if (resolvedFileName === undefined)
            return;
        // .ts is always switched to internal
        // .js is switched on-demand
        if (resolvedModule.isExternalLibraryImport &&
            ((resolvedFileName.endsWith('.ts') &&
                !resolvedFileName.endsWith('.d.ts')) ||
                isFileKnownToBeInternal(resolvedFileName) ||
                isFileInInternalBucket(resolvedFileName))) {
            resolvedModule.isExternalLibraryImport = false;
        }
        if (!resolvedModule.isExternalLibraryImport) {
            knownInternalFilenames.add(resolvedFileName);
        }
    };
    /*
     * NOTE:
     * Older ts versions do not pass `redirectedReference` nor `options`.
     * We must pass `redirectedReference` to newer ts versions, but cannot rely on `options`, hence the weird argument name
     */
    const resolveModuleNames = (moduleNames, containingFile, reusedNames, redirectedReference, optionsOnlyWithNewerTsVersions) => {
        return moduleNames.map((moduleName) => {
            const { resolvedModule } = ts.resolveModuleName(moduleName, containingFile, config.options, host, moduleResolutionCache, redirectedReference);
            if (resolvedModule) {
                fixupResolvedModule(resolvedModule);
            }
            return resolvedModule;
        });
    };
    // language service never calls this, but TS docs recommend that we implement it
    const getResolvedModuleWithFailedLookupLocationsFromCache = (moduleName, containingFile) => {
        const ret = ts.resolveModuleNameFromCache(moduleName, containingFile, moduleResolutionCache);
        if (ret && ret.resolvedModule) {
            fixupResolvedModule(ret.resolvedModule);
        }
        return ret;
    };
    const resolveTypeReferenceDirectives = (typeDirectiveNames, containingFile, redirectedReference, options) => {
        // Note: seems to be called with empty typeDirectiveNames array for all files.
        return typeDirectiveNames.map((typeDirectiveName) => {
            let { resolvedTypeReferenceDirective } = ts.resolveTypeReferenceDirective(typeDirectiveName, containingFile, config.options, host, redirectedReference);
            if (typeDirectiveName === 'node' && !resolvedTypeReferenceDirective) {
                // Resolve @types/node relative to project first, then __dirname (copy logic from elsewhere / refactor into reusable function)
                let typesNodePackageJsonPath;
                try {
                    typesNodePackageJsonPath = projectLocalResolveHelper('@types/node/package.json', true);
                }
                catch { } // gracefully do nothing when @types/node is not installed for any reason
                if (typesNodePackageJsonPath) {
                    const typeRoots = [(0, path_1.resolve)(typesNodePackageJsonPath, '../..')];
                    ({ resolvedTypeReferenceDirective } =
                        ts.resolveTypeReferenceDirective(typeDirectiveName, containingFile, {
                            ...config.options,
                            typeRoots,
                        }, host, redirectedReference));
                }
            }
            if (resolvedTypeReferenceDirective) {
                fixupResolvedModule(resolvedTypeReferenceDirective);
            }
            return resolvedTypeReferenceDirective;
        });
    };
    return {
        resolveModuleNames,
        getResolvedModuleWithFailedLookupLocationsFromCache,
        resolveTypeReferenceDirectives,
        isFileKnownToBeInternal,
        markBucketOfFilenameInternal,
    };
}
exports.createResolverFunctions = createResolverFunctions;
//# sourceMappingURL=resolver-functions.js.map