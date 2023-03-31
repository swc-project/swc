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
    "@swc/helpers/src/_interop_require_wildcard.mjs"
], function(require, _interop_require_wildcard) {
    "use strict";
    _interop_require_wildcard = _interop_require_wildcard.default;
    return async function() {
        const something = await new Promise((resolve, reject)=>require([
                "./something"
            ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject));
    };
});
