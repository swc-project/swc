//// [classStaticBlock24.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _class_call_check) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "C", {
        enumerable: !0,
        get: function() {
            return C;
        }
    }), _class_call_check = _class_call_check.default;
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    C.x = 1;
});
