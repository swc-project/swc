//// [instanceMemberWithComputedPropertyName.ts]
"use strict";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var x = 1, _x = x, C = function C() {
    _class_call_check(this, C), this[_x] = !0;
    var ref = {
        a: 1,
        b: 2
    };
    ref.a, ref.b;
};
