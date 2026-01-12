//// [foo1.ts]
var x = {
    a: "test",
    b: 42
};
export { };
 // Should fail, I1 not exported.
//// [foo2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
};
export { };
 // Should fail, type I1 of visible member C1.m1 not exported.
//// [foo3.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
};
export { };
 // Should work, private type I1 of visible class C1 only used in private member m1.
