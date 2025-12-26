//// [classStaticBlock27.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Foo, __ = new WeakMap(), __2 = new WeakMap(), __3 = new WeakMap(), __4 = new WeakMap();
Foo = function Foo() {
    _class_call_check(this, Foo);
}, __.set(Foo, {
    writable: !0,
    value: Foo.prop = 1
}), __2.set(Foo, {
    writable: !0,
    value: void (console.log(Foo.prop), Foo.prop++)
}), __3.set(Foo, {
    writable: !0,
    value: void (console.log(Foo.prop), Foo.prop++)
}), __4.set(Foo, {
    writable: !0,
    value: void (console.log(Foo.prop), Foo.prop++)
});
