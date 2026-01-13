//// [foo_0.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_class_call_check"
], function(require, exports, _class_call_check) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "C1", {
        enumerable: !0,
        get: function() {
            return C1;
        }
    });
    var C1 = function C1() {
        _class_call_check._(this, C1), this.m1 = 42;
    };
    C1.s1 = !0;
});
//// [foo_1.ts]
define([
    "require"
], function(require) {});
//// [foo_2.ts]
define([
    "require",
    "exports",
    "./foo_1"
], function(require, exports, _foo_1) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
});
