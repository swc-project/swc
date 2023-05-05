//// [something.ts]
define([
    "require"
], function(require) {
    "use strict";
    return 42;
});
//// [index.ts]
define([
    "require",
    "@swc/helpers/_/_interop_require_wildcard"
], function(require, _interop_require_wildcard) {
    "use strict";
    return async function() {
        const something = await new Promise((resolve, reject)=>require([
                "./something"
            ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
    };
});
