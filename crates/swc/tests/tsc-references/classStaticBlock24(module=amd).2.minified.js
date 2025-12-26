//// [classStaticBlock24.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_class_call_check"
], function(require, exports, _class_call_check) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "C", {
        enumerable: !0,
        get: function() {
            return C;
        }
    });
    var C = function C() {
        _class_call_check._(this, C);
    };
    C.x = 1;
});
