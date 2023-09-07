//// [constructSignaturesWithOverloads2.ts]
// No errors expected for basic overloads of construct signatures with merged declarations
// clodules
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C, x, C2, x1, i2, C1 = function C(x) {
    _class_call_check(this, C);
};
C = C1 || (C1 = {}), x = 1, Object.defineProperty(C, "x", {
    enumerable: !0,
    get: function() {
        return x;
    },
    set: function(v) {
        x = v;
    }
}), new C1(1, "");
var C21 = function C2(x) {
    _class_call_check(this, C2);
};
C2 = C21 || (C21 = {}), x1 = 1, Object.defineProperty(C2, "x", {
    enumerable: !0,
    get: function() {
        return x1;
    },
    set: function(v) {
        x1 = v;
    }
}), new C21(1, ""), new i2(1, ""), new i2(1, 1);
