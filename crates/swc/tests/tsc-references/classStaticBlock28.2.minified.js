//// [classStaticBlock28.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var foo, C = function C() {
    "use strict";
    _class_call_check(this, C);
}, __ = {
    writable: !0,
    value: void (foo = 1)
};
console.log(foo);
