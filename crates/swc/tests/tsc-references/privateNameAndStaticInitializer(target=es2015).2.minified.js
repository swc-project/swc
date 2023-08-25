//// [privateNameAndStaticInitializer.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _foo = /*#__PURE__*/ new WeakMap(), _prop = /*#__PURE__*/ new WeakMap();
class A {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: !0,
            value: void 0
        }), _class_private_field_init(this, _prop, {
            writable: !0,
            value: void 0
        }), _class_private_field_set(this, _foo, 1), _class_private_field_set(this, _prop, 2);
    }
}
A.inst = new A();
