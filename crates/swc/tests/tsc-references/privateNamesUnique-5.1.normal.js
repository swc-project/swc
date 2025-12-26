//// [privateNamesUnique-5.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
var _foo = new WeakMap(), _foo1 = new WeakMap();
// same as privateNamesUnique-1, but with an interface
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: void 0
        });
    }
}
class B {
    constructor(){
        _class_private_field_init(this, _foo1, {
            writable: true,
            value: void 0
        });
    }
}
const b = new B();
