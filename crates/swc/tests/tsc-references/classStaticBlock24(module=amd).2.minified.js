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
    var __ = new WeakMap(), C = function C() {
        _class_call_check._(this, C);
    };
    __.set(C, {
        writable: !0,
        value: C.x = 1
    });
});
