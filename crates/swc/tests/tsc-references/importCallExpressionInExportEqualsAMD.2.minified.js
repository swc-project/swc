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
], function(require, _interop_require_wildcard) {
    return _interop_require_wildcard = _interop_require_wildcard.default, async function() {
        await new Promise((resolve, reject)=>require([
                "./something"
            ], (m)=>resolve(_interop_require_wildcard(m)), reject));
    };
});
