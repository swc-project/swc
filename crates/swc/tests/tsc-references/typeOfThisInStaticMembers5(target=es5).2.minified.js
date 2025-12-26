//// [typeOfThisInStaticMembers5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap(), C = function C(foo) {
    _class_call_check(this, C), this.foo = foo;
};
__.set(C, {
    writable: !0,
    value: C.create = function() {
        return new C("yep");
    }
});
