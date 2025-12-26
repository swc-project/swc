//// [classStaticBlock28.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap();
var foo;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
__.set(C, {
    writable: true,
    value: foo = 1
});
console.log(foo);
