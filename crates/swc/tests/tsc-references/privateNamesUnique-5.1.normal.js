//// [privateNamesUnique-5.ts]
// same as privateNamesUnique-1, but with an interface
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
var _foo = /*#__PURE__*/ new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: void 0
        });
    }
}
var _foo1 = /*#__PURE__*/ new WeakMap();
class B {
    constructor(){
        _class_private_field_init(this, _foo1, {
            writable: true,
            value: void 0
        });
    }
}
const b = new B();
