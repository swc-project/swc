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
], function(require, exports, _asyncToGenerator, _interopRequireWildcard, _tsGenerator) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _asyncToGenerator = _asyncToGenerator.default, _interopRequireWildcard = _interopRequireWildcard.default, _tsGenerator = _tsGenerator.default;
});
