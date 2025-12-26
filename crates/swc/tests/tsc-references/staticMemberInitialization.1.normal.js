//// [staticMemberInitialization.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap();
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
__.set(C, {
    writable: true,
    value: C.x = 1
});
var c = new C();
var r = C.x;
