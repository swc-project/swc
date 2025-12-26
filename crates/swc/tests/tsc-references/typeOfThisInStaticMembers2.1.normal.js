//// [typeOfThisInStaticMembers2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap(), __1 = new WeakMap();
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
__1.set(C2, {
    writable: true,
    value: C2.foo = C2 // ok
});
