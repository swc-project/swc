//// [typeOfThisInStaticMembers2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new WeakMap();
var __1 = new WeakMap(), C2 = function C2() {
    _class_call_check(this, C2);
};
__1.set(C2, {
    writable: !0,
    value: C2.foo = C2
});
