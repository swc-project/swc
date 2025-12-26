//// [staticMemberInitialization.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap(), C = function C() {
    _class_call_check(this, C);
};
__.set(C, {
    writable: !0,
    value: C.x = 1
}), new C(), C.x;
