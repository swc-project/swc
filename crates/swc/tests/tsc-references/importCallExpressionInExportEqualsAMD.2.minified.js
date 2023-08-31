//// [something.ts]
define([
    "require"
], function(require) {
    return 42;
});
//// [index.ts]
define([
    "require",
    "@swc/helpers/_/_interop_require_wildcard"
], function(require, _interop_require_wildcard) {
    return async function() {
        await new Promise((resolve, reject)=>require([
                "./something"
            ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
    };
});
