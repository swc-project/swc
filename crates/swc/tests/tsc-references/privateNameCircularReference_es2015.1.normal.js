import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo = /*#__PURE__*/ new WeakMap(), _bar = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target: es6
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: _class_private_field_get(this, _bar)
        });
        _class_private_field_init(this, _bar, {
            writable: true,
            value: _class_private_field_get(this, _foo)
        });
        this["#baz"] = this["#baz"] // Error (should *not* be private name error)
        ;
    }
}
