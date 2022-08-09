// @strict: true
// @target: es6
// @strictPropertyInitialization: false
// same as privateNamesUnique-1, but with an interface
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
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
