import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
var _foo = /*#__PURE__*/ new WeakMap();
// @target: es2015
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: 1
        });
    }
}
var _foo = {
    writable: true,
    value: true
}// error (duplicate)
;
class B {
    test(x) {
        _class_static_private_field_spec_get(x, B, _foo1); // error (#foo is a static property on B, not an instance property)
    }
}
var _foo1 = {
    writable: true,
    value: true
};
