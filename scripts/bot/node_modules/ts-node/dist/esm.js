"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEsmHooks = exports.registerAndCreateEsmHooks = void 0;
const index_1 = require("./index");
const url_1 = require("url");
const path_1 = require("path");
const assert = require("assert");
const util_1 = require("./util");
const { createResolve, } = require('../dist-raw/node-esm-resolve-implementation');
const { defaultGetFormat } = require('../dist-raw/node-esm-default-get-format');
/** @internal */
function registerAndCreateEsmHooks(opts) {
    // Automatically performs registration just like `-r ts-node/register`
    const tsNodeInstance = (0, index_1.register)(opts);
    return createEsmHooks(tsNodeInstance);
}
exports.registerAndCreateEsmHooks = registerAndCreateEsmHooks;
function createEsmHooks(tsNodeService) {
    tsNodeService.enableExperimentalEsmLoaderInterop();
    // Custom implementation that considers additional file extensions and automatically adds file extensions
    const nodeResolveImplementation = createResolve({
        ...(0, index_1.getExtensions)(tsNodeService.config),
        preferTsExts: tsNodeService.options.preferTsExts,
    });
    // The hooks API changed in node version X so we need to check for backwards compatibility.
    // TODO: When the new API is backported to v12, v14, update these version checks accordingly.
    const newHooksAPI = (0, index_1.versionGteLt)(process.versions.node, '17.0.0') ||
        (0, index_1.versionGteLt)(process.versions.node, '16.12.0', '17.0.0') ||
        (0, index_1.versionGteLt)(process.versions.node, '14.999.999', '15.0.0') ||
        (0, index_1.versionGteLt)(process.versions.node, '12.999.999', '13.0.0');
    // Explicit return type to avoid TS's non-ideal inferred type
    const hooksAPI = newHooksAPI
        ? { resolve, load, getFormat: undefined, transformSource: undefined }
        : { resolve, getFormat, transformSource, load: undefined };
    return hooksAPI;
    function isFileUrlOrNodeStyleSpecifier(parsed) {
        // We only understand file:// URLs, but in node, the specifier can be a node-style `./foo` or `foo`
        const { protocol } = parsed;
        return protocol === null || protocol === 'file:';
    }
    async function resolve(specifier, context, defaultResolve) {
        const defer = async () => {
            const r = await defaultResolve(specifier, context, defaultResolve);
            return r;
        };
        const parsed = (0, url_1.parse)(specifier);
        const { pathname, protocol, hostname } = parsed;
        if (!isFileUrlOrNodeStyleSpecifier(parsed)) {
            return defer();
        }
        if (protocol !== null && protocol !== 'file:') {
            return defer();
        }
        // Malformed file:// URL?  We should always see `null` or `''`
        if (hostname) {
            // TODO file://./foo sets `hostname` to `'.'`.  Perhaps we should special-case this.
            return defer();
        }
        // pathname is the path to be resolved
        return nodeResolveImplementation.defaultResolve(specifier, context, defaultResolve);
    }
    // `load` from new loader hook API (See description at the top of this file)
    async function load(url, context, defaultLoad) {
        var _a;
        // If we get a format hint from resolve() on the context then use it
        // otherwise call the old getFormat() hook using node's old built-in defaultGetFormat() that ships with ts-node
        const format = (_a = context.format) !== null && _a !== void 0 ? _a : (await getFormat(url, context, defaultGetFormat)).format;
        let source = undefined;
        if (format !== 'builtin' && format !== 'commonjs') {
            // Call the new defaultLoad() to get the source
            const { source: rawSource } = await defaultLoad(url, {
                ...context,
                format,
            }, defaultLoad);
            if (rawSource === undefined || rawSource === null) {
                throw new Error(`Failed to load raw source: Format was '${format}' and url was '${url}''.`);
            }
            // Emulate node's built-in old defaultTransformSource() so we can re-use the old transformSource() hook
            const defaultTransformSource = async (source, _context, _defaultTransformSource) => ({ source });
            // Call the old hook
            const { source: transformedSource } = await transformSource(rawSource, { url, format }, defaultTransformSource);
            source = transformedSource;
        }
        return { format, source };
    }
    async function getFormat(url, context, defaultGetFormat) {
        const defer = (overrideUrl = url) => defaultGetFormat(overrideUrl, context, defaultGetFormat);
        const parsed = (0, url_1.parse)(url);
        if (!isFileUrlOrNodeStyleSpecifier(parsed)) {
            return defer();
        }
        const { pathname } = parsed;
        assert(pathname !== null, 'ESM getFormat() hook: URL should never have null pathname');
        const nativePath = (0, url_1.fileURLToPath)(url);
        // If file has .ts, .tsx, or .jsx extension, then ask node how it would treat this file if it were .js
        const ext = (0, path_1.extname)(nativePath);
        let nodeSays;
        if (ext !== '.js' && !tsNodeService.ignored(nativePath)) {
            nodeSays = await defer((0, url_1.format)((0, url_1.pathToFileURL)(nativePath + '.js')));
        }
        else {
            nodeSays = await defer();
        }
        // For files compiled by ts-node that node believes are either CJS or ESM, check if we should override that classification
        if (!tsNodeService.ignored(nativePath) &&
            (nodeSays.format === 'commonjs' || nodeSays.format === 'module')) {
            const { moduleType } = tsNodeService.moduleTypeClassifier.classifyModule((0, util_1.normalizeSlashes)(nativePath));
            if (moduleType === 'cjs') {
                return { format: 'commonjs' };
            }
            else if (moduleType === 'esm') {
                return { format: 'module' };
            }
        }
        return nodeSays;
    }
    async function transformSource(source, context, defaultTransformSource) {
        if (source === null || source === undefined) {
            throw new Error('No source');
        }
        const defer = () => defaultTransformSource(source, context, defaultTransformSource);
        const sourceAsString = typeof source === 'string' ? source : source.toString('utf8');
        const { url } = context;
        const parsed = (0, url_1.parse)(url);
        if (!isFileUrlOrNodeStyleSpecifier(parsed)) {
            return defer();
        }
        const nativePath = (0, url_1.fileURLToPath)(url);
        if (tsNodeService.ignored(nativePath)) {
            return defer();
        }
        const emittedJs = tsNodeService.compile(sourceAsString, nativePath);
        return { source: emittedJs };
    }
}
exports.createEsmHooks = createEsmHooks;
//# sourceMappingURL=esm.js.map