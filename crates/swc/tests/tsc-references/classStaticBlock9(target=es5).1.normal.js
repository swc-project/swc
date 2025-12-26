//// [classStaticBlock9.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap(), __2 = new WeakMap(), __3 = new WeakMap();
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
__.set(A, {
    writable: true,
    value: A.bar = A.foo + 1
});
__2.set(A, {
    writable: true,
    value: A.foo + 2
});
__3.set(A, {
    writable: true,
    value: A.foo = 1
});
