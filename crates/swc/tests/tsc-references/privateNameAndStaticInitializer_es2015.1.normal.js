// @target: esnext, es2022, es2015
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo = /*#__PURE__*/ new WeakMap(), _prop = /*#__PURE__*/ new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: 1
        });
        _class_private_field_init(this, _prop, {
            writable: true,
            value: 2
        });
    }
}
A.inst = new A();
