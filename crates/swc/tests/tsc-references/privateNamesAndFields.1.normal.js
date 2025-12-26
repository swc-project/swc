//// [privateNamesAndFields.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _foo = /*#__PURE__*/ new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _foo, 3);
    }
}
var _foo1 = /*#__PURE__*/ new WeakMap();
class B extends A {
    constructor(){
        super(), _class_private_field_init(this, _foo1, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _foo1, "some string");
    }
}
