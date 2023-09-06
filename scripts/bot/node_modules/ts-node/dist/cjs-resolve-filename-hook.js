"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installCommonjsResolveHookIfNecessary = void 0;
/**
 * @internal
 */
function installCommonjsResolveHookIfNecessary(tsNodeService) {
    const Module = require('module');
    const originalResolveFilename = Module._resolveFilename;
    const shouldInstallHook = tsNodeService.options.experimentalResolverFeatures;
    if (shouldInstallHook) {
        Module._resolveFilename = _resolveFilename;
    }
    function _resolveFilename(request, parent, isMain, options, ...rest) {
        if (!tsNodeService.enabled())
            return originalResolveFilename.call(this, request, parent, isMain, options, ...rest);
        // This is a stub to support other pull requests that will be merged in the near future
        // Right now, it does nothing.
        return originalResolveFilename.call(this, request, parent, isMain, options, ...rest);
    }
}
exports.installCommonjsResolveHookIfNecessary = installCommonjsResolveHookIfNecessary;
//# sourceMappingURL=cjs-resolve-filename-hook.js.map