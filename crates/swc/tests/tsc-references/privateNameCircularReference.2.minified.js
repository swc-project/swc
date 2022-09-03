//// [privateNameCircularReference.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo = new WeakMap(), _bar = new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: !0,
            value: _class_private_field_get(this, _bar)
        }), _class_private_field_init(this, _bar, {
            writable: !0,
            value: _class_private_field_get(this, _foo)
        }), this["#baz"] = this["#baz"];
    }
}
