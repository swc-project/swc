//// [privateNamesUnique-1.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo = new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: !0,
            value: void 0
        });
    }
}
var _foo1 = new WeakMap();
class B {
    constructor(){
        _class_private_field_init(this, _foo1, {
            writable: !0,
            value: void 0
        });
    }
}
let b = new B();
