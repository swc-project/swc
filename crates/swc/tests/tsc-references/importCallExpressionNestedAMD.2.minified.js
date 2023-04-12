//// [foo.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: ()=>_default
    });
    let _default = "./foo";
});
//// [index.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_async_to_generator",
    "@swc/helpers/_/_interop_require_wildcard"
], function(require, exports, _async_to_generator, _interop_require_wildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
});
