//// [foo_0.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_class_call_check"
], function(require, exports, _class_call_check) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var E1, all = {
        get C1 () {
            return C1;
        },
        get E1 () {
            return E11;
        }
    };
    for(var name in all)Object.defineProperty(exports, name, {
        enumerable: !0,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
    new WeakMap();
    var C1 = function C1() {
        _class_call_check._(this, C1), this.m1 = 42;
    }, E11 = ((E1 = {})[E1.A = 0] = "A", E1[E1.B = 1] = "B", E1[E1.C = 2] = "C", E1);
});
//// [foo_1.ts]
define([
    "require"
], function(require) {});
