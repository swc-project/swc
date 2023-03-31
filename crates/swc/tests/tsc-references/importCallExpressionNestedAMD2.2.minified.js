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
        get: function() {
            return _default;
        }
    });
    var _default = "./foo";
});
//// [index.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_async_to_generator.mjs",
    "@swc/helpers/src/_interop_require_wildcard.mjs",
    "@swc/helpers/src/_ts_generator.mjs"
], function(require, exports, _async_to_generator, _interop_require_wildcard, _ts_generator) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _async_to_generator = _async_to_generator.default, _interop_require_wildcard = _interop_require_wildcard.default, _ts_generator = _ts_generator.default;
});
