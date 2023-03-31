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
    "@swc/helpers/src/_async_to_generator.mjs",
    "@swc/helpers/src/_interop_require_wildcard.mjs"
], function(require, exports, _async_to_generator, _interop_require_wildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _async_to_generator = _async_to_generator.default, _interop_require_wildcard = _interop_require_wildcard.default;
});
