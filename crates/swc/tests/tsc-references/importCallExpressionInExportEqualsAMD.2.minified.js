//// [something.ts]
define([
    "require"
], function(require) {
    return 42;
});
//// [index.ts]
define([
    "require",
    "@swc/helpers/src/_interop_require_wildcard.mjs"
], function(require, _interopRequireWildcard) {
    return _interopRequireWildcard = _interopRequireWildcard.default, async function() {
        await new Promise((resolve, reject)=>require([
                "./something"
            ], (m)=>resolve(_interopRequireWildcard(m)), reject));
    };
});
