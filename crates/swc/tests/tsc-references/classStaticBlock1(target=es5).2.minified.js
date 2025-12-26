//// [classStaticBlock1.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new WeakMap().set(function C() {
    _class_call_check(this, C);
}, {
    writable: !0,
    value: void 0
});
