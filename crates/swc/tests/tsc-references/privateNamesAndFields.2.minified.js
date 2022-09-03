//// [privateNamesAndFields.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _foo = new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _foo, 3);
    }
}
var _foo1 = new WeakMap();
class B extends A {
    constructor(){
        super(), _class_private_field_init(this, _foo1, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _foo1, "some string");
    }
}
