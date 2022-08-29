//// [classStaticBlock24.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _classCallCheck) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "C", {
        enumerable: !0,
        get: function() {
            return C;
        }
    }), _classCallCheck = _classCallCheck.default;
    var C = function C() {
        "use strict";
        _classCallCheck(this, C);
    };
    C.x = 1;
});
