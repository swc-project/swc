import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
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
