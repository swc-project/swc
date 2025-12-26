//// [classStaticBlock9.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap(), __2 = new WeakMap(), __3 = new WeakMap(), A = function A() {
    _class_call_check(this, A);
};
__.set(A, {
    writable: !0,
    value: A.bar = A.foo + 1
}), __2.set(A, {
    writable: !0,
    value: A.foo + 2
}), __3.set(A, {
    writable: !0,
    value: A.foo = 1
});
