import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
var _foo = new WeakMap(), _prop = new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: !0,
            value: 1
        }), _class_private_field_init(this, _prop, {
            writable: !0,
            value: 2
        });
    }
}
A.inst = new A();
